import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";

const fcmSchema = new mongooseAdapter.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  fcm_id: {
    type: String,
  },
  sms_hash: {
    type: String,
  },
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  os: {
    type: String,
  },
  os_ver: {
    type: String,
  },
  api_level: {
    type: Number,
    min: [3, "Api key should not be more than 3 digits."],
  },
  // ses_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Sessions",
  // },
});

const Fcms = mongooseAdapter.model("Fcm", fcmSchema);

export default Fcms;
