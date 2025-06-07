import { z } from "zod";


const createContest = z.object({
    title: z.string(),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.enum(["LIVE","UPCOMING","ENDED"]),
    problems:z.array(
        z.object({
            id: z.string()
        })
     )
    
}) 



type CreateContest = z.infer<typeof createContest>;



const createContestValidation = (data: CreateContest) => {
  return createContest.safeParse(data);
};

export {
  createContestValidation
};
