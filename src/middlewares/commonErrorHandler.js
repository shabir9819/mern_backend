import ErrorHandler from "../utils/errorHandler.js";

import { SUCCESS, FAILED, VALIDATION } from "../config/apiStatuses.js";
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
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const type = Object.keys(err.keyValue)[0];
    // const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    let message;
    if (type === "email") {
      message = "Email Already Exists";
      err = new ErrorHandler(VALIDATION, 400, message);
      console.log(err.status);
    }
  }
  // console.log(err);
  //   // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // let response = {
  //   status: err.status,
  //   message: err.message,
  //   response_data: err.response_data,
  // };

  customResponse(
    res,
    err.statusCode,
    err.status,
    err.message,
    err.response_data
  );
  // res.status(err.statusCode).json(response);
};
