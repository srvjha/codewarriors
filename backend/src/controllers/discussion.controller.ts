import { db } from "../db";
import { validId } from "../helper/validId.helper";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import {
  addCommentsValidation,
  createDiscussionPostValidation,
  updateDiscussionPostValidation,
} from "../validators/discussion.validation";

const getAllPost = asyncHandler(async (req, res) => {
  const allPosts = await db.discussion.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      commentsCount: true,
      upvotes: true,
      views: true,
      tags: true,
      user: {
        select: {
          username: true,
          fullName: true,
          avatar: true,
        },
      },
      DiscussionUpvote:{
        select:{
          userId:true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "All Posts Fetched Successfully"));
});

const getAllComments = asyncHandler(async (req, res) => {
  const allComments = await db.comment.findMany({
    select: {
      id: true,
      comment: true,
      upvote: true,
      discuss: {
        select: {
          id: true,
          title: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        },
      },
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, allComments, "All Comments Fetched Successfully")
    );
});

const getAllCommentsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allComments = await db.comment.findMany({
    where: {
      discussId: id,
    },
    select: {
      id: true,
      comment: true,
      upvote: true,
      discuss: {
        select: {
          id: true,
          title: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        },
      },
      CommentUpvote:{
        select:{
          userId:true
        }
      }
    },
  });
 
  return res
    .status(200)
    .json(
      new ApiResponse(200, allComments, "All Comments Fetched Successfully")
    );
});

const getPostById = asyncHandler(async (req, res) => {
  const { postid } = req.params;
  validId(postid, "Post");
  const post = await db.discussion.findUnique({
    where: {
      id: postid,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      commentsCount: true,
      upvotes: true,
      views: true,
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        },
      },
      comments: {
        select: {
          comment: true,
          upvote: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
              createdAt: true,
            },
          },
        },
      },
       DiscussionUpvote:{
        select:{
          userId:true
        }
      }
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Fetched Successfully"));
});

const addPost = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    tags = [],
  } = handleZodError(createDiscussionPostValidation(req.body));
  const userId = req.user.id;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const existingPost = await db.discussion.findFirst({
    where: {
      userId,
      title,
    },
  });

  if (existingPost) {
    throw new ApiError("You have already created a post with this title", 409);
  }

  const createPost = await db.discussion.create({
    data: {
      userId,
      title,
      description,
      tags,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(201, createPost, "Discussion Post Created Successfully")
    );
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, description, tags } = handleZodError(
    updateDiscussionPostValidation(req.body)
  );
  const { postid } = req.params;
  validId(postid, "Post");
  const post = await db.discussion.findUnique({
    where: {
      id: postid,
    },
  });
  if (!post) {
    throw new ApiError("Post not found", 404);
  }
  if (post.userId !== req.user.id) {
    throw new ApiError("Unauthorized", 401);
  }

  const updatePayload: Partial<{
    title: string;
    description: string;
    tags: string[];
  }> = {};

  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (tags !== undefined) updatePayload.tags = tags;

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError("At least one field is required to update", 400);
  }

  const updatePost = await db.discussion.update({
    where: {
      id: postid,
    },
    data: updatePayload,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePost, "Discussion Post Updated Successfully")
    );
});

const deletePost = asyncHandler(async (req, res) => {
  const { postid } = req.params;
  validId(postid, "Post");

  const post = await db.discussion.findUnique({
    where: {
      id: postid,
    },
  });

  if (!post) {
    throw new ApiError("Post already deleted or not found", 404);
  }

  await db.discussion.delete({
    where: {
      id: postid,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const addUpvotes = asyncHandler(async (req, res) => {
  const { postid } = req.params;
  const userId = req.user.id;
  // console.log({postid,userId})

  const post = await db.discussion.findUnique({ where: { id: postid } });
  if (!post) throw new ApiError("Post not found", 404);

  const alreadyUpvoted = await db.discussionUpvote.findUnique({
    where: {
      userId_discussionId: {
        userId,
        discussionId: postid,
      },
    },
  });

  // console.log({alreadyUpvoted})

  if (alreadyUpvoted) {
    await db.discussionUpvote.delete({
      where: { id: alreadyUpvoted.id },
    });

    await db.discussion.updateMany({
      where: { id: postid, upvotes: { gt: 0 } },
      data: { upvotes: { decrement: 1 } },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { voted: false }, "Upvoted Removed Successfully")
      );
  }

  await db.discussionUpvote.create({
    data: {
      userId,
      discussionId: postid,
    },
  });

  await db.discussion.update({
    where: { id: postid },
    data: { upvotes: { increment: 1 } },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { voted: true }, "Upvoted Successfully"));
});

const addCommentUpvote = asyncHandler(async (req, res) => {
  const { commentid } = req.params;
  const userId = req.user.id;

  const comment = await db.comment.findUnique({ where: { id: commentid } });
  if (!comment) throw new ApiError("Comment not found", 404);

  const alreadyUpvoted = await db.commentUpvote.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId: commentid,
      },
    },
  });

  if (alreadyUpvoted) {
    await db.commentUpvote.delete({
      where: { id: alreadyUpvoted.id },
    });

    await db.comment.updateMany({
      where: { id: commentid, upvote: { gt: 0 } },
      data: { upvote: { decrement: 1 } },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { voted: false }, "Comment upvote removed"));
  }

  await db.commentUpvote.create({
    data: {
      userId,
      commentId: commentid,
    },
  });

  await db.comment.update({
    where: { id: commentid },
    data: { upvote: { increment: 1 } },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { voted: true }, "Comment upvoted"));
});

const addCommentToPost = asyncHandler(async (req, res) => {
  const { comment } = handleZodError(addCommentsValidation(req.body));
  const { postid } = req.params;

  const post = await db.discussion.findUnique({
    where: {
      id: postid,
    },
  });

  if (!post) {
    throw new ApiError("Post not found", 404);
  }

  const newComment = await db.comment.create({
    data: {
      discussId: postid,
      comment,
      userId: req.user.id,
    },
  });

  await db.discussion.update({
    where: { id: postid },
    data: { commentsCount: { increment: 1 } },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newComment, "Comment added successfully"));
});

const updateCommentToPost = asyncHandler(async (req, res) => {
  const { comment } = handleZodError(addCommentsValidation(req.body));
  const { cid } = req.params;
  validId(cid, "Comment");

  const commentInfo = await db.comment.findUnique({
    where: {
      id: cid,
    },
  });

  if (!commentInfo) {
    throw new ApiError("Comment not found", 404);
  }

  if (commentInfo.userId !== req.user.id) {
    throw new ApiError("Unauthorized", 401);
  }

  const updateComment = await db.comment.update({
    where: {
      id: cid,
    },
    data: {
      comment,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  validId(cid, "Comment");

  const commentInfo = await db.comment.findUnique({
    where: {
      id: cid,
    },
  });

  if (!commentInfo) {
    throw new ApiError("Comment not found", 404);
  }

  await db.comment.delete({
    where: {
      id: cid,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment Deleted Successfully"));
});

export {
  addPost,
  updatePost,
  deletePost,
  addCommentToPost,
  updateCommentToPost,
  deleteComment,
  addUpvotes,
  getAllPost,
  getPostById,
  getAllComments,
  addCommentUpvote,
  getAllCommentsById
};
