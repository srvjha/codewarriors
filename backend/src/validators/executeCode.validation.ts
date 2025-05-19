import { z } from "zod";

const executeCodeSchema = z.object({
  source_code: z.string().nonempty("source code is required"),
  language: z.string().nonempty("language id is required"),
  stdin: z.array(z.string()).optional(),
});

type ExecuteCodeSchema = z.infer<typeof executeCodeSchema>;

const executeCodeSchemaValidation = (data: ExecuteCodeSchema) => {
  return executeCodeSchema.safeParse(data);
};

export { executeCodeSchemaValidation };
