import { FAILED, VALIDATION, NO, YES } from "../../../../config/apiStatuses.js";
import { getFormFieldErrors } from "../../../../config/localMasterData.js";
import validatorAdapter from "../../../../libs/validator.js";
import ErrorHandler from "../../../../utils/errorHandler.js";
import Users from "../models/users.js";
import {
  successResponse,
  verifyResponse,
} from "../../../../utils/apiResponsesHelper.js";
import { generateToken } from "./sessionControllers.js";
import {
  generateOtp,
  generateOtpExpiry,
  sendOtpEmail,
} from "../../../../utils/nodemailerHelpers.js";
import { saveFcm } from "./fcmControllers.js";
import { genderValues } from "../../../../constants/formValues.js";

// const registerUser = async (req, res, next) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       email,
//       country_code,
//       phone,
//       password,
//       c_password,
//     } = req.body;

//     // Validate form fields
//     const errors = {};
//     for (const [fieldName, fieldValue] of Object.entries(req.body)) {
//       if (validatorAdapter.isEmpty(fieldValue.toString())) {
//         const formError = getFormFieldErrors()[fieldName];
//         if (formError) {
//           const { key, message } = formError;
//           errors[key] = message;
//         }
//       }
//     }
//     if (Object.keys(errors).length > 0) {
//       throw new ErrorHandler(
//         VALIDATION,
//         400,
//         "Enter the form fields correctly",
//         { errors }
//       );
//     }

//     // Create new user
//     const userData = new Users({
//       first_name,
//       last_name,
//       email,
//       country_code,
//       phone,
//       password,
//       c_password,
//     });
//     await userData.upsertNormalUser(req, res, next, Users);
//   } catch (e) {
//     next(e);
//   }
// };

const createNewUser = async (req) => {
  try {
    const { mobile } = req.body;
    const otpCode = req.otp_code;
    const otpExpiry = req.otp_expiry;
    if (mobile) {
      const newUserDetail = new Users({
        mobile,
        otp_code: otpCode,
        otp_expiry: otpExpiry,
      });
      await newUserDetail.save();
      return newUserDetail;
    }
  } catch (e) {
    throw e;
  }
};

const findUser = async (id, data, selectFields) => {
  try {
    let query;
    if (id) {
      query = await Users.findById(id);
    } else {
      query = await Users.findOne(data);
    }
    if (selectFields) {
      query = query.select(selectFields);
    }
    const userData = await query;
    return userData;
  } catch (e) {
    throw e;
  }
};

const updateUser = async (id, updateData) => {
  try {
    if (!id) {
      throw new ErrorHandler(FAILED, 400, "FCM ID is required");
    }

    const updatedFcm = await Users.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return updatedFcm;
  } catch (error) {
    throw error;
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const isValidMobile = await validatorAdapter.isMobilePhone(mobile);
    if (!isValidMobile) {
      throw new ErrorHandler(FAILED, 400, "Invalid mobile no.");
    }

    const userExists = await Users.findOne({ mobile }).select(
      "+otp_code +otp_expiry"
    );
    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();
    console.log({ otp, otpExpiry: new Date(otpExpiry).toLocaleString() });
    let userData = {};
    if (userExists) {
      const user_id = userExists._id;
      userData = await updateUser(user_id, {
        otp_code: otp,
        otp_expiry: otpExpiry,
      });
    } else {
      req.otp_code = otp;
      req.otp_expiry = otpExpiry;
      userData = await createNewUser(req);
    }
    const userId = userData._id;
    const responseData = { user_id: userId };
    successResponse(
      req,
      res,
      undefined,
      responseData,
      "OTP sent to your email"
    );
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { user_id, otp } = req.body;

    if (user_id && !validatorAdapter.isMongoId(user_id)) {
      throw new ErrorHandler(undefined, 400, "Invalid user!");
    }

    const existingUserDetail = await findUser(
      user_id,
      null,
      "+otp_code +otp_expiry +mobile_verified"
    );
    if (!existingUserDetail) {
      throw new ErrorHandler(undefined, 400, "Invalid user!");
    }
    const userReqOtp = Number(otp);
    const isOtpExpired = new Date() > new Date(existingUserDetail.otp_expiry);
    if (isOtpExpired) {
      throw new ErrorHandler(
        400,
        undefined,
        "Otp expired. Please enter new otp."
      );
    } else if (existingUserDetail.otp_code !== userReqOtp && !isOtpExpired) {
      throw new ErrorHandler(400, undefined, "Please enter a correct otp.");
    }
    req.user = existingUserDetail;
    req.auth = existingUserDetail._id;

    // if otp matched then setting activated and is_mobile_verified to "Y" . Also setting otp_code and otp_expiry blank
    await updateUser(existingUserDetail._id, {
      activated: YES,
      is_mobile_verified: YES,
      $unset: { otp_code: "", otp_expiry: "" },
    });
    let action = "";
    if (validatorAdapter.isEmpty(existingUserDetail.f_name)) {
      action = "signup_name";
    } else if (validatorAdapter.isEmpty(existingUserDetail.first_motor_cycle)) {
      action = "first_motorcycle";
    } else {
      action = "dashboard";
    }
    const session_id = await generateToken(req, res, next);
    await saveFcm(req, res, next);
    const response = {
      session_id,
      action,
    };
    return successResponse(req, res, 200, response);
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUserDetail = await Users.findOne({ email })
      .select("+password +activated")
      .select("-id ");
    // Handle login result
    const isPasswordMatch =
      existingUserDetail && (await existingUserDetail.decodeHash(password));
    if (existingUserDetail && isPasswordMatch) {
      if (existingUserDetail.activated === NO) {
        return verifyResponse(req, res);
      }
      req.user = existingUserDetail;
      req.auth = existingUserDetail._id;

      // Clone the userData object and remove sensitive fields
      const userDataWithoutSensitiveFields = {
        ...existingUserDetail.toObject(),
        password: undefined,
        activated: undefined,
        _id: undefined,
      };
      const session_id = await generateToken(req, res, next);
      await saveFcm(req, res, next);
      const response = {
        session_id,
        ...userDataWithoutSensitiveFields,
      };
      return successResponse(req, res, 200, response);
    } else {
      throw new ErrorHandler(
        FAILED,
        400,
        "Please login with correct credentials."
      );
    }
  } catch (e) {
    next(e);
  }
};
const saveSignUpDetails = async (req, res, next) => {
  try {
    const { first_name, last_name, gender } = req.body;
    const formFields = { first_name, last_name, gender };

    // Validate form fields
    const errors = {};
    for (const [fieldName, fieldValue] of Object.entries(formFields)) {
      if (validatorAdapter.isEmpty(fieldValue.toString())) {
        const formError = getFormFieldErrors()[fieldName];
        if (formError) {
          const { key, message } = formError;
          errors[key] = message;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ErrorHandler(
        VALIDATION,
        400,
        "Enter the form fields correctly",
        { errors }
      );
    }
    let updatedGender = genderValues[gender.toString().toLowerCase()] ?? "";
    const userId = req.user?._id;
    const updatedUserDetails = await updateUser(userId, {
      f_name: first_name,
      l_name: last_name,
      gender: updatedGender,
    });

    if (updatedUserDetails) {
      successResponse(
        req,
        res,
        undefined,
        undefined,
        "Data saved successfully."
      );
    }
  } catch (e) {
    next(e);
  }
};

export { sendOtp, loginUser, findUser, verifyOtp, saveSignUpDetails };
