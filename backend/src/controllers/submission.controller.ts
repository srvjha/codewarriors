import { db } from "../db";
import { validId } from "../helper/validId.helper";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";

const getAllSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const submissions = await db.submission.findMany({
    where: {
      userId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, submissions, "All Submissions Fetched Succesfully"));
});

const getAllSubmissionForProblem = asyncHandler(async (req, res) => {
  const { pid } = req.params;
   validId(pid, "Problem");
  const userId = req.user.id;
  const submissions = await db.submission.findMany({
    where: {
      userId,
      problemId: pid,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions for the problem Fetched Successfully")
    );
});

const getAllTheSubmissionForProblem = asyncHandler(async (req, res) => {
  const { pid } = req.params;
   validId(pid, "Problem");
  const submission = await db.submission.count({
    where: {
      problemId: pid,
    },
  });
  res
    .status(200)
    .json(
      new ApiResponse(200, {count:submission}, "Submission Count Fetched Successfully")
    );
});

export {
  getAllSubmission,
  getAllSubmissionForProblem,
  getAllTheSubmissionForProblem,
};
