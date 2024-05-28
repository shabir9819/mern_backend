import { FAILED } from "../../../config/apiStatuses.js";
import endpoints from "../../../config/endpoints.js";
import validatorAdapter from "../../../libs/validator.js";
import { successResponse } from "../../../utils/apiResponsesHelper.js";
import ErrorHandler from "../../../utils/errorHandler.js";
import Fcms from "../models/fcm.js";
import { findUser } from "./userControllers.js";

const createNewFcm = async (req) => {
  try {
    const { fcm_id, make, model, os, version } = req.body;
    const user = req.user;
    const userId = user?._id;
    if (fcm_id) {
      const newFcmDetail = new Fcms({
        user_id: userId,
        fcm_id,
        make,
        model,
        os,
        version,
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
    throw new ErrorHandler("Failed to update FCM", 500, error.message);
  }
};

const saveFcm = async (req, res, next) => {
  try {
    const { fcm_id, make, model, os, version } = req.body;
    const user = req.user;
    const path = req.route.path;
    if (path === endpoints.save_fcm) {
      if (!fcm_id || validatorAdapter.isEmpty(fcm_id)) {
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

    const existingFcmDetail = await findFcm(undefined, { fcm_id });

    if (!existingFcmDetail) {
      // If fcm_id doesn't exist, create a new FCM detail
      if (existingFcmDetail?.user_id !== req.auth) {
        await createNewFcm(req);
      }
    } else if (
      (existingFcmDetail.fcm_id === fcm_id && !existingFcmDetail?.user_id) ||
      (!existingFcmDetail.fcm_id &&
        existingFcmDetail?.user_id === req.user?._id) ||
      existingFcmDetail.fcm_id === fcm_id
    ) {
      // If fcm_id exists, update it only if it belongs to a guest user

      await updateFcm(
        existingFcmDetail._id, // Corrected: Use _id directly
        {
          user_id: user?._id,
          make,
          model,
          os,
          version,
        },
        { new: true }
      );
    } else {
      next();
    }

    path === endpoints.save_fcm &&
      successResponse(res, undefined, undefined, "FCM saved successfully");
  } catch (error) {
    next(error);
  }
};

export { saveFcm, createNewFcm, findFcm, updateFcm };
