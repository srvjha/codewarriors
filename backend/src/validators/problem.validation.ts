import { z } from "zod";
import { jsonSchema } from "./json.validation";
import { Difficulty } from "@prisma/client";

export const testcaseSchema = z.array(
  z.object({
    input: z.string(),
    output: z.string(),
  })
);

const createProblemSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  difficulty: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine(
      (val): val is Difficulty =>
        Object.values(Difficulty).includes(val as Difficulty),
      {
        message: "Difficulty must be EASY, MEDIUM, or HARD",
      }
    ),
  tags: z
    .array(z.string())
    .nonempty({ message: "At least one tag is required" }),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().optional(),
    })
  ), // will refine this with a stricter structure
  constraints: z.string().nonempty({ message: "Constraints are required" }),
  editorial: z.string().optional(),
  hints: z.string().optional(),
  testcases: testcaseSchema.nonempty({
    message: "At least one test case is required",
  }),
  codeSnippets: z.any(),
  referenceSolutions: jsonSchema,
});

const updateProblemSchema = createProblemSchema.partial();
const getTimeComplexity = z.object({
  sourceCode:z.string()
})

type CreateProblem = z.infer<typeof createProblemSchema>;
type TimeComplexity = z.infer<typeof getTimeComplexity>;

const createProblemValidation = (data: CreateProblem) => {
  return createProblemSchema.safeParse(data);
};
const updateProblemValidation = (data: Partial<CreateProblem>) => {
  return updateProblemSchema.safeParse(data);
};
const timeComplexityValidation = (data: TimeComplexity) => {
  return getTimeComplexity.safeParse(data);
};

export {
  createProblemValidation,
  updateProblemValidation,
  timeComplexityValidation,
};
