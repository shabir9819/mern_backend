import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";
import ErrorHandler from "../../../../utils/errorHandler.js";
import { VALIDATION, FAILED, YES, NO } from "../../../../config/apiStatuses.js";
import bcryptAdapter from "../../../../libs/bcrypt.js";
import {
  accountTypes,
  genderValues,
} from "../../../../constants/schemaValues.js";
import validatorAdapter from "../../../../libs/validator.js";
import {
  formFieldErrors,
  getFormFieldErrors,
} from "../../../../config/localMasterData.js";
import { checkUserAge } from "../../../../utils/formValidationHelper.js";
import { convertDateIntoMilliseconds } from "../../../../utils/stringHelpers.js";

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
      trim: true,
      match: [
        /^[a-zA-Z]+([a-zA-Z '-]*[a-zA-Z])?$/,
        formFieldErrors.first_name.invalid,
      ],
    },
    l_name: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z]+([a-zA-Z '-]*[a-zA-Z])?$/,
        formFieldErrors.last_name.invalid,
      ],
    },
    gender: {
      type: String,
      enum: {
        values: [male, female, other],
        message: formFieldErrors.gender.invalid,
      },
      trim: true,
    },
    dob: {
      type: Number,
      default: null,
      min: [1, formFieldErrors.dob.invalid.is_not_date],
    },
    blood_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodGroupMasters",
      default: null,
    },
    country_code: String,
    mobile: {
      type: Number,
      unique: true,
      match: [/^\d{10}$/, formFieldErrors.mobile.invalid],
      required: [true, formFieldErrors.mobile.required],
    },
    new_mobile: {
      type: Number,
      match: [/^\d{10}$/, formFieldErrors.mobile.invalid],
      default: undefined,
      select: false,
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
    account_type: {
      type: String,
      enum: {
        values: ["rider", "family"],
        message: formFieldErrors.account_type.invalid,
      },
      trim: true,
    },
    activated: {
      type: String,
      enum: [YES, NO],
      default: NO,
      select: false,
      trim: true,
    },
    registered_date: {
      type: Date,
      default: Date.now,
      select: false,
    },
    registered_date_time: {
      type: Date,
      default: Date.now,
      select: false,
    },
    registration_ip: {
      type: String,
      required: true,
      select: false,
    },
    registration_source: {
      type: String,
      required: true,
      select: false,
    },
    last_login_date_time: {
      type: Date,
      select: false,
    },
    last_login_ip: {
      type: String,
      select: false,
    },
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

// Pre-save hook for DOB validation and transformation
userSchema.pre("save", function (next) {
  if (this.isModified("dob")) {
    this.dob = convertDateIntoMilliseconds(this.dob);
  }
  next();
});

// Pre-findOneAndUpdate hook for DOB validation and transformation
userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.dob !== undefined) {
    update.dob = convertDateIntoMilliseconds(update.dob);
  }
  next();
});

const Users = mongooseAdapter.model("Users", userSchema);

export default Users;
