  export interface ToggleLangFn {
    (lang: keyof Languages): void;
  }

 

  export interface Example {
    input: string;
    output: string;
    explanation: string;
  }

  export interface LanguageFields {
    starterCode: string;
    referenceSolution: string;
  }

 export interface Languages {
    JAVASCRIPT: LanguageFields;
    PYTHON: LanguageFields;
    JAVA: LanguageFields;
    CPP: LanguageFields;
  }

 export  interface TestCase {
    input: string;
    output: string;
  }

 export interface CreateProblemFormValues {
    title: string;
    description: string;
    difficulty: string;
    tags: string | string[];
    testcases: TestCase[];
    examples: Example[];
    languages: Languages;
    constraints: string;
    hints: string;
    editorial: string;
  }
