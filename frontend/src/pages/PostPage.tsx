import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/AxiosInstance";
// import TurndownService from "turndown";
import type { Comment, PostComment } from "@/types/discuss/post";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Eye, MessageSquare, ThumbsUp} from "lucide-react";
import { Toast, ToastError } from "@/utils/ToastContainers";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentInput from "@/components/CommentInput";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const PostPage = () => {
  const { postid } = useParams();
  const [post, setPost] = useState<PostComment | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const { userData } = useSelector((state: RootState) => state.auth);
  // console.log({userData})
  //   const turndownService = new TurndownService();

  const fetchPost = async () => {
    try {
      const res = await API.get(`/discuss/post/${postid}`);
      setPost(res.data.data);
    } catch (err) {
      console.error("Failed to fetch post", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/discuss/comments/${postid}`);
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPost(), fetchComments()]);
      setLoading(false);
    };

    fetchData();
  }, [postid]);

  const handleRefetchComments = async () => {
    await Promise.all([fetchPost(), fetchComments()]);
  };

  if (loading) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-10 text-red-400">Post not found.</div>
    );
  }

  const { title, description, createdAt, user, upvotes, views, commentsCount } =
    post;

  const handleUpvote = async (postid: string) => {
    try {
      const res = await API.patch(`/discuss/upvote/post/${postid}`, {
        withCredentials: true,
      });
      // console.log("upvote: ", res.data);
      if (res.data.data.voted) {
        setPost((prev) =>
          prev?.id === postid && userData?.id
            ? {
                ...post,
                upvotes: post.upvotes + 1,
                DiscussionUpvote: [
                  ...post.DiscussionUpvote,
                  { userId: userData.id },
                ],
              }
            : post
        );
      } else {
        setPost((prev) =>
          prev?.id === postid && userData?.id
            ? {
                ...post,
                upvotes: post.upvotes - 1,
                DiscussionUpvote: post.DiscussionUpvote.filter(
                  (upvote) => upvote.userId !== userData?.id
                ),
              }
            : post
        );
      }
    } catch (error: any) {
      setPost((prev) =>
        prev?.id === postid ? { ...post, upvotes: post.upvotes - 1 } : post
      );
      ToastError(error?.response?.data?.error || "Something went wrong");
    }
  };

  const handleCommentUpvote = async (commentId: string) => {
    try {
      const res = await API.patch(`/discuss/comment/${commentId}/upvote`, {
        withCredentials: true,
      });
      if (res.data.data.voted) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId && userData?.id
              ? {
                  ...c,
                  upvote: c.upvote + 1,
                  CommentUpvote: [...c.CommentUpvote, { userId: userData.id }],
                }
              : c
          )
        );
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId && userData?.id
              ? {
                  ...c,
                  upvote: c.upvote - 1,
                  CommentUpvote: c.CommentUpvote.filter(
                    (upvote) => upvote.userId !== userData?.id
                  ),
                }
              : c
          )
        );
      }
    } catch (error: any) {
      ToastError(error?.response?.data?.error || "Something went wrong");
    }
  };
  const hasUserUpvoted = (discuss: { userId: string }[]) => {
    return userData
      ? discuss.some((post) => post.userId?.includes(userData.id))
      : false;
  };

  const hasUserCommented = (comments: { userId: string }[]) => {
    return userData
      ? comments.some((comment) => comment.userId?.includes(userData.id))
      : false;
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await API.delete(`/discuss/delete/comment/${commentId}`);
       await Promise.all([fetchPost(), fetchComments()]);
    } catch (error: any) {
      console.error(error.response.data.error || "Failed to delete Comment");
    }

  };

  return (
    <> 
    <Toast/> 
    <div className="max-w-7xl mx-auto px-4 py-10 text-white">
      <div className="bg-transparent rounded-xl shadow-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-12 h-12 rounded-full object-cover border border-gray-700"
          />
          <div>
            <p className="text-lg font-semibold">{user.fullName}</p>
            <p className="text-sm text-gray-400">
              Posted on {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold">{title}</h3>

        <div className="prose prose-invert max-w-none">
          {/* {turndownService.turndown(description)} */}
          <MarkdownPreview source={description} style={{ padding: 16 }} />
        </div>
        <div className="flex ml-4 items-center gap-4 mt-6 text-sm bg-neutral-900 w-48 h-10 px-5 py-2 rounded-lg text-gray-400">
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-pink-500"
            onClick={() => handleUpvote(post.id)}
          >
            <ThumbsUp
              size={16}
              className={`${
                // post.upvotes > 0
                //   ? "text-pink-600 fill-pink-600"
                //   : "text-gray-400"
                hasUserUpvoted(post.DiscussionUpvote)
                  ? "text-pink-600 fill-pink-600"
                  : "text-gray-400"
              }`}
            />
            <span>{upvotes}</span>
          </div>
          <Separator
            orientation="vertical"
            className="border border-neutral-700"
          />
          <div className="flex items-center gap-1">
            <Eye size={16} className="text-gray-400" />
            <span>{views}</span>
          </div>
          <Separator
            orientation="vertical"
            className="border border-neutral-700"
          />
          <div className="flex items-center gap-1">
            <MessageSquare size={16} className="text-gray-400" />
            <span>{commentsCount}</span>
          </div>
        </div>

        <CommentInput
          postId={postid ?? ""}
          editComment={
            editingComment
              ? { id: editingComment.id, text: editingComment.comment }
              : undefined
          }
          onSuccess={() => {
            handleRefetchComments();
            setEditingComment(null);
          }}
          onCancelEdit={() => setEditingComment(null)}
        />
        <div className="space-y-6 mt-7">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={comment.user.avatar}
                  alt={comment.user.fullName}
                />
                <AvatarFallback className="text-black font-semibold text-lg">
                  {comment.user.fullName?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">
                    {comment.user.fullName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="text-gray-300 mt-1">{comment.comment}</div>

                <div
                  className="flex items-center gap-4 text-gray-400 cursor-pointer text-sm mt-2"
                  onClick={() => handleCommentUpvote(comment.id)}
                >
                  <div className="flex items-center gap-1">
                    <ThumbsUp
                      size={16}
                      className={`${
                        // post.upvotes > 0
                        //   ? "text-pink-600 fill-pink-600"
                        //   : "text-gray-400"
                        hasUserCommented(comment.CommentUpvote)
                          ? "text-pink-600 fill-pink-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div> {comment.upvote}</div>

                    <div className=" gap-4 ml-4 flex">
                      {comment.user.username === userData?.username && (
                        <span
                          onClick={() => setEditingComment(comment)}
                          className="cursor-pointer text-blue-400 hover:text-blue-500"
                        >
                          Edit
                        </span>
                      )}

                      {(comment.user.username === userData?.username ||
                        userData?.role === "ADMIN") && (
                        <span
                          onClick={() => handleDeleteComment(comment.id)}
                          className="cursor-pointer text-red-400 hover:text-red-500"
                        >
                          Delete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default PostPage;
