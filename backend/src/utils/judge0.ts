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

export const submitOne = async (submission: Judge0Submission) => {
  const { data } = await axios.post(
    `${env.JUDGE0_API_URL}/submissions?base64_encoded=false&fields=*`,
    submission,
    {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": env.JUDGE0_API_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    }
  );

  return data; // contains { token }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollOne = async (token: string) => {
  while (true) {
    const { data } = await axios.get(
      `${env.JUDGE0_API_URL}/submissions/${token}`,
      {
        params: {
          base64_encoded: false,
          fields: "*",
        },
        headers: {
          "x-rapidapi-key": env.JUDGE0_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    if (data.status.id !== 1 && data.status.id !== 2) {
      return data as Statuses;
    }

    await sleep(1000);
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
