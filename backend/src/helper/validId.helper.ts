import {isUUID} from "validator"
import { ApiError } from "../utils/ApiError";

export const validId = (id: string, entityName: string): void | never => {
  if (!isUUID(id)) {
    throw new ApiError(`Invalid ${entityName} ID`, 400);
  }
};
