export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  userId: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string;
  hints: string | null;
  editorial: string | null;
  testcases: {
    input: string;
    output: string;
  }[];
  codeSnippets: {
    [key: string]: string;
  };
  referenceSolutions: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type TestCaseResultType = {
  testCase: number | string;
  passed: boolean;
  time: string;
  memory: string;
  [key: string]: any;
};

export type ResultType = {
  status: string;
  stderr?: string;
  [key: string]: any;
};

export interface Playlist{
  id: string;
  name: string;
  description: string;
  userId: string;
  user:{
    fullName:string
  };
  problems: {
    problem: Problem;
    id: string;
    playListId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const ExecutionStatus = {
  RUN: "run",
  SUBMIT: "submit",
} as const;

export type ExecutionStatus = keyof typeof ExecutionStatus;

export interface ProgressData {
     totalProblems: number;
    easyProblems: number;
    medProblems: number;
    hardProblems: number;
    solvedProblems: number;
  }


export type P =  {
  progressData:ProgressData
}
