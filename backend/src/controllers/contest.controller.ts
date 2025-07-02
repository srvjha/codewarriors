import { db } from "../db";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import { createContestValidation } from "../validators/contest.validation";

const getAllContests = asyncHandler(async (req, res) => {
  const contests = await db.contest.findMany({
    orderBy: { createdAt: "desc" },
  });

  res
    .status(200)
    .json(new ApiResponse(200, contests, "All Contests Fetched Successfully"));
});

const getContestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contest = await db.contest.findUnique({
    where: { id },
    include: {
      problems: {
        orderBy: { order: "asc" },
        include: { problem: {
          select:{
            id: true,
            title:true
          }
        } },
      },
      contestants: {
        select: {
          userId: true,
          score: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  if (!contest) throw new ApiError("Contest not found", 404);

  res
    .status(200)
    .json(new ApiResponse(200, contest, "Contest Fetched Successfully"));
});

const createContest = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, status, problems } =
    handleZodError(createContestValidation(req.body));
  const existingContest = await db.contest.findUnique({
    where: {
      title,
      status: "LIVE",
    },
  });
  // checking for existing contest
  if (existingContest) {
    throw new ApiError("Contest Already Created", 409);
  }

  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  // checking for valid start and end time
  if (startTimeDate >= endTimeDate) {
    throw new ApiError("End time must be after start time", 400);
  }


  // now will create contest
  const contest = await db.contest.create({
    data: {
      title: title,
      description: description,
      startTime: startTimeDate,
      endTime: endTimeDate,
      status: status,
    },
  });

  // handling the problems
  const contestProblems = problems.map((problem, index) => ({
    contestId: contest.id,
    problemId: problem.id,
    order: index,
  }));

  await db.contestProblem.createMany({
    data: contestProblems,
  });

  res
    .status(200)
    .json(new ApiResponse(201, contest, "Contest Created Successfully"));
});

const registerUserToContest = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  // console.log("contest id: ",contestId)
  const userId = req.user.id;

  const alreadyRegistered = await db.contestant.findUnique({
    where: { userId_contestId: { userId, contestId } },
  });

  if (alreadyRegistered)
    throw new ApiError("Already registered for this contest", 409);

  const contestant = await db.contestant.create({
    data: {
      userId,
      contestId,
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, contestant, "Registration successful"));
});

const unregisterUserFromContest = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user.id;

  const alreadyRegistered = await db.contestant.findUnique({
    where: { userId_contestId: { userId, contestId } },
  });

  if (!alreadyRegistered) {
    throw new ApiError("Not registered for this contest", 400);
  }

  await db.contestant.delete({
    where: { userId_contestId: { userId, contestId } },
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Unregistered from contest successfully"));
});

const getContestLeaderboard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const leaderboard = await db.contestant.findMany({
    where: { contestId: id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      score: "desc", 
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, leaderboard, "leaderBoard Fetched Successfully")
    );
});

const createContestSubmission = asyncHandler(async (req, res) => {
  const { contestId, userId, problemId, submissionId, score} =
    req.body;

  const existing = await db.contestSubmission.findFirst({
    where: {
      contestId,
      userId,
      problemId,
    },
  });

  if (existing) {
    throw new ApiError(
      "Submission for this problem already exists in contest",
      409
    );
  }

  const submission = await db.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new ApiError("Submission not found", 404);
  }

  const result = await db.contestSubmission.create({
    data: {
      contestId,
      userId,
      problemId,
      submissionId,
      score
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, result, "Contest Submission Recorded"));
});

const getContestSubmissionDetailsById = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user.id;

  const submission = await db.contestSubmission.findMany({
    where: {
      contestId,
      userId,
    }
  });

  if (!submission) {
    throw new ApiError("Submission not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, submission, "Contest Submission Details Fetched"));
}
);

const checkUserRegistration = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user.id;

  const registration = await db.contestant.findUnique({
    where: {
      userId_contestId: {
        userId,
        contestId,
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { registered: Boolean(registration) },
        registration ? "User is registered" : "User is not registered"
      )
    );
});

const addContestantScore = asyncHandler(async(req,res)=>{
  const userId = req.user.id;
  const { contestId, score } = req.body;
  console.log("contestId: ", contestId, "score: ", score);
  const contestant = await db.contestant.findUnique({
    where: { userId_contestId: { userId, contestId } },
  });
  if (!contestant) {
    throw new ApiError("User is not registered for this contest", 400);
  }
  const updatedContestant = await db.contestant.update({
    where: { userId_contestId: { userId, contestId } },
    data: { score: contestant.score + score },
  });
  res
    .status(200)
    .json(new ApiResponse(200, updatedContestant, "Score Updated Successfully"));
})

export {
  createContest,
  getContestById,
  getContestLeaderboard,
  createContestSubmission,
  getAllContests,
  registerUserToContest,
  unregisterUserFromContest,
  checkUserRegistration,
  addContestantScore,
  getContestSubmissionDetailsById
};
