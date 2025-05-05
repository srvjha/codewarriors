import { z } from "zod";

export const createProblemSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Difficulty is required",
    invalid_type_error: "Difficulty must be EASY, MEDIUM, or HARD",
  }),
  tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
  examples: z.any(), // will refine this with a stricter structure
  constraints: z.string().nonempty({ message: "Constraints are required" }),
  hints: z.string().optional(),
  testcases: z.any(), // will refine this with a stricter structure
  codeSnippets: z.any(),
  referenceSolutions: z.any(),
});


type CreateProblem = z.infer<typeof createProblemSchema>


const createProblemValidation = (data:CreateProblem)=>{
    return createProblemSchema.safeParse(data)
}

export{createProblemValidation}
