import mongoose from "mongoose";
import mongooseAdapter from "../../../libs/mongoose.js";

const fcmSchema = new mongooseAdapter.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  fcm_id: {
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
  version: {
    type: String,
  },
});

const Fcms = mongooseAdapter.model("Fcm", fcmSchema);

export default Fcms;
