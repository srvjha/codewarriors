import { z } from "zod";


const createDiscussionPostSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  tags:z.array(z.string()).optional()
  
});

const updateDiscussionPostSchema = createDiscussionPostSchema.partial()
const commentSchema = z.object({
    comment:z.string().nonempty("Comment is required")
}
)


type CreateDiscussionPost = z.infer<typeof createDiscussionPostSchema>;
type UpdateDiscussionPost = z.infer<typeof updateDiscussionPostSchema>;
type AddComment = z.infer<typeof commentSchema>;

const createDiscussionPostValidation = (data: CreateDiscussionPost) => {
  return createDiscussionPostSchema.safeParse(data);
};

const updateDiscussionPostValidation = (data: UpdateDiscussionPost) => {
  return updateDiscussionPostSchema.safeParse(data);
};

const addCommentsValidation = (data:AddComment)=>{
    return commentSchema.safeParse(data)
}


export {
  createDiscussionPostValidation,
  updateDiscussionPostValidation,
  addCommentsValidation
};
