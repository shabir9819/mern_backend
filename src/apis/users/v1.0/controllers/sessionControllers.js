import { LOGIN } from "../../../../config/apiStatuses.js";
import { customResponse } from "../../../../utils/apiResponsesHelper.js";
import jsonwebtokenAdapter from "./../../../../libs/jsonwebtoken.js";
import Sessions from "../models/session.js";
import { findFcm } from "./fcmControllers.js";
import envKeys from "../../../../config/envKeys.js";
import validatorAdapter from "../../../../libs/validator.js";

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
      ? await Sessions.findById(id)
      : await Sessions.find(data).limit(noOfResults);
    return sessionData;
  } catch (e) {
    throw new ErrorHandler(FAILED, 500, "Failed to find session");
  }
};

const updateSession = async (id, updateData) => {
  try {
    if (!id) {
      throw new ErrorHandler(FAILED, 400, "Session ID is required");
    }

    const updatedSession = await Sessions.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedSession) {
      throw new ErrorHandler(FAILED, 404, "Session not found");
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
      let sessionToken = await findSession(undefined, { user_id: _id });
      const existingFcm = await findFcm(undefined, {
        fcm_id: fcmId,
        user_id: _id,
      });
      console.log(!sessionToken || !existingFcm);
      if (!sessionToken || !existingFcm) {
        console.log("created");
        sessionToken = await createSession({
          user_id: _id,
          token,
          mobile,
          ip_address: "ip Address",
          source: "source",
          last_activity: new Date(),
        });
      } else {
        console.log("updated");
        const sessionId = sessionToken[0]._id;
        console.log({ sessionId });
        let lastActivity = new Date();
        // sessionToken = await updateSession(sessionId, {
        //   last_activity: lastActivity,
        // });
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
    const session = await findSession(undefined, { token: session_id });
    if (!session || !validatorAdapter.isMongoId(session_id)) {
      customResponse(req, res, 400, LOGIN, "Invalid session id");
      return;
    }
    const isValidToken = session.userId.toString() === isValidToken.id;
    if (isValidToken) {
      next();
    } else {
      customResponse(req, res, 400, LOGIN, "Invalid session id");
    }
    const sessionId = session[0]._id;
    let lastActivity = new Date();
    sessionToken = await updateSession(sessionId, {
      last_activity: lastActivity,
    });
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
