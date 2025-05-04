import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { env } from "../utils/env";
import { asyncHandler } from "../utils/asynHandler";
import { CustomUser } from "../types/global";


export const verifyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError("Unauthorized Request", 400);
    }
    // Verify access token
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken as CustomUser;
    next();
  },
);
