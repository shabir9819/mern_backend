import {
  SUCCESS,
  LOGIN,
  VALIDATION,
  FAILED,
  VERIFY,
} from "../config/apiStatuses.js";

const commonResponseJson = {};

const successResponse = (res, statusCode = 200, data, message) => {
  const successResponseJson = {
    status: SUCCESS,
    response_data: data,
    message: message || undefined,
    ...commonResponseJson,
  };
  res.status(statusCode).send(successResponseJson);
};
const validationResponse = (res, statusCode = 400, message, data) => {
  const response_message =
    message === null || message === undefined ? "Validation Failed" : message;
  const response_data = data === null || data === undefined ? {} : data;
  const validationResponseJson = {
    status: VALIDATION,
    message: response_message,
    response_data: response_data,
    ...commonResponseJson,
  };
  res.status(statusCode).send(validationResponseJson);
};
const verifyResponse = (res, statusCode = 400, message, data) => {
  const response_message =
    message === null || message === undefined
      ? "Please verify your email."
      : message;
  const response_data = data;
  const validationResponseJson = {
    status: VERIFY,
    message: response_message,
    response_data: response_data,
    ...commonResponseJson,
  };
  res.status(statusCode).send(validationResponseJson);
};

const loginResponse = (res, statusCode = 401, message, data) => {
  const response_message =
    message === null || message === undefined ? "Login Failed" : message;
  const response_data = data === null || data === undefined ? {} : data;
  const loginResponseJson = {
    status: LOGIN,
    message: response_message,
    response_data: response_data,
    ...commonResponseJson,
  };
  res.status(statusCode).send(loginResponseJson);
};

const failedResponse = (res, statusCode = 500, message, data) => {
  const response_message =
    message === null || message === undefined ? "Operation Failed" : message;
  const response_data = data;
  const failedResponseJson = {
    status: FAILED,
    message: response_message,
    response_data: response_data,
    ...commonResponseJson,
  };
  res.status(statusCode).send(failedResponseJson);
};

const customResponse = (res, statusCode = 200, status, message, data) => {
  const response_status =
    status === null || status === undefined ? SUCCESS : status;
  const response_message =
    message === null || message === undefined ? "Custom Response" : message;
  const response_data = data;
  const customResponseJson = {
    status: response_status,
    message: response_message,
    response_data: response_data,
    ...commonResponseJson,
  };
  res.status(statusCode).send(customResponseJson);
};

export {
  successResponse,
  loginResponse,
  validationResponse,
  verifyResponse,
  failedResponse,
  customResponse,
};
