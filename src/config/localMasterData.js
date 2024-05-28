const formFieldKey = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  countryCode: "countryCode",
  phone: "phone",
  password: "password",
  c_password: "c_password",
};

const formFieldErrors = {
  firstName: "Enter first name.",
  lastName: "Enter last name.",
  email: "Enter email id",
  countryCode: "Enter countryCode",
  phone: "Enter phone number",
  password: "Enter password",
  c_password: "Enter confirm password",
};
const getFormFieldErrors = () => {
  const errors = {};
  Object.keys(formFieldKey).forEach((key) => {
    errors[formFieldKey[key]] = { key, message: formFieldErrors[key] };
  });

  return errors;
};

export { formFieldKey, formFieldErrors, getFormFieldErrors };
