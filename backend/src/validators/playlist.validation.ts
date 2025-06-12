import { z } from "zod";

 const createPlaylistSchema = z.object({
   name:z.string().nonempty("Missing required fields"),
   description:z.string().optional(),
   visibilty:z.boolean().optional(),
   type:z.string().optional()
});



const addProblemsToPlaylistSchema = z.object({
  problemIds: z.array(
    z.string().nonempty({ message: "Missing Required ProblemId" })
  ).nonempty({ message: "problemIds must be a non-empty array" })
});



type CreatePlaylist = z.infer<typeof createPlaylistSchema>
type AddProblemsToPlaylist = z.infer<typeof addProblemsToPlaylistSchema>


const createPlaylistValidation = (data:CreatePlaylist)=>{
    return createPlaylistSchema.safeParse(data)
}

const addProblemsValidation = (data:AddProblemsToPlaylist)=>{
    return addProblemsToPlaylistSchema.safeParse(data)
}

export{createPlaylistValidation,addProblemsValidation}
