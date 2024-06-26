import { LOGIN, YES } from "../../../../config/apiStatuses.js";
import { customResponse } from "../../../../utils/apiResponsesHelper.js";
import jsonwebtokenAdapter from "./../../../../libs/jsonwebtoken.js";
import Sessions from "../models/session.js";
import { findFcm } from "./fcmControllers.js";
import envKeys from "../../../../config/envKeys.js";
import validatorAdapter from "../../../../libs/validator.js";
import { findUser } from "./userControllers.js";
import ErrorHandler from "../../../../utils/errorHandler.js";

const createSession = async (sessionData) => {
  try {
    const newSession = await Sessions.create(sessionData);
    return newSession;
  } catch (error) {
    throw new ErrorHandler(FAILED, 500, "Failed to create session");
  }
};
const findSession = async (id, data, noOfResults = 1) => {
  try {
    const sessionData = id
      ? [await Sessions.findById(id)] // Wrap in array to maintain consistency
      : await Sessions.find(data).limit(noOfResults);
    return sessionData;
  } catch (e) {
    throw new ErrorHandler(FAILED, 500, "Failed to find session");
  }
};

const updateSession = async (id, updateData) => {
  try {
    // if (!id) {
    //   throw new ErrorHandler(FAILED, 400, "Session ID is required");
    // }

    const updatedSession = await Sessions.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedSession) {
      throw new ErrorHandler(FAILED, 404, "Session expired.");
    }

    return updatedSession;
  } catch (error) {
    throw new ErrorHandler(FAILED, 500, "Failed to update session");
  }
};

const generateToken = async (req, res, next) => {
  try {
    const { auth, user } = req;
    if (auth) {
      const numberOfHours = 2;
      const options = { expiresIn: numberOfHours * 60 * 60 * 1000 };
      const token = await jsonwebtokenAdapter.signToken(
        { id: auth },
        envKeys.jwtSecret,
        options
      );

      const { _id, mobile } = user;
      const fcmId = req.body?.fcm_id || req.body?.fcm_device_id;
      // Await the result and handle the array correctly
      const sessionArray = await findSession(undefined, {
        user_id: _id,
      });
      let sessionToken = sessionArray[0];

      const existingFcmDeviceId = await findFcm(undefined, {
        fcm_id: fcmId,
        user_id: _id,
      });
      if (!sessionToken || !existingFcmDeviceId) {
        sessionToken = await createSession({
          user_id: _id,
          token,
          mobile,
          ip_address: "ip Address",
          source: "source",
          last_activity: new Date(),
        });
      } else {
        const sessionId = sessionToken._id;
        sessionToken = await updateSession(sessionId, {
          last_activity: new Date(),
        });
      }
      return sessionToken.token;
    }
  } catch (error) {
    next(error);
  }
};

const isAuthenticateSession = async (req, res, next) => {
  try {
    const { session_id } = req.body;
    const sessionArray = await findSession(undefined, { token: session_id });
    const session = sessionArray[0];
    const isForceLogOut = session.force_logout === YES;
    if (!session) {
      customResponse(req, res, 400, LOGIN, "Invalid session id");
      return;
    } else if (isForceLogOut) {
      throw new ErrorHandler(400, undefined, "Session expired.");
      return;
    } else {
      const sessionId = session._id;
      let lastActivity = new Date();
      const sessionToken = await updateSession(sessionId, {
        last_activity: lastActivity,
      });
      const userId = session?.user_id;
      const userDetail = await findUser(userId);
      req.user = userDetail;
      req.session_token = sessionToken.token;
      next();
    }
  } catch (error) {
    next(error);
  }
};

export {
  createSession,
  findSession,
  updateSession,
  generateToken,
  isAuthenticateSession,
};
