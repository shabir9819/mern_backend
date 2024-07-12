const formFieldKey = {
  first_name: "first_name",
  last_name: "last_name",
  gender: "gender",
  email: "email",
  country_code: "country_code",
  mobile: "mobile",
  dob: "dob",
  blood_group: "blood_group",
  account_type: "account_type",
  token: "token",
};

const formFieldErrors = {
  first_name: {
    required: "Enter your first name.",
    invalid: "Invalid name.",
  },
  last_name: {
    required: "Enter your last name.",
    invalid: "Invalid name.",
  },
  email: {
    required: "Enter your email id",
    invalid: "Enter a valid email address",
  },
  gender: {
    required: "Choose your gender",
    invalid: "Invalid gender",
  },
  country_code: {
    required: "Enter country code",
  },
  mobile: {
    required: "Enter your mobile number",
    invalid: "Phone number should be exactly 10 digits",
  },
  dob: {
    required: "Select date of birth",
    invalid: {
      is_not_date: "Invalid date of birth",
      is_not_adult: "You must be 18 years old to use this application",
    },
  },
  blood_group: {
    required: "Select your blood group",
    invalid: "Select your blood group",
  },
  account_type: {
    required: "Select an account type",
    invalid: "Please enter a valid account type.",
  },
  token: {
    required: "Invalid session id",
    invalid: "Invalid session id",
  },
  user_id: {
    required: "Invalid user!",
    invalid: "Invalid user!",
  },
};

const getFormFieldErrors = () => {
  const errors = {};
  Object.keys(formFieldKey).forEach((key) => {
    errors[formFieldKey[key]] = { key, messages: formFieldErrors[key] };
  });

  return errors;
};

export { formFieldKey, formFieldErrors, getFormFieldErrors };
