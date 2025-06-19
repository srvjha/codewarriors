import { asyncHandler } from "../utils/asynHandler";
import { db } from "../db";
import { handleZodError } from "../utils/handleZodError";
import {
  createProblemValidation,
  updateProblemValidation,
} from "../validators/problem.validation";
import { ApiError } from "../utils/ApiError";
import {
  getJudge0LanguageById,
  pollBatchResults,
  submitBatch,
} from "../utils/judge0";
import { ApiResponse } from "../utils/ApiResponse";
import { validId } from "../helper/validId.helper";
import { Difficulty, UserRole } from "@prisma/client";
import { logger } from "../configs/logger";

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

  if (userRole.toUpperCase() !== UserRole.ADMIN) {
    logger.error("Unauthorized Request: User not authenticated");
    throw new ApiError("You are not allowed to create a problem", 403);
  }

  const existingProblem = await db.problem.findFirst({
    where: {
      title,
    },
  });

  if (existingProblem) {
    throw new ApiError("Problem already exists", 409);
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageById(language);
    if (!languageId) {
      logger.error(`Invalid language: ${language}`);
      throw new ApiError(`Invalid ${language} language `, 400);
    }

    const submissions = testcases.map(
      ({ input, output }: { input: string; output: string }) => {
        return {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        };
      }
    );

    const tokens = await submitBatch(submissions);
    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status.id !== 3) {
        logger.error(
          `Submission ${i + 1} failed: ${result.status.description}`
        );
        throw new ApiError(`Submission ${i + 1} failed`, 400);
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        demo: false,
        difficulty: difficulty.toUpperCase() as Difficulty,
        tags,
        examples,
        constraints,
        hints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(201, newProblem, "Problem created successfully"));
  }
});

const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      tags: true,
      demo: true,
      createdAt: true,
      updatedAt: true,
      ProblemInPlaylist: {
        select: {
          problemId: true,
        },
      },
    },
    orderBy: {
      demo: "desc",
    },
  });
  if (!problems) {
    throw new ApiError("No problems found", 404);
  }
  logger.info("All Problems retrieved successfully");
  return res
    .status(200)
    .json(
      new ApiResponse(200, problems, "All Problems retrieved successfully")
    );
});

const getProblemById = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  validId(pid, "Problem");
  const problem = await db.problem.findUnique({
    where: { id: pid },
  });

  if (!problem) {
    throw new ApiError("Problem not found", 404);
  }
  logger.info(`Problem with ID ${pid} retrieved successfully`);
  res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem retrieved successfully"));
});

const updateProblem = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  validId(pid, "Problem");
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    editorial,
    hints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = handleZodError(updateProblemValidation(req.body));

  const userRole = req.user.role;

  if (userRole.toUpperCase() !== "ADMIN") {
    logger.error("Unauthorized Request: User not authenticated");
    throw new ApiError("You are not allowed to create a problem", 403);
  }

  const updatePayload: Partial<{
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string[];
    hints: string;
    constraints: string;
    examples: any;
    codeSnippets: any;
    editorial: string;
    referenceSolutions: any;
    testcases: any;
  }> = {};

  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (difficulty !== undefined) updatePayload.difficulty = difficulty;
  if (tags !== undefined) updatePayload.tags = tags;
  if (hints !== undefined) updatePayload.hints = hints;
  if (constraints !== undefined) updatePayload.constraints = constraints;
  if (examples !== undefined) updatePayload.examples = examples;
  if (codeSnippets !== undefined) updatePayload.codeSnippets = codeSnippets;
  if (editorial !== undefined) updatePayload.editorial = editorial;
  if (referenceSolutions !== undefined)
    updatePayload.referenceSolutions = referenceSolutions;
  if (testcases !== undefined) updatePayload.testcases = testcases;

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError("At least one field is required to update", 400);
  }

  if (updatePayload.referenceSolutions) {
    if (!updatePayload.testcases) {
      throw new ApiError(
        "Testcases are required when reference solutions are provided",
        400
      );
    }
  } else if (updatePayload.testcases) {
    if (!updatePayload.referenceSolutions) {
      throw new ApiError(
        "Reference solutions are required when testcases are provided",
        400
      );
    }
  } else if (updatePayload.referenceSolutions && updatePayload.testcases) {
    for (const [language, solutionCode] of Object.entries(
      updatePayload.referenceSolutions
    )) {
      const languageId = getJudge0LanguageById(language);
      if (!languageId) {
        logger.error(`Invalid language: ${language}`);
        throw new ApiError(`Invalid ${language} language `, 400);
      }

      const submissions = updatePayload.testcases.map(
        ({ input, output }: { input: string; output: string }) => {
          return {
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
          };
        }
      );

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => ({ token: res.token }));

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          logger.error(
            `Submission ${i + 1} failed: ${result.status.description}`
          );
          throw new ApiError(`Submission ${i + 1} failed`, 400);
        }
      }
    }
  }

  const newProblem = await db.problem.update({
    where: { id: pid },
    data: {
      ...updatePayload,
      userId: req.user.id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newProblem, "Problem updated successfully"));
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  validId(pid, "Problem");
  const deletedProblem = await db.problem.deleteMany({ where: { id: pid } });
  if (deletedProblem.count === 0) {
    throw new ApiError("Problem not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Problem deleted successfully"));
});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const problems = await db.problem.findMany({
    where: {
      SolvedBy: {
        some: {
          userId,
        },
      },
    },
    include: {
      SolvedBy: {
        where: {
          userId,
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, problems, "Problem Fetched Successfully"));
});

const isProblemSolved = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { pid } = req.params;

  validId(pid, "Problem");
  let problemSolved = false;

  const foundProblem = await db.problemSolved.findFirst({
    where: {
      userId: userId,
      problemId: pid,
    },
  });

  if (foundProblem) {
    problemSolved = true;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, problemSolved, "Problem Status Found Successfully")
    );
});

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
  isProblemSolved,
};
