import { db } from "../db";
import { getAverage } from "../helper/executeCode.helper";
import { validId } from "../helper/validId.helper";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import {
  getJudge0LanguageById,
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../utils/judge0";
import { executeCodeSchemaValidation } from "../validators/executeCode.validation";
import { testcaseSchema } from "../validators/problem.validation";

enum ExecutionTypeEnum {
  RUN = "run",
  SUBMIT = "submit",
}

type refsolutions = {
  [langType: string]: string;
};

const executeCode = asyncHandler(async (req, res) => {
  let {
    source_code,
    language,
    stdin = [],
  } = handleZodError(executeCodeSchemaValidation(req.body));
  const userId = req.user.id;
  const { pid, type } = req.params;
  validId(pid, "Problem");
  if (type !== ExecutionTypeEnum.RUN && type !== ExecutionTypeEnum.SUBMIT) {
    return new ApiError("Invalid execution type", 400);
  }
  const language_id = getJudge0LanguageById(language);
  const inputs = await db.problem.findUnique({
    where: { id: pid },
    select: {
      testcases: true,
      referenceSolutions: true,
    },
  });

  const safeTestCases = testcaseSchema.safeParse(inputs?.testcases);
  if (!safeTestCases.success) {
    throw new ApiError("Invalid test cases", 400);
  }
  const executionResults =
    type === ExecutionTypeEnum.RUN
      ? safeTestCases.data.slice(0, 3)
      : safeTestCases.data;
  const standardDbInput = executionResults.map((testcase) => testcase.input);
  const standardDbOutput = executionResults.map((testcase) => testcase.output);
  let getExpectedOutput;
  if (type === ExecutionTypeEnum.RUN && stdin && stdin.length > 0) {
    getExpectedOutput = await handleCustomInput(
      stdin,
      inputs?.referenceSolutions as refsolutions,
      language_id
    );
  }

  let finalInput;
  let finalOutput: (string | undefined)[];
  if (type === ExecutionTypeEnum.RUN) {
    finalInput = [...standardDbInput, ...stdin];
    finalOutput = [...standardDbOutput, ...(getExpectedOutput || [])];
  } else {
    finalInput = standardDbInput;
    finalOutput = standardDbOutput;
  }

  // prepare each cases for judge0 batch submission
  const submissions = finalInput.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  // send batch to judge0

  const submitResponse = await submitBatch(submissions);

  // console.log("submission Response: ",submitResponse);
  const tokens = submitResponse.map((res) => ({ token: res.token }));

  const results = await pollBatchResults(tokens);
  // console.log("results : ",results);

  let allPassedCases = true;
  const detailedResults = results.map((result, index) => {
    const { stdout } = result;
    const expected_output = finalOutput[index];
    const passedTestCases = stdout?.trim() === expected_output?.trim();

    if (!passedTestCases) {
      allPassedCases = false;
    }

    return {
      testCases: index + 1,
      passedTestCases,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time}s` : undefined,
    };
    // console.log(`TestCases ${index + 1}`)
    // console.log(`Input: ${stdin[index]}`)
    // console.log(`Expected Output: ${expected_output}`)
    // console.log(`Actual output: ${stdout}`)

    // console.log(`Passed: ${passedTestCases}`)
  });
  // console.log("Detailed Results: ", detailedResults);
  const averageMemory = getAverage(detailedResults.map((r) => r.memory));
  const averageTime = getAverage(detailedResults.map((r) => r.time));

  let submissionData = {
    userId,
    problemId: pid,
    sourceCode: source_code,
    language: getLanguageNameById(language_id),
    stdin: stdin.join("\n"),
    stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
    stderr: detailedResults.some((result) => result.stderr)
      ? JSON.stringify(detailedResults.some((result) => result.stderr))
      : null,
    compileOutput: detailedResults.some((result) => result.compileOutput)
      ? JSON.stringify(detailedResults.some((result) => result.compileOutput))
      : null,
    status: allPassedCases ? "Accepted" : "Wrong Answer",
    memory: averageMemory ? `${averageMemory} KB` : null,
    time: averageTime ? `${averageTime}s` : null,
  };
  
 
  if (type === ExecutionTypeEnum.RUN) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...submissionData,
          testCases: detailedResults,
        },
        "Code executed successfully"
      )
    );
  }

  // console.log("Detailed Results: ",detailedResults);
  const submission = await db.submission.create({
    data: submissionData,
  });

  // if all passed true mark problem solved to true;

  if (allPassedCases) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId: pid,
        },
      },
      update: {},
      create: {
        userId,
        problemId: pid,
      },
    });
  }

  // save individual test case results using detailedResult
  const testCaseResult = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCases,
    passed: result.passedTestCases,
    stdout: result.stdout,
    expected: result.expected ?? "",
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data: testCaseResult,
  });

  const submissionWithTestCase = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      TestCaseResult: true,
    },
  });
 

  //handling daily streak feat
  const today = new Date();
  today.setHours(0, 0, 0, 0); //  midnight

  // console.log("today: ",today)

  //  user streak info
  let user = await db.user.findUnique({
    where: { id: userId },
    select: {
      dailyProblemStreak: true,
      isStreakMaintained: true,
      lastSubmissionDate: true,
    },
  });

  // console.log("user: ",user)

  const lastSubmissionDate = user?.lastSubmissionDate
    ? new Date(user.lastSubmissionDate)
    : null;

    // console.log("before last submission :",lastSubmissionDate)
  if (lastSubmissionDate) lastSubmissionDate.setHours(0, 0, 0, 0);
  //  console.log("after last submission :",lastSubmissionDate)

  const isNewDay =
    !lastSubmissionDate || lastSubmissionDate.getTime() !== today.getTime();
   
    // console.log("isNewDay: ",isNewDay)
     let updatedUser;
  //  If it's a new day, reset isStreakMaintained to false
  if (isNewDay && user?.isStreakMaintained) {
    updatedUser =  await db.user.update({
      where: { id: userId },
      data: {
        isStreakMaintained: false,
      },
    });
  }

  // console.log("updated user: ",updatedUser)

  // checking if user submitted today
  const currentDaySubmission = await db.submission.findFirst({
    where: {
      userId,
      status: "Accepted",
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });
  // console.log("currentDaySubmission: ",currentDaySubmission)
  
  // console.log("user streak: ",updatedUser?.isStreakMaintained)
  //  If user submitted and streak isn't already marked for today, update
  if (currentDaySubmission && !updatedUser?.isStreakMaintained) {
    const currentStreak = updatedUser?.dailyProblemStreak || 0;

    await db.user.update({
      where: { id: userId },
      data: {
        dailyProblemStreak: currentStreak === 0 ? 1 : { increment: 1 },
        isStreakMaintained: true,
        lastSubmissionDate: new Date(), // Update for tomorrow's check
      },
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, submissionWithTestCase, "Code executed successfully")
    );
});

const handleCustomInput = async (
  inputs: string[],
  refSol: refsolutions,
  langId: number
) => {
  const lang = getLanguageNameById(langId);
  const code = refSol[lang];
  const submissions = inputs.map((input) => ({
    source_code: code,
    language_id: langId,
    stdin: input,
  }));

  // send batch to judge0

  const submitResponse = await submitBatch(submissions);

  // console.log("submission Response: ",submitResponse);
  const tokens = submitResponse.map((res) => ({ token: res.token }));

  const results = await pollBatchResults(tokens);
  console.log("results: ", results);
  const sanitizeResults = results.map((result) =>
    result.stdout?.replace("\n", "")
  );
  return sanitizeResults;
};
export { executeCode };
