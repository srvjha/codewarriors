import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  SquarePen,
  ChartNoAxesCombined,
  Ellipsis,
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



const DiscussPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<null | "mv" | "lt">(null);

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
      console.log("post details: ", res.data.data);
      if (res.status) {
         setOriginalPosts(res.data.data);
      setPosts(res.data.data);
      }
    };
    fetchAllPost();
  }, []);

  const handleUpvote = async (postid: string) => {
    try {
      const res = await API.patch(`/discuss/upvote/post/${postid}`, {
        withCredentials: true,
      });
      console.log("upvote: ", res.data);
      if (res.data.data.voted) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postid ? { ...post, upvotes: post.upvotes + 1 } : post
          )
        );
      } else {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postid ? { ...post, upvotes: post.upvotes - 1 } : post
          )
        );
      }
    } catch (error: any) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postid
            ? { ...post, upvotes: post.upvotes + 1 } // in case of any error then will make it 0
            : post
        )
      );
      ToastError(error?.response?.data?.error || "Something went wrong");
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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
    setPosts(sorted);
  }
};


  return (
    <>
      <Toast />
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

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-end  px-4 max-w-[80%]">
          <Button
            className="text-base sm:text-base font-semibold mb-4 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => navigate("/discuss/create")}
          >
            <SquarePen size={18} className="mr-1" /> Create
          </Button>
        </div>
        <div className="flex gap-2 mb-6 px-4">
          <div 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border ${activeFilter === "mv"?"border-blue-500" :"border-neutral-800"}   hover:border-blue-500 hover:from-blue-900/20 hover:to-blue-800/20 cursor-pointer transition-all duration-300 group`}
          onClick={() => handleFilter("mv")}
          >
            <ThumbsUp
              size={16}
              className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
            />
            <span
              className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-300"
              
            >
              Most Votes
            </span>
          </div>

          <div 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border ${activeFilter === "lt"?"border-blue-500" :"border-neutral-800"}   hover:border-blue-500 hover:from-blue-900/20 hover:to-blue-800/20 cursor-pointer transition-all duration-300 group`}
           onClick={() => handleFilter("lt")}
          >
            <ChartNoAxesCombined
              size={16}
              className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
            />
            <span
              className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-300"
             
            >
              Latest
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 w-[80%] sm:grid-cols-2 lg:grid-cols-1 gap-6 px-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="w-full max-w-full border-0 border-b border-b-neutral-700 bg-[#151414] shadow-md hover:shadow-blue-900/20 transition-all duration-300 rounded-xl"
            >
              <CardContent className="p-4">
                <Link to={`/discuss/${post.id}`}>
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
                          post.upvotes > 0
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
                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} className="text-gray-400" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                  {post.user.username === userData?.username ? (
                    <div className="mt-6 cursor-pointer">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Ellipsis className="mt-6" size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-16 text-left px-2  bg-zinc-800 text-zinc-100 border-none">
                          <DropdownMenuItem
                            onClick={() => navigate(`/discuss/edit/${post.id}`)}
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
      </div>
    </>
  );
};

export default DiscussPage;
