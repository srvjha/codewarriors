import { z } from "zod";
import { jsonSchema } from "./json.validation";

const executeCodeSchema = z
    .object({
        source_code: z.string().nonempty("source code is required"),
        language_id: z.number(),
        stdin: z.array(z.string()).nonempty("Invalid or missing testcases"),
        expected_outputs: z.array(z.string()).nonempty("Invalid or missing testcases")
      })
      .superRefine((data, ctx) => {
        if (data.stdin.length !== data.expected_outputs.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid or missing testcases",
            path: ["expected_output"] 
          });
        }
      });

type ExecuteCodeSchema = z.infer<typeof executeCodeSchema>


const executeCodeSchemaValidation = (data:ExecuteCodeSchema)=>{
    return executeCodeSchema.safeParse(data)
}

export{executeCodeSchemaValidation}
