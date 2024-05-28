import { FAILED, VALIDATION, NO, YES } from "../../../config/apiStatuses.js";
import { getFormFieldErrors } from "../../../config/localMasterData.js";
import validatorAdapter from "../../../libs/validator.js";
import ErrorHandler from "../../../utils/errorHandler.js";
import Users from "../models/users.js";
import {
  successResponse,
  verifyResponse,
} from "../../../utils/apiResponsesHelper.js";
import { generateToken } from "./sessionControllers.js";
import { saveFcm } from "./fcmControllers.js";
import { sendOtpEmail } from "../../../utils/nodemailerHelpers.js";

const registerUser = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      country_code,
      phone,
      password,
      c_password,
    } = req.body;

    // Validate form fields
    const errors = {};
    for (const [fieldName, fieldValue] of Object.entries(req.body)) {
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

    // Create new user
    const userData = new Users({
      first_name,
      last_name,
      email,
      country_code,
      phone,
      password,
      c_password,
    });
    await userData.upsertNormalUser(req, res, next, Users);
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
        return verifyResponse(res);
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
        response_data: { session_id, ...userDataWithoutSensitiveFields },
      };
      return successResponse(res, 200, response);
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

const verifyOtp = async (req, res, next) => {
  try {
    const { fcm_id, email, otp } = req.body;
    const existingUserDetail = await Users.findOne({ email }).select(
      "+activation_code"
    );
    if (!existingUserDetail) {
      throw new ErrorHandler(400, undefined, "Email is not valid");
    }
    const userOtp = Number(otp);
    if (existingUserDetail.activation_code !== userOtp) {
      throw new ErrorHandler(400, undefined, "Please enter a correct otp.");
    }
    req.user = existingUserDetail;
    req.auth = existingUserDetail._id;

    // if otp matched then setting activated to "Y"
    await updateUser(existingUserDetail._id, {
      activated: YES,
      $unset: { activation_code: "" },
    });

    // Clone the userData object and remove sensitive fields
    const userDataWithoutSensitiveFields = {
      ...existingUserDetail.toObject(),
      password: undefined,
      activation_code: undefined,
      _id: undefined,
    };
    await saveFcm(req, res, next);
    const session_id = await generateToken(req, res, next);
    const response = {
      response_data: { session_id, ...userDataWithoutSensitiveFields },
    };
    return successResponse(res, 200, response);
    res.send(existingUserDetail);
  } catch (e) {
    next(e);
  }
};

const findUser = async (id, data) => {
  try {
    const userData = (await id) ? Users.findById(id) : Users.find(data);
    return userData;
  } catch (e) {
    next(e);
  }
};

const updateUser = async (id, updateData) => {
  try {
    if (!id) {
      throw new ErrorHandler("User ID is required", 400, "No ID provided");
    }

    const updatedUser = await Users.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      throw new ErrorHandler(
        "User not found",
        404,
        `No user found with ID: ${id}`
      );
    }

    return updatedUser;
  } catch (error) {
    throw new ErrorHandler("Failed to update user", 500, error.message);
  }
};

export { registerUser, loginUser, findUser, verifyOtp };
