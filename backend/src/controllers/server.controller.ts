import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";

export const getServerTime = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
        200,
        {serverTime: new Date().toISOString()},
        "Server Time fetched"
    )
  )
});