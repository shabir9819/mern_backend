import mongoose from "mongoose";
import mongooseAdapter from "../../../libs/mongoose.js";
import ErrorHandler from "../../../utils/errorHandler.js";
import { VALIDATION, FAILED, YES, NO } from "../../../config/apiStatuses.js";
import validatorAdapter from "../../../libs/validator.js";
import bcryptAdapter from "../../../libs/bcrypt.js";
import { sendOtpEmail } from "../../../utils/nodemailerHelpers.js";
import { successResponse } from "../../../utils/apiResponsesHelper.js";

const userSchema = new mongooseAdapter.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    first_name: {
      type: String,
      required: [true, "Enter first name."],
      lowercase: true,
    },
    last_name: { type: String, lowercase: true },
    email: {
      type: String,
      required: [true, "Enter last name."],
      unique: true,
      trim: true,
      validate: [validatorAdapter.isEmail, "Email is not valid."],
    },
    country_code: String,
    phone: {
      type: Number,
      minLength: [10, "Phone number should be 10 digits"],
      maxLength: [10, "Phone number should be 10 digits"],
    },
    password: { type: String, required: true, select: false },
    c_password: String,
    activated: {
      type: String,
      enum: [YES, NO],
      default: NO,
      select: false,
    },
    activation_code: { type: Number, select: false },
    created_at: { type: Date, select: false }, // Exclude from selection
    updated_at: { type: Date, select: false }, // Exclude from selection
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
  return this._id;
});

userSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.user_id = ret._id; // Rename 'id' to 'userId'
    delete ret.id;
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

userSchema.methods.upsertNormalUser = async function (req, res, next, model) {
  try {
    const { email } = this;
    const userExists = await model
      .findOne({ email })
      .select("+activated +activation_code");
    const isExistedUserActivated = userExists?.activated;
    // console.log(isExistedUserActivated);
    // console.log({ userExists });
    if (userExists && isExistedUserActivated === YES) {
      throw new ErrorHandler(FAILED, 400, "Email already exists.");
    } else if (!userExists || (userExists && isExistedUserActivated === NO)) {
      const otp = await sendOtpEmail(email);
      console.log({ otp, this: this });
      if (userExists && isExistedUserActivated === NO) {
        const id = userExists._id;
        await model.findByIdAndUpdate(id, { activation_code: otp });
      } else if (!userExists) {
        this.activation_code = otp;

        await this.encodeHash();
        await this.save();
      }
      successResponse(res, undefined, undefined, "OTP sent to your email");
    }
  } catch (error) {
    throw new ErrorHandler(error.status || FAILED, 400, error.message);
  }
};

const Users = mongooseAdapter.model("Users", userSchema);

export default Users;
