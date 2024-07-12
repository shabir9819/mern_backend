import ErrorHandler from "../utils/errorHandler.js";
import { FAILED, VALIDATION } from "../config/apiStatuses.js";
import { customResponse } from "../utils/apiResponsesHelper.js";

export default (err, req, res, next) => {
  err.status = err.status || FAILED;
  err.response_data = err.response_data;
  err.statusCode = err.statusCode || 500;
  // Check if err.message is explicitly set to null or undefined
  if (err.message === undefined) {
    err.message = undefined;
  } else {
    err.message = err.message || "Internal Server Error";
  }

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const modelName = err?.model?.modelName.slice(
      0,
      err.model.modelName.length - 1
    ); // Get model name from err.model
    const message = modelName
      ? `Invalid ${modelName} ID`
      : `Invalid ${err.path}`;
    err = new ErrorHandler(FAILED, 400, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const type = Object.keys(err.keyValue)[0];
    let message;
    if (type === "email") {
      message = "Email Already Exists";
      err = new ErrorHandler(VALIDATION, 400, message);
    }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    const message = messages.join(", ");
    err = new ErrorHandler(VALIDATION, 400, message);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // console.log(err.message);

  customResponse(
    req,
    res,
    err.statusCode,
    err.status,
    err.message,
    err.response_data
  );
};
