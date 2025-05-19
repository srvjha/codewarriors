export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  userId: string;
  examples: {
    [key: string]: {
      input: string;
      output: string;
      explanation: string;
    };
  };
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
