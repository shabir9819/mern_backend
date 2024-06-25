import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";

const sessionSchema = new mongooseAdapter.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
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
});

const Sessions = mongooseAdapter.model("Sessions", sessionSchema);

export default Sessions;
