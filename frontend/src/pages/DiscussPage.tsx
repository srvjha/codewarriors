import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  SquarePen,
  ChartNoAxesCombined,
  Ellipsis,
  Compass,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { Post } from "@/types/discuss/post";
import { ClipLoader } from "react-spinners";

const DiscussPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<null | "mv" | "lt">(null);
   const [loading, setLoading] = useState(true);

  const formatTime = (date: string) => {
    const postCreatedTime = new Date(date);
    const currentTime = new Date();
    const diffMs = currentTime.getTime() - postCreatedTime.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    const fetchAllPost = async () => {
      const res = await API.get("/discuss/post/all", { withCredentials: true });
      if (res.status) {
        setOriginalPosts(res.data.data);
        setPosts(res.data.data);
        setLoading(false);
      }
    };
    fetchAllPost();
  }, []);

  const handleUpvote = async (postid: string) => {
    try {
      const res = await API.patch(`/discuss/upvote/post/${postid}`, {
        withCredentials: true,
      });
      // console.log("upvote: ", res.data);
      if (res.data.data.voted) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postid && userData?.id
              ? {
                  ...post,
                  upvotes: post.upvotes + 1,
                  DiscussionUpvote: [
                    ...post.DiscussionUpvote,
                    { userId: userData.id },
                  ],
                }
              : post
          )
        );
      } else {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postid && userData
              ? {
                  ...post,
                  upvotes: post.upvotes - 1,
                  DiscussionUpvote: post.DiscussionUpvote.filter(
                    (upvote) => upvote.userId !== userData?.id
                  ),
                }
              : post
          )
        );
      }
    } catch (error: any) {
      ToastError(error?.response?.data?.error || "Something went wrong");
    }finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const res = await API.delete(`/discuss/delete/post/${postId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        ToastSuccess("Post deleted successfully");
      }
    } catch (error: any) {
      ToastError(error?.response?.data?.error || "Failed to delete post");
    }
  };

  const handleDialogClose = (value: boolean) => {
    setDeleteDialogOpen(value);
    setSelectedPostId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPostId) {
      await handleDelete(selectedPostId);
    }
    handleDialogClose(false);
  };

  const handleFilter = (type: "mv" | "lt") => {
    if (activeFilter === type) {
      setActiveFilter(null);
      setPosts(originalPosts);
    } else {
      setActiveFilter(type);
      const sorted =
        type === "mv"
          ? [...originalPosts].sort((a, b) => b.upvotes - a.upvotes)
          : [...originalPosts].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
      setPosts(sorted);
    }
  };

  const tagMap = originalPosts.reduce<Record<string, Post[]>>((acc, post) => {
    const tag = post.tags?.[0] || "Other";
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(post);
    return acc;
  }, {});

  const hasUserUpvoted = (discuss: { userId: string }[]) => {
    return userData
      ? discuss.some((post) => post.userId?.includes(userData.id))
      : false;
  };

  return (
    <>
      <Toast />
       {loading && (
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClipLoader size={50} color="#4F46E5" />
              </div>
            )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDialogClose}>
        <AlertDialogContent className="bg-neutral-900 border-none text-neutral-100">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="text-neutral-900 border border-neutral-950"
              onClick={() => handleDialogClose(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 hover:bg-red-800"
              onClick={handleDeleteConfirm}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-6 max-w-7xl mx-auto relative">
        <div className="flex justify-end  px-4 max-w-[97%]">
          <Button
            className="text-base sm:text-base font-semibold mb-4 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => navigate("/discuss/create")}
          >
            <SquarePen size={18} className="mr-1" /> Create
          </Button>
        </div>
        <div className="flex gap-2 mb-6 px-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border ${
              activeFilter === "mv" ? "border-blue-500" : "border-neutral-800"
            }   hover:border-blue-500 hover:from-blue-900/20 hover:to-blue-800/20 cursor-pointer transition-all duration-300 group`}
            onClick={() => handleFilter("mv")}
          >
            <ThumbsUp
              size={16}
              className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
            />
            <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
              Most Votes
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border ${
              activeFilter === "lt" ? "border-blue-500" : "border-neutral-800"
            }   hover:border-blue-500 hover:from-blue-900/20 hover:to-blue-800/20 cursor-pointer transition-all duration-300 group`}
            onClick={() => handleFilter("lt")}
          >
            <ChartNoAxesCombined
              size={16}
              className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
            />
            <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
              Latest
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 px-4 flex-2 ">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="w-full max-w-full border-0  shadow shadow-neutral-700  hover:shadow-neutral-500 transition-all duration-300 rounded-xl"
              >
                <CardContent className="p-4">
                  <Link to={`/discuss/${post.id}`}>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback className="text-sm">
                            {post.user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                          <span className="font-medium text-white">
                            {post.user.fullName} (@{post.user.username})
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">
                            {formatTime(post.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2">
                        {post.tags.map((tag, index) => {
                          return (
                            <div
                              key={index}
                              className="bg-zinc-900 border-1 border-neutral-700 px-2.5 py-0.5 text-sm  h-7 rounded-full text-center"
                            >{`# ${tag}`}</div>
                          );
                        })}
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2 hover:underline transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-300 text-base line-clamp-2">
                      {post.description.replace(/<[^>]+>/g, "")}
                    </p>
                  </Link>

                  <div className=" flex justify-between">
                    <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
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
                        <span>{post.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} className="text-gray-400" />
                        <span>{post.views}</span>
                      </div>
                      <Link to={`/discuss/${post.id}`}>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <MessageSquare size={16} className="text-gray-400" />
                          <span>{post.commentsCount}</span>
                        </div>
                      </Link>
                    </div>
                    {post.user.username === userData?.username ? (
                      <div className="mt-6 cursor-pointer">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Ellipsis className="mt-6" size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-16 text-left px-2  bg-zinc-800 text-zinc-100 border-none">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/discuss/edit/${post.id}`)
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className=" border border-neutral-700" />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                setSelectedPostId(post.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex-1 h-[70vh] w-full overflow-y-auto sticky self-start top-[100px]">
            <div className="h-full w-[90%] border p-5 border-neutral-700 bg-neutral-950/20 hover:shadow-neutral-500 transition-all duration-300 rounded-xl ">
              <div className="p-1 flex gap-2 items-center mb-4">
                <span className="text-xl font-semibold text-white">
                  Explore
                </span>
                <Compass className="text-white" size={20} />
              </div>

              {Object.entries(tagMap).map(([tag, posts], idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-zinc-400 font-medium mb-1">#{tag}</p>
                  {posts.map((post) => (
                    <Link to={`/discuss/${post.id}`}>
                      <p
                        key={post.id}
                        className="text-zinc-200 text-sm hover:underline cursor-pointer truncate"
                      >
                        {post.title}
                      </p>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscussPage;
