import { UserRole } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asynHandler";

export const checkRole = asyncHandler(async(req,res,next)=>{
    const role = req.user.role;

    if(!role){
        throw new ApiError("Invalid role",400)
    }
    if(role.toUpperCase() !== UserRole.ADMIN){
        throw new ApiError("You do not have permission to access this resource",403)
    }
    next();
})