import axios from "axios";
import { ApiError } from "./ApiError";
import { env } from "./env";
import { headers } from "../helper/judge0.helper";
export const getJudge0LanguageById = (language: string) => {
  const languages = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    "C++ (GCC 9.2.0)": 54,
  };

  return languages[language.toUpperCase() as keyof typeof languages];
};

type Judge0Submission = {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output?: string;
  base64_encoded?: boolean;
  wait?: boolean;
};

type Token = {
  token: string;
};

type Statuses = {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: {
    id: number;
    description: string;
  };
};

export const submitBatch = async (submissions: Judge0Submission[]) => {
  const { data } = await axios.post(
    `${env.JUDGE0_API_URL}/submissions/batch`,
    { submissions },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.JUDGE0_API_KEY}`,
      },
    }
  );
  return data as Token[]; // array of tokens;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens: Token[]) => {
  try {
    while (true) {
      const { data } = await axios.get(
        `${env.JUDGE0_API_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.map((t) => t.token).join(","),
            base64_encoded: false,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.JUDGE0_API_KEY}`,
          },
        }
      );

      const results = data.submissions as Statuses[];
      const isAllDone = results.every(
        (result) => result.status.id !== 1 && result.status.id !== 2
      );
      if (isAllDone) return results;
      await sleep(1000);
    }
  } catch (error) {
    console.log("error: ", error);
    throw new ApiError("Error while polling Judge0 submissions", 500);
  }
};

export const getLanguageNameById = (languageId: number) => {
  const languages = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
    54: "C++ (GCC 9.2.0)",
  };
  return languages[languageId as keyof typeof languages];
};
