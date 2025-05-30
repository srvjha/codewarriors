import generateContent from "../utils/agent";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import { timeComplexityValidation } from "../validators/problem.validation";

const getTimeComplexity = asyncHandler(async(req,res)=>{
  const {codeSnippets} = handleZodError(timeComplexityValidation(req.body));
  const result = await generateContent(codeSnippets)

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Complexity generated successfully"
    )
  )

})

export {getTimeComplexity}