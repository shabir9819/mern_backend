import mastersData from "../apis/users/v1.0/models/mastersData.model.js";
import { VALIDATION } from "../config/apiStatuses.js";
import {
  formFieldErrors,
  formFieldKey,
  getFormFieldErrors,
} from "../config/localMasterData.js";
import { genderValues } from "../constants/schemaValues.js";
import mongooseAdapter from "../libs/mongoose.js";
import validatorAdapter from "../libs/validator.js";
import ErrorHandler from "./errorHandler.js";

const {
  first_name,
  last_name,
  gender,
  email,
  country_code,
  mobile,
  dob,
  blood_group,
  account_type,
} = formFieldKey;

// <====================================  VALIDATION FUNCTIONS  ===========================================>

const isBloodGroupFromDatabase = async (id) => {
  if (!validatorAdapter.isMongoId(id)) {
    return false;
  }
  const bloodGroups = await mastersData.BloodGroups.findById(id);
  return bloodGroups._id ? true : false;
};

const isGenderFromLocal = (gender) => {
  const value = genderValues[gender.toString().toLowerCase()];
  return value === gender;
};

const checkUserAge = (date) => {
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  if (age < 18) {
    return false;
  } else {
    return true;
  }
};

const validateDob = (dob) => {
  if (dob !== null) {
    if (!validatorAdapter.isValidDate(dob)) {
      return false;
    }
    if (!validatorAdapter.isValidDate(new Date(dob).toISOString())) {
      throw new ErrorHandler(
        undefined,
        undefined,
        formFieldErrors.dob.invalid.is_not_date
      );
    }
    if (!checkUserAge(dob)) {
      throw new ErrorHandler(
        undefined,
        undefined,
        formFieldErrors.dob.invalid.is_not_adult
      );
    }
  }
  return true;
};
// <====================================  VALIDATION FUNCTIONS  ===========================================>

const validateFormErrors = async (fields) => {
  let errors = {};
  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    const formError = getFormFieldErrors()[fieldName];
    if (!formError) continue;

    const { key, messages } = formError;
    if (fieldValue === undefined) {
      throw new ErrorHandler(undefined, undefined, messages.required);
    }

    if (validatorAdapter.isEmpty(fieldValue.toString())) {
      if (messages.required) {
        errors[key] = messages.required;
      }
    } else {
      // Additional validations
      // Firstname validation
      if (
        fieldName === first_name &&
        !/^[a-zA-Z]+([a-zA-Z '-]*[a-zA-Z])?$/.test(fieldValue.toString())
      ) {
        if (messages.invalid) {
          errors[key] = messages.invalid;
        }
      }
      // Lastname validation
      else if (
        fieldName === last_name &&
        !/^[a-zA-Z]+([a-zA-Z '-]*[a-zA-Z])?$/.test(fieldValue.toString())
      ) {
        if (messages.invalid) {
          errors[key] = messages.invalid;
        }
      }
      // Mobile validation
      else if (
        fieldName === mobile &&
        !/^\d{10}$/.test(fieldValue.toString())
      ) {
        if (messages.invalid) {
          errors[key] = messages.invalid;
        }
      }
      // Email validation
      if (
        fieldName === email &&
        !validatorAdapter.isEmail(fieldValue.toString())
      ) {
        if (messages.invalid) {
          errors[key] = messages.invalid;
        }
      }
      // Blood groups validation
      if (
        fieldName === blood_group &&
        !(await isBloodGroupFromDatabase(fieldValue.toString()))
      ) {
        if (messages.invalid) {
          errors[key] = messages.invalid;
        }
      }
      // Gender validation
      if (fieldName === gender && !isGenderFromLocal(fieldValue.toString())) {
        if (messages.invalid) {
          errors[key] = messages.invalid;
        }
      }
      // DOB validation
      if (fieldName === dob && !validateDob(fieldValue)) {
        if (messages.invalid) {
          errors[key] = messages.invalid.is_not_date;
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorHandler(VALIDATION, 400, "Enter the form fields correctly", {
      errors,
    });
  }
};

export { validateFormErrors, checkUserAge, validateDob };
