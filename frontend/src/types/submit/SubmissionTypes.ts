import type { Problem } from "../problem/problemTypes";

interface TestCaseResultType {
  // Add appropriate fields if known, using 'any' as a fallback
  [key: string]: any;
}

export interface SubmissionType {
  status: string;
  time: string | number;
  memory: string | number;
  stdout: string;
  language: string;
  TestCaseResult: TestCaseResultType[];
  createdAt: string | number | Date;
  sourceCode: string;
}

export type Submission = {
  id: string;
  language: string;
  sourceCode: string;
  status: string;
  memory: string;
  time: string;
  createdAt: string;
  problem: Problem;
};