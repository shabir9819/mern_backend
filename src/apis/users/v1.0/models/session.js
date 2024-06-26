import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";
import { NO, YES } from "../../../../config/apiStatuses.js";
import validatorAdapter from "../../../../libs/validator.js";

const sessionSchema = new mongooseAdapter.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
    validate: {
      validator: (_id) => validatorAdapter.isMongoId(_id),
      message: "Invalid user!",
    },
  },
  token: {
    type: String,
    required: true,
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
});

const Sessions = mongooseAdapter.model("Sessions", sessionSchema);

export default Sessions;
