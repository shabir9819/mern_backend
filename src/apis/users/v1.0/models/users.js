import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";
import ErrorHandler from "../../../../utils/errorHandler.js";
import { VALIDATION, FAILED, YES, NO } from "../../../../config/apiStatuses.js";
import validatorAdapter from "../../../../libs/validator.js";
import bcryptAdapter from "../../../../libs/bcrypt.js";
import {
  generateOtp,
  generateOtpExpiry,
  sendOtpEmail,
} from "../../../../utils/nodemailerHelpers.js";
import { successResponse } from "../../../../utils/apiResponsesHelper.js";
import { genderValues } from "../../../../constants/formValues.js";

const { male, female, other } = genderValues;

const userSchema = new mongooseAdapter.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return this._id;
      },
    },
    f_name: {
      type: String,
      lowercase: true,
    },
    l_name: { type: String, lowercase: true },
    gender: {
      type: String,
      enum: { values: [male, female, other], message: "Invalid gender" },
      trim: true,
    },
    country_code: String,
    mobile: {
      type: Number,
      unique: true,
      match: [/^\d{10}$/, "Phone number should be exactly 10 digits"],
      required: true,
    },
    mobile_verified: {
      type: String,
      enum: [YES, NO],
      default: NO,
      select: false,
      trim: true,
    },
    otp_code: { type: Number, select: false },
    otp_expiry: { type: Date, select: false },
    activated: {
      type: String,
      enum: [YES, NO],
      default: NO,
      select: false,
      trim: true,
    },
    // created_at: { type: Date, select: false }, // Exclude from selection
    // updated_at: { type: Date, select: false }, // Exclude from selection
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
    strict: false,
  }
);

// Define a virtual field 'id' which is based on the '_id' field
userSchema.virtual("id").get(function () {
  return this._id; // Return '_id', not 'user_id'
});

userSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.user_id = ret._id; // Rename '_id' to 'user_id'
    delete ret._id; // Delete the original '_id' field
  },
});

userSchema.methods.encodeHash = async function () {
  try {
    const { password, c_password } = this;
    if (password !== c_password) {
      throw new ErrorHandler(
        VALIDATION,
        400,
        "Password and confirm password should match."
      );
    }
    this.password = await bcryptAdapter.hash(password, 12);
    this.c_password = undefined;
  } catch (error) {
    throw new ErrorHandler(error.status || FAILED, 400, error.message);
  }
};
userSchema.methods.decodeHash = async function (password) {
  try {
    // Compare the plain text password with the hashed password stored in the database
    const isMatch = await bcryptAdapter.compare(password, this.password);

    // Return true if passwords match, false otherwise
    return isMatch;
  } catch (error) {
    // If an error occurs during comparison, throw an error
    throw new ErrorHandler(error.status || FAILED, 400, error.message);
  }
};

const Users = mongooseAdapter.model("Users", userSchema);

export default Users;
