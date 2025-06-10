import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import type { RootState } from "@/redux/store";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { DiscussSchema, type DiscussFormValues } from "@/utils/ZodResolver";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { marked } from "marked";
import API from "@/utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import TurndownService from 'turndown';
import { zodResolver } from "@hookform/resolvers/zod";


const DiscussUpdatePage = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const {postid} = useParams()
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DiscussFormValues>({ resolver: zodResolver(DiscussSchema) });
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();
  const turndownService = new TurndownService();

  useEffect(()=>{
    const getPost = async()=>{
        const res = await API.get(`/discuss/post/${postid}`);
        // console.log("Res: ",res)
        setValue("title", res.data.data.title);
        setContent(turndownService.turndown(res.data.data.description));
        }
        getPost();
    
  },[])

  const handleContentChange = (value?: string) => {
    setContent(value || "");
    setValue("content", value || "");
  };

  const onSubmit = async (data: DiscussFormValues) => {
    const { title, content } = data;
    if (!title || !content) {
      ToastError("Missing Field Required");
    }
    const contentHtml = marked(content);
    // console.log("content: ", contentHtml);
    let payload = {
      title,
      contentHtml,
    };
    // console.log("data: ", payload);
    try {
      const res = await API.post(
        `/discuss/update/post/${postid}`,
        { title:payload.title,description:payload.contentHtml},
        { withCredentials: true }
      );
      // console.log("Res:  ",res)
      if (res.data.success) {
        // console.log("post: ",res.data)
        ToastSuccess(res.data.message);
        reset()
        handleContentChange("")
       setTimeout(()=> navigate("/discuss"),2000)
      }
    } catch (error:any) {
       ToastError(error?.response.data.error)
       
    }
  };
  // console.log("content: ",content)

  return (
    <>
      <Toast />
      <div className="min-h-[calc(100vh-50px)]  flex flex-col items-center py-10">
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
            </div>

            <div className="flex items-center gap-2">
              <Button  className="text-sm px-4 py-2 bg-neutral-800 hover:bg-neutral-700 cursor-pointer" onClick={()=>navigate("/discuss")}>
                Cancel
              </Button>
              <Button className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">Update</Button>
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
              <p className="text-red-500">{errors.content.message}</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default DiscussUpdatePage;
