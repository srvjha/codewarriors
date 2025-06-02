import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/AxiosInstance";
// import TurndownService from "turndown";
import type { Post } from "@/types/discuss/post";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { ToastError } from "@/utils/ToastContainers";
import { Separator } from "@/components/ui/separator";

const PostPage = () => {
  const { postid } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  //   const turndownService = new TurndownService();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/discuss/post/${postid}`);
        console.log("Res: ", res);
        setPost(res.data.data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postid]);

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
      console.log("upvote: ", res.data);
      if (res.data.data.voted) {
        setPost((prev) =>
          prev?.id === postid ? { ...post, upvotes: post.upvotes + 1 } : post
        );
      } else {
        setPost((prev) =>
          prev?.id === postid ? { ...post, upvotes: post.upvotes - 1 } : post
        );
      }
    } catch (error: any) {
      setPost((prev) =>
        prev?.id === postid ? { ...post, upvotes: post.upvotes - 1 } : post
      );
      ToastError(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-white">
      <div className="bg-transparent rounded-xl shadow-xl p-6 space-y-4">
        {/* Author Info */}
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
                post.upvotes > 0
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
      </div>
    </div>
  );
};

export default PostPage;
