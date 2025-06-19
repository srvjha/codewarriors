import  { generateContent,generateChat } from "../utils/agent";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import { timeComplexityValidation } from "../validators/problem.validation";

const getComplexities = asyncHandler(async(req,res)=>{
  const {sourceCode} = handleZodError(timeComplexityValidation(req.body));
  const result = await generateContent(sourceCode)

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Complexity generated successfully"
    )
  )

})

const chatWithAi = asyncHandler(async(req,res)=>{
   const {message,context} = req.body;
   const result = await generateChat(message,context)
    return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Chat generated successfully"
    )
  )
})

export {getComplexities,chatWithAi}