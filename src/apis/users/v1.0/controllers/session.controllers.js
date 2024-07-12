import { FAILED, LOGIN, YES } from "../../../../config/apiStatuses.js";
import {
  customResponse,
  loginResponse,
} from "../../../../utils/apiResponsesHelper.js";
import jsonwebtokenAdapter from "../../../../libs/jsonwebtoken.js";
import Sessions from "../models/session.model.js";
import { findFcm } from "./fcm.controllers.js";
import envKeys from "../../../../config/envKeys.js";
import validatorAdapter from "../../../../libs/validator.js";
import { findUser } from "./user.controllers.js";
import ErrorHandler from "../../../../utils/errorHandler.js";
import {
  getClientIp,
  getClientSource,
} from "../../../../utils/networkHelper.js";
import cryptoAdapter from "../../../../libs/crypto.js";
import endpoints from "../../../../config/endpoints.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";
import mongooseAdapter from "../../../../libs/mongoose.js";

const createSession = async (sessionData) => {
  try {
    const newSession = await Sessions.create(sessionData);
    return newSession;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(FAILED, 500, "Failed to create session");
  }
};
const findSession = async (id, data, noOfResults = 1, options = {}) => {
  try {
    let query = id
      ? Sessions.findById(id, null, { limit: noOfResults, ...options })
      : Sessions.find(data, null, { limit: noOfResults, ...options });

    const sessionData = id ? [await query.exec()] : await query.exec();
    return sessionData;
  } catch (e) {
    throw new ErrorHandler("Failed to find session", 500, e.message);
  }
};

const updateSession = async (id, data, updateData) => {
  try {
    let updatedSession;

    if (id) {
      updatedSession = await Sessions.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedSession) {
        throw new ErrorHandler(FAILED, 404, "Session expired.");
      }
    } else if (data) {
      const updateResult = await Sessions.updateMany(data, updateData, {
        new: true,
      });

      if (updateResult.nModified === 0) {
        throw new ErrorHandler(FAILED, 404, "No sessions found to update.");
      }

      updatedSession = await Sessions.find(data); // Fetch the updated sessions
    } else {
      throw new ErrorHandler(FAILED, 400, "Session expired.");
    }

    return updatedSession;
  } catch (error) {
    throw new ErrorHandler(FAILED, 500, "Failed to update session");
  }
};

const generateToken = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const userId = body.user_id;
  const ipAddress = getClientIp(req);
  const source = getClientSource(req);

  if (!userId) {
    throw new ErrorHandler(FAILED, 400, "User ID is required");
  }

  const token = await cryptoAdapter.generateRandomBytes(32);
  const userDetails = await findUser(null, {
    user_id: userId,
    registration_ip: ipAddress,
    registration_source: source,
  });

  const { _id, mobile } = userDetails;
  const fcmId = body.fcm_id || body.fcm_device_id;
  const path = req.route.path;

  if (path === endpoints.verify_otp) {
    await updateSession(
      undefined,
      { user_id: userId, log_out_date_time: null },
      { log_out_date_time: new Date() }
    );
  }

  const sessionArray = await findSession(null, {
    user_id: _id,
    log_out_date_time: null,
  });
  let sessionToken = sessionArray[0];
  const existingFcmDeviceId = await findFcm(null, {
    fcm_id: fcmId,
    user_id: _id,
  });

  if (!sessionToken || !existingFcmDeviceId) {
    sessionToken = await createSession({
      id: token,
      user_id: userId,
      token,
      mobile,
      ip_address: ipAddress,
      source: source,
      last_activity: new Date(),
    });
  } else {
    sessionToken = await updateSession(sessionToken._id, null, {
      last_activity: new Date(),
    });
  }

  return sessionToken.token;
});

const isAuthenticateSession = asyncHandler(async (req, res, next) => {
  const { session_id } = req.body;
  const path = req.route.path;
  const ipAddress = getClientIp(req);
  const source = getClientSource(req);
  const sessionArray = await findSession(
    undefined,
    {
      token: session_id,
      ip_address: ipAddress,
      source,
    },
    undefined,
    {
      populate: {
        path: "user_id",
        model: "Users",
        select:
          "+new_mobile +mobile_verified +otp_code +otp_expiry +activated +registered_date +registered_date_time +registration_ip +registration_source +last_login_date_time +last_login_ip",
        // select:
        //   "user_id f_name l_name gender dob blood_group country_code mobile mobile_verified otp_code otp_expiry account_type activated registered_date registered_date_time registration_ip registration_source last_login_date_time last_login_ip",
      },
    }
  );

  const session = sessionArray[0];

  const isForceLogOut = session?.force_logout === YES;
  const isLogout = session && new Date(session?.log_out_date_time) < new Date();
  if (session_id && !validatorAdapter.isHexadecimal(session_id)) {
    throw new ErrorHandler(400, undefined, "Invalid session id");
  } else if (!session || isForceLogOut) {
    loginResponse(req, res, 400, "Session expired! Please login again");
  } else if (isLogout && path !== endpoints.logout) {
    loginResponse(req, res, 400, "Login session expired! Please login again");
  } else {
    const sessionId = session._id;
    let lastActivity = new Date();
    const sessionToken = await updateSession(sessionId, undefined, {
      last_activity: lastActivity,
    });
    req.session_token = sessionToken.token;
    req.user = session?.user_id;
    next();
  }
});

export {
  createSession,
  findSession,
  updateSession,
  generateToken,
  isAuthenticateSession,
};
