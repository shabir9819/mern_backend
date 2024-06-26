import validator from "validator";
import { FAILED } from "../../../../config/apiStatuses.js";
import endpoints from "../../../../config/endpoints.js";
import validatorAdapter from "../../../../libs/validator.js";
import { successResponse } from "../../../../utils/apiResponsesHelper.js";
import ErrorHandler from "../../../../utils/errorHandler.js";
import Fcms from "../models/fcm.js";
import { findUser } from "./userControllers.js";
import { generateToken } from "./sessionControllers.js";

const createNewFcm = async (req) => {
  try {
    const {
      user_id,
      fcm_id,
      fcm_device_id,
      sms_hash,
      make,
      model,
      os,
      version,
      session_id,
      api_level,
    } = req.body;
    const fcmId = fcm_id || fcm_device_id;
    const user = req.user;
    const userId = (user?._id || user_id).toString() ?? null;
    if (userId && !validatorAdapter.isMongoId(userId)) {
      throw new ErrorHandler(FAILED, 400, "Invalid user id");
    }
    if (fcmId) {
      const newFcmDetail = new Fcms({
        user_id: userId,
        fcm_id: fcmId,
        sms_hash,
        make,
        model,
        os,
        os_ver: version,
        api_level: Number(api_level),
      });
      await newFcmDetail.save();
      return newFcmDetail;
    }
  } catch (e) {
    throw e;
  }
};

const findFcm = async (id, data) => {
  try {
    const fcmData = id ? await Fcms.findById(id) : await Fcms.findOne(data);
    return fcmData;
  } catch (e) {
    throw new ErrorHandler("Failed to find FCM", 500, e.message);
  }
};

const updateFcm = async (id, updateData) => {
  try {
    if (!id) {
      console.log(id);
      throw new ErrorHandler(FAILED, 400, "FCM ID is required");
    }

    const updatedFcm = await Fcms.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedFcm) {
      throw new ErrorHandler(
        "FCM not found",
        404,
        `No FCM found with ID: ${id}`
      );
    }

    return updatedFcm;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(FAILED, 400, "Failed to update FCM");
  }
};

// const saveFcm = async (req, res, next) => {
//   try {
//     const {
//       user_id,
//       fcm_id,
//       fcm_device_id,
//       sms_hash,
//       make,
//       model,
//       os,
//       version,
//       api_level,
//       session_id,
//     } = req.body;
//     const user = req.user;
//     let userId = user?._id || user_id;
//     userId = validatorAdapter.isEmpty(userId.toString()) ? undefined : userId;
//     const path = req.route.path;
//     const fcmId = fcm_id || fcm_device_id;
//     if (path === endpoints.save_fcm) {
//       if (!fcmId || validatorAdapter.isEmpty(fcmId)) {
//         throw new ErrorHandler(FAILED, 400, "FCM ID is required");
//       } else if (
//         [make, model, os, version].some((field) =>
//           validatorAdapter.isEmpty(field)
//         )
//       ) {
//         throw new ErrorHandler(
//           FAILED,
//           400,
//           "make, model, OS, and version are required"
//         );
//       }
//     }

//     const existingFcmDetail = await findFcm(undefined, { fcm_id: fcmId });
//     if (!existingFcmDetail) {
//       // If fcm_id doesn't exist, create a new FCM detail
//       await createNewFcm(req);
//     } else if (
//       (existingFcmDetail.fcm_id === fcmId && !existingFcmDetail?.user_id) ||
//       (!existingFcmDetail.fcm_id && existingFcmDetail?.user_id === userId) ||
//       existingFcmDetail.fcm_id === fcmId
//     ) {
//       // If fcm_id exists, update it only if it belongs to a guest user
//       await updateFcm(
//         existingFcmDetail._id, // Corrected: Use _id directly
//         {
//           user_id: userId,
//           sms_hash,
//           make,
//           model,
//           os,
//           os_ver: version,
//           api_level,
//         },
//         { new: true }
//       );
//     } else {
//       next();
//     }

//     path === endpoints.save_fcm &&
//       successResponse(req, res, undefined, undefined, "FCM saved successfully");
//   } catch (error) {
//     next(error);
//   }
// };

const saveFcm = async (req, res, next) => {
  try {
    const {
      user_id,
      fcm_id,
      fcm_device_id,
      sms_hash,
      make,
      model,
      os,
      version,
      api_level,
    } = req.body || {};

    const user = req.user || {};
    let userId = user._id || user_id;
    userId =
      userId && !validatorAdapter.isEmpty(userId.toString())
        ? userId
        : undefined;

    const path = req.route?.path;
    const fcmId = fcm_id || fcm_device_id;

    if (!path) {
      throw new ErrorHandler(FAILED, 400, "Invalid path");
    }

    if (path === endpoints.save_fcm) {
      if (!fcmId || validatorAdapter.isEmpty(fcmId)) {
        throw new ErrorHandler(FAILED, 400, "FCM ID is required");
      }
      if (
        [make, model, os, version].some((field) =>
          validatorAdapter.isEmpty(field)
        )
      ) {
        throw new ErrorHandler(
          FAILED,
          400,
          "make, model, OS, and version are required"
        );
      }
    }
    let apiLevel;
    if (api_level !== undefined && api_level !== null) {
      apiLevel = Number(api_level);
      if (isNaN(apiLevel)) {
        throw new ErrorHandler(FAILED, 400, "Invalid API level");
      }
    }

    const existingFcmDetail = await findFcm(undefined, { fcm_id: fcmId });
    if (!existingFcmDetail) {
      await createNewFcm(req);
    } else if (
      (existingFcmDetail.fcm_id === fcmId && !existingFcmDetail.user_id) ||
      (!existingFcmDetail.fcm_id && existingFcmDetail.user_id === userId) ||
      existingFcmDetail.fcm_id === fcmId
    ) {
      await updateFcm(existingFcmDetail._id, {
        user_id: userId,
        sms_hash,
        make,
        model,
        os,
        os_ver: version,
        api_level: apiLevel,
      });
    } else {
      return next();
    }

    if (path === endpoints.save_fcm) {
      successResponse(req, res, undefined, undefined, "FCM saved successfully");
    }
  } catch (error) {
    next(error);
  }
};

export { saveFcm, createNewFcm, findFcm, updateFcm };
