import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { addCommentToPost, addCommentUpvote, addPost, addUpvotes, deleteComment, deletePost, getAllComments, getAllCommentsById, getAllPost, getPostById, updateCommentToPost, updatePost } from "../controllers/discussion.controller";

const router = Router();

router.post("/create/post",verifyUser,addPost);
router.post("/update/post/:postid",verifyUser,updatePost);
router.delete("/delete/post/:postid",verifyUser,deletePost);
router.patch("/upvote/post/:postid",verifyUser,addUpvotes);
router.post("/create/comment/post/:postid",verifyUser,addCommentToPost);
router.post("/update/comment/:cid",verifyUser,updateCommentToPost);
router.delete("/delete/comment/:cid",verifyUser,deleteComment)
router.get("/post/all",getAllPost)
router.get("/post/:postid",getPostById)
router.get("/comments/all",getAllComments)
router.get("/comments/:id",getAllCommentsById)
router.patch("/comment/:commentid/upvote", verifyUser, addCommentUpvote);


export default router
