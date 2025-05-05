import { asyncHandler } from "../utils/asynHandler";
import { db } from "../db";
import { handleZodError } from "../utils/handleZodError";
import { createProblemValidation } from "../validators/problem.validation";
import { ApiError } from "../utils/ApiError";
import { getJudge0LanguageById, pollBatchResults, submitBatch } from "../utils/judge0";
import { ApiResponse } from "../utils/ApiResponse";


const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = handleZodError(createProblemValidation(req.body));

    const userRole = req.user.role;

    if(userRole.toUpperCase()!=="ADMIN"){
        throw new ApiError("You are not allowed to create a problem",403);
    }

    for(const[language,solutionCode] of Object.entries(referenceSolutions)){
       const languageId = getJudge0LanguageById(language);
       if(!languageId){
        throw new ApiError(`Invalid ${language} language `,400)
       }

       const submissions = testcases.map(({input,output}:{input:string,output:string})=>{
          return {
            source_code:solutionCode,
            language_id:languageId,
            stdin:input,
            expected_output:output
          }
       })

       const submissionResults = await submitBatch(submissions)
       const tokens = submissionResults.map((res) => ({ token: res.token }));

       const results = await pollBatchResults(tokens);

       for(let i = 0;i<results.length;i++){
        const result = results[i];
        if(result.status.id !== 3){
          throw new ApiError(`Submission ${i+1} failed`,400)
        }
       }

       const newProblem = await db.problem.create({
        data:{
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          hints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId:req.user.id
        }
       })

       return res.status(200).json(
        new ApiResponse(
          200,
          newProblem,
          "Problem created successfully",
        )
       )

    }
});

const getAllProblems = asyncHandler(async (req, res) => {});

const getProblemById = asyncHandler(async (req, res) => {});

const updateProblem = asyncHandler(async (req, res) => {});

const deleteProblem = asyncHandler(async (req, res) => {});

const getAllProblemSolveByUser = asyncHandler(async (req, res) => {});

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemSolveByUser,
};
