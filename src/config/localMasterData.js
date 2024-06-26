const formFieldKey = {
  first_name: "first_name",
  last_name: "last_name",
  gender: "gender",
  email: "email",
  country_code: "country_code",
  phone: "phone",
};

const formFieldErrors = {
  first_name: "Enter first name.",
  last_name: "Enter last name.",
  email: "Enter email id",
  gender: "Enter gender",
  country_code: "Enter country code",
  phone: "Enter phone number",
};
const getFormFieldErrors = () => {
  const errors = {};
  Object.keys(formFieldKey).forEach((key) => {
    errors[formFieldKey[key]] = { key, message: formFieldErrors[key] };
  });

  return errors;
};

export { formFieldKey, formFieldErrors, getFormFieldErrors };
