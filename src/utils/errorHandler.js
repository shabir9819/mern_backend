import { FAILED } from "../config/apiStatuses.js";

class ErrorHandler extends Error {
  constructor(status, statusCode, message, data) {
    super(message); // Call the super constructor
    this.status = status || FAILED;
    this.statusCode = statusCode;
    this.message = message || undefined;
    this.response_data = data || undefined;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
