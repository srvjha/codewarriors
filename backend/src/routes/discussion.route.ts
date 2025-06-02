import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { addCommentToPost, addPost, addUpvotes, deleteComment, deletePost, getAllPost, getPostById, updateCommentToPost, updatePost } from "../controllers/discussion.controller";

const router = Router();

router.post("/create/post",verifyUser,addPost);
router.post("/update/post/:postid",verifyUser,updatePost);
router.delete("/delete/post/:postid",verifyUser,deletePost);
router.patch("/upvote/post/:postid",verifyUser,addUpvotes);
router.post("/create/comment/post/:postid",verifyUser,addCommentToPost);
router.post("/update/comment/:cid",verifyUser,updateCommentToPost);
router.delete("/delete/comment/:cid",verifyUser,deleteComment)
router.get("/post/all",verifyUser,getAllPost)
router.get("/post/:postid",verifyUser,getPostById)

export default router
