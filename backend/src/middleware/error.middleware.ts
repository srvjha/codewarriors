import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../configs/logger";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let customError: ApiError;

  // 1. Custom ApiError (your own class)
  if (err instanceof ApiError) {
    customError = err;
  }

  // 2. MongoDB duplicate key error (optional, if Mongo is used somewhere)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    customError = new ApiError(`Duplicate value for field: ${field}`, 400);
  }

  // 3. Prisma unique constraint error
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    // const fields = err.meta?.target as string[];
    const message = `Playlist with same title already exists.`;
    customError = new ApiError(message, 409);
  }

  // 4. Other Prisma errors (optional, add more if needed)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    customError = new ApiError(`Database error: ${err.message}`, 500);
  }

  // 5. Fallback error
  else {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";
    customError = new ApiError(errorMessage, statusCode);
  }

  // Log error
  logger.error(
    `${req.method} ${req.originalUrl} -> ${customError.message} [${customError.statusCode}]`
  );

  // Return structured error response
  res.status(customError.statusCode).json({
    success: customError.success,
    error: customError.message,
    data: customError.data,
    statusCode: customError.statusCode,
  });
};

export { errorHandler };
