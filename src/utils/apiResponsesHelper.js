import {
  SUCCESS,
  LOGIN,
  VALIDATION,
  FAILED,
  VERIFY,
} from "../config/apiStatuses.js";
import { updateDebugFile } from "./debugFileHelper.js";

const commonResponseJson = {};

const successResponse = (req, res, statusCode = 200, data, message) => {
  const response_message = message || undefined;
  const successResponseJson = {
    status: SUCCESS,
    response_data: { ...data, message: response_message },
    ...commonResponseJson,
  };
  updateDebugFile(req, successResponseJson);
  res.status(statusCode).send(successResponseJson);
};
const validationResponse = (req, res, statusCode = 400, message, data) => {
  const response_message =
    message === null || message === undefined ? "Validation Failed" : message;
  const response_data = data === null || data === undefined ? {} : data;
  const validationResponseJson = {
    status: VALIDATION,
    response_data: { ...response_data, message: response_message },
    ...commonResponseJson,
  };
  updateDebugFile(req, validationResponseJson);
  res.status(statusCode).send(validationResponseJson);
};
const verifyResponse = (req, res, statusCode = 400, message, data) => {
  const response_message =
    message === null || message === undefined
      ? "Please verify your email."
      : message;
  const response_data = data;
  const verifyResponseJson = {
    status: VERIFY,
    response_data: { ...response_data, message: response_message },
    ...commonResponseJson,
  };

  updateDebugFile(req, verifyResponseJson);
  res.status(statusCode).send(verifyResponseJson);
};

const loginResponse = (req, res, statusCode = 401, message, data) => {
  const response_message =
    message === null || message === undefined ? "Login Failed" : message;
  const response_data = data === null || data === undefined ? {} : data;
  const loginResponseJson = {
    status: LOGIN,
    response_data: { ...response_data, message: response_message },
    ...commonResponseJson,
  };
  updateDebugFile(req, loginResponseJson);
  res.status(statusCode).send(loginResponseJson);
};

const failedResponse = (req, res, statusCode = 500, message, data) => {
  const response_message =
    message === null || message === undefined ? "Operation Failed" : message;
  const response_data = data;
  const failedResponseJson = {
    status: FAILED,
    response_data: { ...response_data, message: response_message },
    ...commonResponseJson,
  };
  updateDebugFile(req, failedResponseJson);
  res.status(statusCode).send(failedResponseJson);
};

const customResponse = (req, res, statusCode = 200, status, message, data) => {
  const response_status =
    status === null || status === undefined ? SUCCESS : status;
  const response_message =
    message === null || message === undefined ? "Custom Response" : message;
  const response_data = data;
  const customResponseJson = {
    status: response_status,
    response_data: { ...response_data, message: response_message },
    ...commonResponseJson,
  };
  updateDebugFile(req, customResponseJson);
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
