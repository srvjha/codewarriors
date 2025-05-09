import { SafeParseReturnType } from "zod";
import { ApiError } from "./ApiError";
import { logger } from "../configs/logger";

 const handleZodError = <T>(
  result: SafeParseReturnType<unknown, T>
): T => {
  if (!result.success) {
    const missing =
      result.error.issues[0].code === "invalid_type" &&
      result.error.issues[0].received === "undefined";

    if (missing) {
      if (result.error.issues[0].path.length) {
         logger.warn(`Zod Validation Failed: ${result.error.issues[0].path}`);
        throw new ApiError(
          `Missing ${result.error.issues[0].path} field`,
          500
        );
      } else {
        throw new ApiError(
          `Missing required field`,
          500
        );
      }
    }

    throw new ApiError(
      result.error.issues[0].message,
      400
    );
  }

  return result.data;
};

export { handleZodError };
