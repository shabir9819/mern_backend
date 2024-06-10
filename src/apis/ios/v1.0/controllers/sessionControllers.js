import { LOGIN } from "../../../../config/apiStatuses.js";
import { customResponse } from "../../../../utils/apiResponsesHelper.js";
import jsonwebtokenAdapter from "./../../../../libs/jsonwebtoken.js";
import Sessions from "../models/session.js";
import { findFcm } from "./fcmControllers.js";
import envKeys from "../../../../config/envKeys.js";

const createSession = async (sessionData) => {
  try {
    const newSession = await Sessions.create(sessionData);
    return newSession;
  } catch (error) {
    throw new ErrorHandler(FAILED, 500, "Failed to create session");
  }
};
const findSession = async (id, data) => {
  try {
    const sessionData = id
      ? await Sessions.findById(id)
      : await Sessions.find(data);
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

      const { _id, email } = user;
      const fcm_id = req.body.fcm_id;
      let sessionToken = await findSession(undefined, { user_id: _id });
      const existingFcm = await findFcm(undefined, { fcm_id, user_id: _id });
      if (!sessionToken || !existingFcm) {
        sessionToken = await createSession({
          user_id: _id,
          token,
          email,
          ip_address: "ip Address",
          source: "source",
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
    const session = await Sessions.findOne({ token: session_id });
    if (!session) {
      customResponse(req, res, 400, LOGIN, "Invalid session id");
      return;
    }
    const isValidToken = await jsonwebtokenAdapter.verifyToken(
      session.token,
      envKeys.jwtSecret
    );
    if (isValidToken && session.userId.toString() === isValidToken.id) {
      next();
    } else {
      customResponse(req, res, 400, LOGIN, "Invalid session id");
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
