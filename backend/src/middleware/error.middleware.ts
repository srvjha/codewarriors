import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";


const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let customError: ApiError;

  //  custom ApiError
  if (err instanceof ApiError) {
    customError = err;
  }
  //  MongoDB duplicate key error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    customError = new ApiError(`Duplicate value for field: ${field}`, 400);
  }
  //  other errors
  else {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";
    customError = new ApiError(errorMessage, statusCode);
  }


  res.status(customError.statusCode).json({
    success: customError.success,
    error: customError.message,
    data: customError.data,
    statusCode: customError.statusCode,
  });
};

export { errorHandler };
