import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { marked } from "marked";
import MDEditor from "@uiw/react-md-editor";
import { PlusCircle, X } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";
import { DiscussSchema, type DiscussFormValues } from "@/utils/ZodResolver";
import type { RootState } from "@/redux/store";

const DiscussCreatePage = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiscussFormValues>({ resolver: zodResolver(DiscussSchema) });

  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const topics = watch("topics") || [];

  const handleContentChange = (value?: string) => {
    setContent(value || "");
    setValue("content", value || "");
  };

  const handleSaveTopic = () => {
    const trimmed = newTopic.trim();
    if (trimmed && !topics.includes(trimmed)) {
      const updated = [...topics, trimmed];
      setValue("topics", updated);
    }
    setNewTopic("");
    setIsModalOpen(false);
  };

  const removeTopic = (topicToRemove: string) => {
    const updated = topics.filter((topic) => topic !== topicToRemove);
    setValue("topics", updated);
  };

  const onSubmit = async (data: DiscussFormValues) => {
    const { title, content, topics } = data;
    if (!title || !content) {
      ToastError("Missing Field Required");
      return;
    }

    const contentHtml = marked(content);
    const payload = {
      title,
      contentHtml,
      topics,
    };

    try {
      const res = await API.post(
        "/discuss/create/post",
        {
          title: payload.title,
          description: payload.contentHtml,
          tags: payload.topics,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        ToastSuccess(res.data.message);
        reset();
        handleContentChange("");
        setTimeout(() => navigate("/discuss"), 2000);
      }
    } catch (error: any) {
      ToastError(error?.response?.data?.error || "Failed to post");
    }
  };

  return (
    <>
      <Toast />
      <div className="min-h-[calc(100vh-50px)] flex flex-col items-center py-10">
        <form
          className="w-full max-w-7xl bg-neutral-900 rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="px-4 py-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userData?.avatar} />
              <AvatarFallback className="text-black font-semibold text-lg bg-white">
                {userData?.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Input
                placeholder="Title"
                className="border-0 text-xl w-full h-12 px-4 py-2 text-white shadow-none bg-transparent focus-visible:ring-0 focus:border-0"
                {...register("title")}
              />
              {errors?.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}

              <div
                className="ml-2 border-1 border-neutral-600 cursor-pointer hover:bg-neutral-800 w-32 h-10 px-3 py-2 gap-2 rounded-xl flex justify-center items-center mt-2"
                onClick={() => setIsModalOpen(true)}
              >
                <span>Add Topic</span>
                <PlusCircle size={20} />
              </div>

              {isModalOpen && (
                <div className="fixed z-50 text-white maw-w-xl w-[300px] bg-neutral-950/50 px-4 py-3 rounded-xl gap-2 mt-2">
                  <div className="flex justify-end">
                    <button
                      className=" text-white hover:text-red-500 "
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <Input
                    className="w-full px-4 py-2 mt-2 text-white bg-zinc-800 border-0 hover:border-zinc-700"
                    placeholder="Type topic and press Enter"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveTopic();
                      }
                    }}
                  />
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <div
                    key={topic}
                    className="bg-neutral-700/60 text-white px-4 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="text-sm px-4 py-2 bg-neutral-800 hover:bg-neutral-700"
                onClick={() => navigate("/discuss")}
              >
                Cancel
              </Button>
              <Button className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700">
                Post
              </Button>
            </div>
          </div>

          <div data-color-mode="dark">
            <MDEditor
              height={600}
              preview="live"
              className="rounded-lg shadow-lg"
              value={content}
              onChange={handleContentChange}
            />
            {errors?.content && (
              <p className="text-red-500 px-4">{errors.content.message}</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default DiscussCreatePage;
