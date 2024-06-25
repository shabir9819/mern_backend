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
      fcm_id,
      fcm_device_id,
      sms_hash,
      make,
      model,
      os,
      version,
      session_id,
    } = req.body;
    const fcmId = fcm_id || fcm_device_id;
    const user = req.user;
    const userId = user?._id;
    if (!validatorAdapter.isMongoId(user)) {
      throw new ErrorHandler(FAILED, 400, "Invalid user id");
    }
    if (fcm_id) {
      const newFcmDetail = new Fcms({
        user_id: userId,
        fcm_id: fcmId,
        sms_hash,
        make,
        model,
        os,
        os_ver: version,
      });
      await newFcmDetail.save();
      return newFcmDetail;
    }
  } catch (e) {
    throw new Error(e);
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
    throw new ErrorHandler(FAILED, 400, "Failed to update FCM");
  }
};

const saveFcm = async (req, res, next) => {
  try {
    const {
      fcm_id,
      fcm_device_id,
      sms_hash,
      make,
      model,
      os,
      version,
      session_id,
    } = req.body;
    const user = req.user;
    const path = req.route.path;
    const fcmId = fcm_id || fcm_device_id;
    if (path === endpoints.save_fcm) {
      if (!fcmId || validatorAdapter.isEmpty(fcmId)) {
        throw new ErrorHandler(FAILED, 400, "FCM ID is required");
      } else if (
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

    const existingFcmDetail = await findFcm(undefined, { fcm_id: fcmId });

    if (!existingFcmDetail) {
      // If fcm_id doesn't exist, create a new FCM detail
      await createNewFcm(req);
    } else if (
      (existingFcmDetail.fcm_id === fcmId && !existingFcmDetail?.user_id) ||
      (!existingFcmDetail.fcm_id &&
        existingFcmDetail?.user_id === req.user?._id) ||
      existingFcmDetail.fcm_id === fcmId
    ) {
      // If fcm_id exists, update it only if it belongs to a guest user

      await updateFcm(
        existingFcmDetail._id, // Corrected: Use _id directly
        {
          user_id: user?._id,
          sms_hash,
          make,
          model,
          os,
          os_ver: version,
        },
        { new: true }
      );
    } else {
      next();
    }

    path === endpoints.save_fcm &&
      successResponse(req, res, undefined, undefined, "FCM saved successfully");
  } catch (error) {
    next(error);
  }
};

export { saveFcm, createNewFcm, findFcm, updateFcm };
