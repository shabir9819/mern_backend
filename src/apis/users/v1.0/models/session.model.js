import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";
import { NO, YES } from "../../../../config/apiStatuses.js";
import validatorAdapter from "../../../../libs/validator.js";
import { formFieldErrors } from "../../../../config/localMasterData.js";

const sessionSchema = new mongooseAdapter.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
      validate: {
        validator: (_id) => validatorAdapter.isMongoId(_id),
        message: formFieldErrors.user_id.invalid,
      },
    },
    token: {
      type: String,
      required: [true, formFieldErrors.token.required],
      minLength: [32, formFieldErrors.token.invalid],
    },
    mobile: {
      type: String,
      required: true,
    },
    ip_address: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    last_activity: {
      type: Date,
      required: true,
    },
    log_out_date_time: {
      type: Date,
    },
    force_logout: {
      type: String,
      enum: [YES, NO],
      default: NO,
    },
  },
  {
    // timestamps: {
    //   createdAt: "created_at",
    //   updatedAt: "updated_at",
    // },
    versionKey: false,
    strict: false,
  }
);

const Sessions = mongooseAdapter.model("Sessions", sessionSchema);

export default Sessions;
