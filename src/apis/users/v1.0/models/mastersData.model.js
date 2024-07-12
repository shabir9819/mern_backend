import mongoose from "mongoose";
import mongooseAdapter from "../../../../libs/mongoose.js";
import { NO, YES } from "../../../../config/apiStatuses.js";
import serverMastersDataValues from "../../../../constants/serverMastersDataValues.js";

const motorcycleSchema = new mongooseAdapter.Schema(
  {
    motorcycle_model_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return this._id;
      },
      unique: true,
    },
    motorcycle_model_name: {
      type: String,
      required: true,
    },
    motorcycle_image: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
);

const Motorcycles = mongooseAdapter.model(
  "Masters_Motorcycle",
  motorcycleSchema
);

// Ride cancel reasons Types
const motorcyclePartSchema = new mongooseAdapter.Schema(
  {
    part_id: {
      type: mongoose.Schema.Types.ObjectId, // Define _id explicitly as part_id
      default: function () {
        return this._id;
      },
      unique: true,
    },
    part_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
);

const MotorcyclePart = mongooseAdapter.model(
  "MotorcyclePartMasters",
  motorcyclePartSchema
);

const bloodGroupSchema = new mongooseAdapter.Schema(
  {
    blood_group_id: {
      type: mongoose.Schema.Types.ObjectId, // Define _id explicitly as blood_group_id
      default: function () {
        return this._id;
      },
      unique: true,
    },
    blood_group: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
);

const BloodGroups = mongooseAdapter.model(
  "Masters_Blood_Group",
  bloodGroupSchema
);

// Expense Types
const expenseTypeSchema = new mongooseAdapter.Schema(
  {
    expense_type_id: {
      type: mongoose.Schema.Types.ObjectId, // Define _id explicitly as expense_type_id
      default: function () {
        return this._id;
      },
      unique: true,
    },
    expense_type: {
      type: String,
      required: true,
      enum: serverMastersDataValues.expenseTypes,
    },
    fuel_quantity_required: {
      type: String,
      required: true,
      enum: [YES, NO],
      default: NO,
    },
    is_total_required: {
      type: String,
      required: true,
      enum: [YES, NO],
      default: NO,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
);

const ExpenseType = mongooseAdapter.model(
  "Masters_Expense_Type",
  expenseTypeSchema
);

// Ride cancel reasons Types
const rideCancelReasonSchema = new mongooseAdapter.Schema(
  {
    ride_cancel_reason_id: {
      type: mongoose.Schema.Types.ObjectId, // Define _id explicitly as ride_cancel_reason_id
      default: function () {
        return this._id;
      },
      unique: true,
    },
    cancel_reason: {
      type: String,
      required: true,
      enum: serverMastersDataValues.rideCancelReasons,
    },
    reason_description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
);

const RideCancelReason = mongooseAdapter.model(
  "Masters_Ride_Cancel_Reason",
  rideCancelReasonSchema
);

const mastersData = {
  Motorcycles,
  BloodGroups,
  ExpenseType,
  RideCancelReason,
  MotorcyclePart,
};

export default mastersData;
