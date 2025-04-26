// utils/AppError.js
class ExpressError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true; // for distinguishing known errors
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export { ExpressError };
  