import { FAILED, YES } from "../../../../config/apiStatuses.js";
import validatorAdapter from "../../../../libs/validator.js";
import ErrorHandler from "../../../../utils/errorHandler.js";
import Users from "../models/users.model.js";
import {
  loginResponse,
  successResponse,
} from "../../../../utils/apiResponsesHelper.js";
import {
  findSession,
  generateToken,
  updateSession,
} from "./session.controllers.js";
import {
  generateOtp,
  generateOtpExpiry,
} from "../../../../utils/nodemailerHelpers.js";
import { saveFcm } from "./fcm.controllers.js";
import {
  accountTypes,
  genderValues,
} from "../../../../constants/schemaValues.js";
import {
  getClientIp,
  getClientSource,
} from "../../../../utils/networkHelper.js";
import dateUtils from "../../../../libs/datefns.js";
import mastersControllers from "./masters.controllers.js";
import mastersData from "../models/mastersData.model.js";
import { validateFormErrors } from "../../../../utils/formValidationHelper.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";

// ========================Extra functions=============================

const getUserProfileDetails = (user_data) => {
  try {
    const userProfile = { ...user_data.toObject() };
    // console.log(userProfile);
    userProfile.member_since = dateUtils.getDate(
      new Date(userProfile.registered_date_time)
    );
    userProfile.first_name = userProfile.f_name;
    userProfile.last_name = userProfile.l_name;
    userProfile.dob = userProfile.dob || "";
    userProfile.account_type = userProfile.account_type || "";
    userProfile.profile_picture = userProfile.profile_picture || "";
    userProfile.blood_group = userProfile.blood_group || "";

    // Use 'delete' to remove all the field
    delete userProfile._id;
    delete userProfile.f_name;
    delete userProfile.l_name;
    delete userProfile.new_mobile;
    delete userProfile.mobile_verified;
    delete userProfile.otp_code;
    delete userProfile.otp_expiry;
    delete userProfile.activated;
    delete userProfile.registered_date;
    delete userProfile.registered_date_time;
    delete userProfile.registration_ip;
    delete userProfile.registration_source;
    delete userProfile.last_login_date_time;
    delete userProfile.last_login_ip;
    delete userProfile.timestamps;
    delete userProfile.created_at;
    delete userProfile.updated_at;
    return userProfile;
  } catch (e) {
    throw e;
  }
};

const getLoginActionScreen = (user_details) => {
  let action = "";

  if (
    user_details?.new_mobile !== undefined &&
    user_details?.new_mobile !== null &&
    !validatorAdapter.isEmpty(user_details.new_mobile.toString())
  ) {
    action = "verify_new_mobile";
  } else if (validatorAdapter.isEmpty(user_details?.f_name)) {
    action = "signup_name";
  } else {
    const userAccountType = user_details?.account_type;
    if (
      validatorAdapter.isEmpty(userAccountType) ||
      (userAccountType === accountTypes.rider &&
        validatorAdapter.isEmpty(user_details?.first_motorcycle))
    ) {
      action = "first_motorcycle";
    } else if (
      (userAccountType === accountTypes.rider &&
        !validatorAdapter.isEmpty(user_details?.first_motorcycle)) ||
      userAccountType === accountTypes.family
    ) {
      action = "dashboard";
    }
  }
  return action;
};

const generateAndSendOtp = (mobile_no) => {
  const otp = generateOtp();
  const otpExpiry = generateOtpExpiry();
  const isOtpSendToMobile = true;
  if (isOtpSendToMobile) {
    console.log({
      mobile_no: Number(mobile_no),
      otp,
      otpExpiry: new Date(otpExpiry).toLocaleString(),
    });
    return { otp, otpExpiry };
  }
};

// ========================Extra functions=============================

// <====================== createNewUser ====================>

const createNewUser = async (req) => {
  try {
    const { mobile } = req.body;
    const otpCode = req.otp_code;
    const otpExpiry = req.otp_expiry;
    const registeredIpAddress = getClientIp(req);
    const registeredSource = getClientSource(req);
    if (mobile) {
      const newUserDetail = new Users({
        mobile,
        otp_code: otpCode,
        otp_expiry: otpExpiry,
        registration_ip: registeredIpAddress,
        registration_source: registeredSource,
      });
      await newUserDetail.save();
      return newUserDetail;
    }
  } catch (e) {
    throw e;
  }
};

// <====================== createNewUser ====================>

// <====================== findUser ====================>

const findUser = async (id, data, options = {}) => {
  try {
    let query = id
      ? Users.findById(id, null, { ...options })
      : Users.findOne(data, null, { ...options });

    const userData = await query.exec();
    return userData;
  } catch (e) {
    throw e;
  }
};

// <====================== findUser ====================>

// <====================== updateUser ====================>

const updateUser = async (id, updateData, options) => {
  try {
    if (!id) {
      throw new ErrorHandler(FAILED, 400, "User ID is required");
    }

    const updatedFcm = await Users.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      ...options,
    });
    return updatedFcm;
  } catch (error) {
    throw error;
  }
};

// <====================== updateUser ====================>

// <====================== sendOtp ====================>

const sendOtp = asyncHandler(async (req, res, next) => {
  const { mobile } = req.body;
  const isValidMobile = await validatorAdapter.isMobilePhone(mobile);
  if (!isValidMobile) {
    throw new ErrorHandler(FAILED, 400, "Invalid mobile no.");
  }

  const userExists = await findUser(
    undefined,
    { $or: [{ mobile: mobile }, { new_mobile: mobile }] },
    { select: "+otp_code +otp_expiry" }
  );

  const { otp, otpExpiry } = generateAndSendOtp(mobile);
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
    "OTP sent to your Mobile Number"
  );
});

// <====================== sendOtp ====================>

// <====================== verifyOtp ====================>

const verifyOtp = asyncHandler(async (req, res, next) => {
  const { user_id, otp } = req.body;
  if (
    (user_id && !validatorAdapter.isMongoId(user_id)) ||
    validatorAdapter.isEmpty(user_id)
  ) {
    throw new ErrorHandler(undefined, 400, "Invalid user!");
  }

  const existingUserDetail = await findUser(user_id, null, {
    select: "+otp_code +otp_expiry +mobile_verified +new_mobile",
  });
  if (!existingUserDetail) {
    throw new ErrorHandler(undefined, 400, "User not found");
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
  // req.user = existingUserDetail;
  req.auth = existingUserDetail._id;
  const lastLoginIpAddress = getClientIp(req);
  const lastLoginDateTime = new Date();

  const updatedData = {
    activated: YES,
    mobile_verified: YES,
    last_login_ip: lastLoginIpAddress,
    last_login_date_time: lastLoginDateTime,
    $unset: { otp_code: "", otp_expiry: "" },
  };

  // If new_mobile number is there in database and otp is verified then it will replaced to existing mobile no
  if (!validatorAdapter.isEmpty(existingUserDetail.new_mobile)) {
    (updatedData.mobile = existingUserDetail.new_mobile),
      (updatedData.$unset.new_mobile = "");
  }

  // if otp matched then setting activated and is_mobile_verified to "Y" . Also setting otp_code and otp_expiry blank
  await updateUser(existingUserDetail._id, updatedData);
  let loginActionScreen = getLoginActionScreen(existingUserDetail);

  const session_id = await generateToken(req, res, next);
  await saveFcm(req, res, next);
  const response = {
    session_id,
    action: loginActionScreen,
  };
  return successResponse(req, res, 200, response);
});

// <====================== verifyOtp ====================>

// <====================== loginCheck ====================>

const loginCheck = asyncHandler(async (req, res, next) => {
  const session = req.session_token;
  const userDetails = req.user;
  if (!session) {
    loginResponse(req, res, 400, "Session expired! Please login again");
  }
  const userId = userDetails._id || "";
  const lastLoginIpAddress = getClientIp(req);
  const lastLoginDateTime = new Date();

  await updateUser(userId, {
    last_login_ip: lastLoginIpAddress,
    last_login_date_time: lastLoginDateTime,
  });
  const responseUserDetails = getUserProfileDetails(userDetails);
  let loginActionScreen = getLoginActionScreen(userDetails);
  const response = {
    session_id: session,
    action: loginActionScreen,
    profile: responseUserDetails,
  };
  return successResponse(req, res, 200, response);
});

// <====================== loginCheck ====================>

// <====================== logoutUser ====================>

const logoutUser = asyncHandler(async (req, res, next) => {
  const sessionToken = req.session_token;
  const sessionArray = await findSession(
    undefined,
    { token: sessionToken },
    undefined
  );
  const session = sessionArray[0];
  const isSessionLoggedOut =
    session && new Date(session.log_out_date_time) < new Date();
  if (!session) {
    return loginResponse(req, res, 400, "Session expired! Please login again");
  } else if (isSessionLoggedOut) {
    return loginResponse(req, res, 400, "You must be logged in");
  }
  const logoutDateTime = new Date();
  // if otp matched then setting activated and is_mobile_verified to "Y" . Also setting otp_code and otp_expiry blank
  const sessionId = session._id;
  await updateSession(sessionId, undefined, {
    log_out_date_time: logoutDateTime,
  });

  return successResponse(req, res, 200);
});

// <====================== logoutUser ====================>

// <====================== deleteUserAccount ====================>

const deleteUserAccount = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  const sessionId = req.session_token;
  const userDetails = req.user;
  const userId = userDetails._id;

  const userReqOtp = Number(otp);
  if (isNaN(userReqOtp)) {
    throw new ErrorHandler(400, undefined, "Invalid OTP format.");
  }

  const isOtpExpired =
    !userDetails.otp_expiry || new Date() > new Date(userDetails.otp_expiry);
  if (isOtpExpired) {
    const { otp: newOtp, otpExpiry } = generateAndSendOtp(userDetails.mobile);
    await updateUser(
      userId,
      {
        otp_code: newOtp,
        otp_expiry: otpExpiry,
      },
      { select: "+otp_code" }
    );

    throw new ErrorHandler(
      400,
      undefined,
      "OTP expired. Please enter the new OTP sent to your mobile."
    );
  }

  if (userDetails.otp_code !== userReqOtp) {
    throw new ErrorHandler(400, undefined, "Incorrect OTP. Please try again.");
  }

  await Users.findByIdAndDelete(userId);
  const logoutDateTime = new Date();

  await updateSession(
    undefined,
    { token: sessionId },
    {
      log_out_date_time: logoutDateTime,
      force_logout: YES,
    }
  );

  return successResponse(
    req,
    res,
    200,
    undefined,
    "Account deleted successfully."
  );
});

// <====================== deleteUserAccount ====================>

// <====================== saveSignUpDetails ====================>

const saveSignUpDetails = asyncHandler(async (req, res, next) => {
  const { first_name = "", last_name = "", gender = "" } = req.body;
  const formFields = { first_name, last_name, gender };
  const userDetails = req.user;

  // Validate form fields
  await validateFormErrors(formFields);

  let updatedGender = genderValues[gender.toString().toLowerCase()] ?? "";
  const userId = userDetails._id;
  const updatedUserDetails = await updateUser(userId, {
    f_name: first_name,
    l_name: last_name,
    gender: updatedGender,
  });

  if (updatedUserDetails) {
    successResponse(req, res, undefined, undefined, "Data saved successfully.");
  }
});

// <====================== saveSignUpDetails ====================>

// <====================== saveUserProfile ====================>

const saveUserProfile = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, mobile, gender, dob, blood_group } = req.body;
  const formFields = {
    first_name,
    last_name,
    mobile,
    gender,
    dob,
    blood_group,
  };
  // Validate form fields
  await validateFormErrors(formFields);

  let updatedGender = genderValues[gender.toString().toLowerCase()] ?? "";
  const userDetails = req.user;
  const userId = userDetails._id;

  const isNumberUndertakenByOtherUser = await findUser(undefined, {
    _id: { $ne: userId }, // Use $ne to check for users other than the current one
    mobile,
  });

  if (isNumberUndertakenByOtherUser) {
    throw new ErrorHandler(
      undefined,
      undefined,
      "Mobile associated with another account"
    );
  }

  const updatedData = {
    f_name: first_name,
    l_name: last_name,
    gender: updatedGender,
    dob,
    blood_group: blood_group,
  };
  // check wheter the mobile is same as existing then don't update mobile
  let updatedUserDetails = null;
  if (userDetails.mobile === Number(mobile)) {
    updatedUserDetails = await updateUser(userId, {
      ...updatedData,
      $unset: {
        new_mobile: "",
        otp_code: "",
        otp_expiry: "",
      },
    });
  } else {
    const { otp, otpExpiry } = generateAndSendOtp(mobile);
    updatedUserDetails = await updateUser(
      userId,
      {
        ...updatedData,
        new_mobile: mobile,
        otp_code: otp,
        otp_expiry: otpExpiry,
      },
      { select: "+new_mobile" }
    );
  }
  let loginActionScreen = getLoginActionScreen(updatedUserDetails);
  const session_id = req.session_token;
  const response = {
    session_id,
    action: loginActionScreen,
  };
  if (updatedUserDetails) {
    successResponse(
      req,
      res,
      undefined,
      response,
      "Profile updated successfully."
    );
  }
});

// <====================== saveUserProfile ====================>

// <====================== verifyNewMobile ====================>

const verifyNewMobile = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  const sessionId = req.session_token;
  const userDetails = req.user;

  const userReqOtp = Number(otp);
  const isOtpExpired = new Date() > new Date(userDetails.otp_expiry);
  if (isOtpExpired) {
    throw new ErrorHandler(
      400,
      undefined,
      "Otp expired. Please enter new otp."
    );
  } else if (userDetails.otp_code !== userReqOtp && !isOtpExpired) {
    throw new ErrorHandler(400, undefined, "Please enter a correct otp.");
  }
  const userId = userDetails._id;
  const newMobile = userDetails.new_mobile;
  await updateUser(userId, {
    mobile: newMobile,
    $unset: { otp_code: "", otp_expiry: "", new_mobile: "" },
  });
  await updateSession(undefined, { token: sessionId }, { mobile: newMobile });
  return successResponse(
    req,
    res,
    200,
    undefined,
    "Mobile verified successfully"
  );
});

// <====================== verifyNewMobile ====================>

// <====================== resendOtpToNewMobile ====================>

const resendOtpToNewMobile = asyncHandler(async (req, res, next) => {
  const userDetails = req.user;
  const userNewMobile = userDetails.new_mobile;
  if (!userNewMobile) {
    return res.send("No new no");
  }
  const { otp, otpExpiry } = generateAndSendOtp(userNewMobile);
  const userId = userDetails._id;
  const updatedUserDetails = await updateUser(userId, {
    otp_code: otp,
    otp_expiry: otpExpiry,
  });
  if (updatedUserDetails) {
    successResponse(
      req,
      res,
      undefined,
      undefined,
      "OTP resent to the new mobile"
    );
  }
});
// <====================== resendOtpToNewMobile ====================>

// <====================== getMasters ====================>

const getMasters = asyncHandler(async (req, res, next) => {
  const expenseTypes = await mastersControllers.getEntities(
    mastersData.ExpenseType
  );
  const motorcycles = await mastersControllers.getEntities(
    mastersData.Motorcycles
  );
  const motorcycleParts = await mastersControllers.getEntities(
    mastersData.MotorcyclePart
  );
  const rideCancelReasons = await mastersControllers.getEntities(
    mastersData.RideCancelReason
  );
  const bloodGroups = await mastersControllers.getEntities(
    mastersData.BloodGroups
  );
  const response = {
    expense_types: expenseTypes,
    motorcycles,
    motorcycle_parts: motorcycleParts,
    ride_cancel_reasons: rideCancelReasons,
    blood_group: bloodGroups,
  };
  return successResponse(req, res, 200, response);
});

// <====================== getMasters ====================>

// const createNewUser = async (req) => {
//   try {
//     const { mobile } = req.body;
//     const otpCode = req.otp_code;
//     const otpExpiry = req.otp_expiry;
//     const registeredIpAddress = getClientIp(req);
//     const registeredSource = getClientSource(req);
//     if (mobile) {
//       const newUserDetail = new Users({
//         mobile,
//         otp_code: otpCode,
//         otp_expiry: otpExpiry,
//         registration_ip: registeredIpAddress,
//         registration_source: registeredSource,
//       });
//       await newUserDetail.save();
//       return newUserDetail;
//     }
//   } catch (e) {
//     throw e;
//   }
// };

// const findUser = async (id, data, options = {}) => {
//   try {
//     let query = id
//       ? Users.findById(id, null, { ...options })
//       : Users.findOne(data, null, { ...options });

//     const userData = await query.exec();
//     return userData;
//   } catch (e) {
//     throw e;
//   }
// };

// const updateUser = async (id, updateData, options) => {
//   try {
//     if (!id) {
//       throw new ErrorHandler(FAILED, 400, "User ID is required");
//     }

//     const updatedFcm = await Users.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//       ...options,
//     });
//     return updatedFcm;
//   } catch (error) {
//     throw error;
//   }
// };

// const sendOtp = asyncHandler(async (req, res, next) => {
//   const { mobile } = req.body;
//   const isValidMobile = await validatorAdapter.isMobilePhone(mobile);
//   if (!isValidMobile) {
//     throw new ErrorHandler(FAILED, 400, "Invalid mobile no.");
//   }

//   const userExists = await findUser(
//     undefined,
//     { mobile },
//     { select: "+otp_code +otp_expiry" }
//   );
//   const otp = generateOtp();
//   const otpExpiry = generateOtpExpiry();
//   console.log({
//     otp,
//     otpExpiry: new Date(otpExpiry).toLocaleString(),
//   });
//   let userData = {};
//   if (userExists) {
//     const user_id = userExists._id;
//     userData = await updateUser(user_id, {
//       otp_code: otp,
//       otp_expiry: otpExpiry,
//     });
//   } else {
//     req.otp_code = otp;
//     req.otp_expiry = otpExpiry;
//     userData = await createNewUser(req);
//   }
//   const userId = userData._id;
//   const responseData = { user_id: userId };
//   successResponse(req, res, undefined, responseData, "OTP sent to your email");
// });

// const verifyOtp = asyncHandler(async (req, res, next) => {
//   const { user_id, otp } = req.body;
//   if (
//     (user_id && !validatorAdapter.isMongoId(user_id)) ||
//     validatorAdapter.isEmpty(user_id)
//   ) {
//     throw new ErrorHandler(undefined, 400, "Invalid user!");
//   }

//   const existingUserDetail = await findUser(user_id, null, {
//     select: "+otp_code +otp_expiry +mobile_verified +new_mobile",
//   });
//   if (!existingUserDetail) {
//     throw new ErrorHandler(undefined, 400, "User not found");
//   }
//   const userReqOtp = Number(otp);
//   const isOtpExpired = new Date() > new Date(existingUserDetail.otp_expiry);
//   if (isOtpExpired) {
//     throw new ErrorHandler(
//       400,
//       undefined,
//       "Otp expired. Please enter new otp."
//     );
//   } else if (existingUserDetail.otp_code !== userReqOtp && !isOtpExpired) {
//     throw new ErrorHandler(400, undefined, "Please enter a correct otp.");
//   }
//   // req.user = existingUserDetail;
//   req.auth = existingUserDetail._id;
//   const lastLoginIpAddress = getClientIp(req);
//   const lastLoginDateTime = new Date();

//   const updatedData = {
//     activated: YES,
//     mobile_verified: YES,
//     last_login_ip: lastLoginIpAddress,
//     last_login_date_time: lastLoginDateTime,
//     $unset: { otp_code: "", otp_expiry: "" },
//   };

//   // If new_mobile number is there in database and otp is verified then it will replaced to existing mobile no
//   if (!validatorAdapter.isEmpty(existingUserDetail.new_mobile)) {
//     (updatedData.mobile = existingUserDetail.new_mobile),
//       (updatedData.$unset.new_mobile = "");
//   }

//   // if otp matched then setting activated and is_mobile_verified to "Y" . Also setting otp_code and otp_expiry blank
//   await updateUser(existingUserDetail._id, updatedData);
//   let loginActionScreen = getLoginActionScreen(existingUserDetail);

//   const session_id = await generateToken(req, res, next);
//   await saveFcm(req, res, next);
//   const response = {
//     session_id,
//     action: loginActionScreen,
//   };
//   return successResponse(req, res, 200, response);
// });

// const loginCheck = asyncHandler(async (req, res, next) => {
//   const session = req.session_token;
//   const userDetails = req.user;
//   if (!session) {
//     loginResponse(req, res, 400, "Session expired! Please login again");
//   }
//   const userId = userDetails._id || "";
//   const lastLoginIpAddress = getClientIp(req);
//   const lastLoginDateTime = new Date();

//   await updateUser(userId, {
//     last_login_ip: lastLoginIpAddress,
//     last_login_date_time: lastLoginDateTime,
//   });
//   const responseUserDetails = getUserProfileDetails(userDetails);
//   let loginActionScreen = getLoginActionScreen(userDetails);
//   const response = {
//     session_id: session,
//     action: loginActionScreen,
//     profile: responseUserDetails,
//   };
//   return successResponse(req, res, 200, response);
// });

// const logoutUser = asyncHandler(async (req, res, next) => {
//   const sessionToken = req.session_token;
//   const sessionArray = await findSession(
//     undefined,
//     { token: sessionToken },
//     undefined
//   );
//   const session = sessionArray[0];
//   const isSessionLoggedOut =
//     session && new Date(session.log_out_date_time) < new Date();
//   if (!session) {
//     return loginResponse(req, res, 400, "Session expired! Please login again");
//   } else if (isSessionLoggedOut) {
//     return loginResponse(req, res, 400, "You must be logged in");
//   }
//   const logoutDateTime = new Date();
//   // if otp matched then setting activated and is_mobile_verified to "Y" . Also setting otp_code and otp_expiry blank
//   const sessionId = session._id;
//   await updateSession(sessionId, undefined, {
//     log_out_date_time: logoutDateTime,
//   });

//   return successResponse(req, res, 200);
// });

// const deleteUserAccount = asyncHandler(async (req, res, next) => {
//   const otp = req.body.otp || null;

//   const sessionId = req.session_token;
//   const userDetails = req.user;
//   const userId = userDetails._id;

//   const userReqOtp = Number(otp);
//   const isOtpExpired =
//     validatorAdapter.isEmpty(userDetails.otp_expiry?.toString()) ||
//     new Date() > new Date(userDetails.otp_expiry);
//   if (isOtpExpired) {
//     const otp = generateOtp();
//     const otpExpiry = generateOtpExpiry();
//     console.log({
//       otp,
//       otpExpiry: new Date(otpExpiry).toLocaleString(),
//     });
//     await updateUser(
//       userId,
//       {
//         otp_code: otp,
//         otp_expiry: otpExpiry,
//       },
//       { select: "+otp_code" }
//     );
//     throw new ErrorHandler(
//       400,
//       undefined,
//       "Otp expired. Please enter new otp."
//     );
//   } else if (userDetails.otp_code !== userReqOtp && !isOtpExpired) {
//     throw new ErrorHandler(400, undefined, "Please enter a correct otp.");
//   }

//   // await Users.findByIdAndDelete(userId);
//   const logoutDateTime = new Date();
//   // if otp matched then setting activated and is_mobile_verified to "Y" . Also setting otp_code and otp_expiry blank
//   await updateSession(
//     undefined,
//     { token: sessionId },
//     {
//       log_out_date_time: logoutDateTime,
//       force_logout: YES,
//     }
//   );

//   return successResponse(
//     req,
//     res,
//     200,
//     undefined,
//     "Account deleted successfully."
//   );
// });

// const saveSignUpDetails = asyncHandler(async (req, res, next) => {
//   const { first_name = "", last_name = "", gender = "" } = req.body;
//   const formFields = { first_name, last_name, gender };
//   const userDetails = req.user;

//   // Validate form fields
//   await validateFormErrors(formFields);

//   let updatedGender = genderValues[gender.toString().toLowerCase()] ?? "";
//   const userId = userDetails._id;
//   const updatedUserDetails = await updateUser(userId, {
//     f_name: first_name,
//     l_name: last_name,
//     gender: updatedGender,
//   });

//   if (updatedUserDetails) {
//     successResponse(req, res, undefined, undefined, "Data saved successfully.");
//   }
// });

// const saveUserProfile = asyncHandler(async (req, res, next) => {
//   const { first_name, last_name, mobile, gender, dob, blood_group } = req.body;
//   const formFields = {
//     first_name,
//     last_name,
//     mobile,
//     gender,
//     dob,
//     blood_group,
//   };
//   // Validate form fields
//   await validateFormErrors(formFields);

//   let updatedGender = genderValues[gender.toString().toLowerCase()] ?? "";
//   const userDetails = req.user;
//   const userId = userDetails._id;

//   const isNumberUndertakenByOtherUser = await findUser(undefined, {
//     _id: { $ne: userId }, // Use $ne to check for users other than the current one
//     mobile,
//   });

//   if (isNumberUndertakenByOtherUser) {
//     throw new ErrorHandler(
//       undefined,
//       undefined,
//       "Mobile associated with another account"
//     );
//   }

//   const updatedData = {
//     f_name: first_name,
//     l_name: last_name,
//     gender: updatedGender,
//     dob,
//     blood_group: blood_group,
//   };
//   // check wheter the mobile is same as existing then don't update mobile
//   let updatedUserDetails = null;
//   if (userDetails.mobile === mobile) {
//     updatedUserDetails = await updateUser(userId, updatedData);
//   } else {
//     const otp = generateOtp();
//     const otpExpiry = generateOtpExpiry();
//     console.log({
//       otp,
//       otpExpiry: new Date(otpExpiry).toLocaleString(),
//     });
//     updatedUserDetails = await updateUser(
//       userId,
//       {
//         ...updatedData,
//         new_mobile: mobile,
//         otp_code: otp,
//         otp_expiry: otpExpiry,
//       },
//       { select: "+new_mobile" }
//     );
//   }
//   let loginActionScreen = getLoginActionScreen(updatedUserDetails);
//   const session_id = req.session_token;
//   const response = {
//     session_id,
//     action: loginActionScreen,
//   };
//   if (updatedUserDetails) {
//     successResponse(
//       req,
//       res,
//       undefined,
//       response,
//       "Profile updated successfully."
//     );
//   }
// });

// const verifyNewMobile = asyncHandler(async (req, res, next) => {
//   const { otp } = req.body;
//   const sessionId = req.session_token;
//   const userDetails = req.user;

//   const userReqOtp = Number(otp);
//   const isOtpExpired = new Date() > new Date(userDetails.otp_expiry);
//   if (isOtpExpired) {
//     throw new ErrorHandler(
//       400,
//       undefined,
//       "Otp expired. Please enter new otp."
//     );
//   } else if (userDetails.otp_code !== userReqOtp && !isOtpExpired) {
//     throw new ErrorHandler(400, undefined, "Please enter a correct otp.");
//   }
//   const userId = userDetails._id;
//   const newMobile = userDetails.new_mobile;
//   await updateUser(userId, {
//     mobile: newMobile,
//     $unset: { otp_code: "", otp_expiry: "", new_mobile: "" },
//   });
//   await updateSession(undefined, { token: sessionId }, { mobile: newMobile });
//   return successResponse(
//     req,
//     res,
//     200,
//     undefined,
//     "Mobile verified successfully"
//   );
// });

// const getMasters = asyncHandler(async (req, res, next) => {
//   const expenseTypes = await mastersControllers.getEntities(
//     mastersData.ExpenseType
//   );
//   const motorcycles = await mastersControllers.getEntities(
//     mastersData.Motorcycles
//   );
//   const motorcycleParts = await mastersControllers.getEntities(
//     mastersData.MotorcyclePart
//   );
//   const rideCancelReasons = await mastersControllers.getEntities(
//     mastersData.RideCancelReason
//   );
//   const bloodGroups = await mastersControllers.getEntities(
//     mastersData.BloodGroups
//   );
//   const response = {
//     expense_types: expenseTypes,
//     motorcycles,
//     motorcycle_parts: motorcycleParts,
//     ride_cancel_reasons: rideCancelReasons,
//     blood_group: bloodGroups,
//   };
//   return successResponse(req, res, 200, response);
// });

export {
  sendOtp,
  loginCheck,
  findUser,
  verifyOtp,
  verifyNewMobile,
  resendOtpToNewMobile,
  saveSignUpDetails,
  saveUserProfile,
  updateUser,
  logoutUser,
  getMasters,
  deleteUserAccount,
};
