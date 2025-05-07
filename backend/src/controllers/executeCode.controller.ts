import { db } from "../db";
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

const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs } = handleZodError(
    executeCodeSchemaValidation(req.body)
  );
  const userId = req.user.id;
  const { pid } = req.params;

  // prepare each cases for judge0 batch submission
  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  // send batch to judge0

  const submitResponse = await submitBatch(submissions);

  // console.log("submission Response: ",submitResponse);
  const tokens = submitResponse.map((res) => ({ token: res.token }));

  const results = await pollBatchResults(tokens);
  // console.log("results: ",results);

  let allPassedCases = true;
  const detailedResults = results.map((result, index) => {
    const { stdout } = result;
    const expected_output = expected_outputs[index];
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

  // console.log("Detailed Results: ",detailedResults);
  const submission = await db.submission.create({
    data: {
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
        ? JSON.stringify(detailedResults.some((result) => result.stderr))
        : null,
      status: allPassedCases ? "Accepted" : "Wrong Answer",
      memory: detailedResults.some((result) => result.memory)
        ? JSON.stringify(detailedResults.some((result) => result.stderr))
        : null,
      time: detailedResults.some((result) => result.time)
        ? JSON.stringify(detailedResults.some((result) => result.stderr))
        : null,
    },
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
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data:testCaseResult
  })

  const submissionWithTestCase = await db.submission.findUnique({
    where:{
      id:submission.id
    },
    include:{
      TestCaseResult:true
    }
  })

  res
    .status(200)
    .json(new ApiResponse(200, submissionWithTestCase, "Code executed successfully"));
});

export { executeCode };
