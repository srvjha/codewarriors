import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { logger } from "../configs/logger";

export const healthCheck = (req: Request, res: Response) => {
  logger.info("Health check endpoint hit", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body, 
  });
  res.status(200).json(new ApiResponse(200, null, "Health check passed"));
};
