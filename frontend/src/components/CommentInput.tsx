import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import API from "@/utils/AxiosInstance";
import { ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { SendHorizonalIcon, XIcon } from "lucide-react";

type Props = {
  postId: string;
  editComment?: {
    id: string;
    text: string;
  };
  onSuccess: () => void;
  onCancelEdit: () => void;
};

const CommentInput = ({
  postId,
  editComment,
  onSuccess,
  onCancelEdit,
}: Props) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (editComment) {
      setComment(editComment.text);
    } else {
      setComment("");
    }
  }, [editComment]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      if (editComment) {
        await API.post(`/discuss/update/comment/${editComment.id}`, {
          comment,
        });
        ToastSuccess("Comment updated");
      } else {
        await API.post(`/discuss/create/comment/post/${postId}`, {
          comment,
        });
        ToastSuccess("Comment posted");
      }

      setComment("");
      onSuccess();
    } catch (err: any) {
      ToastError(err?.response?.data?.error || "Failed to submit comment");
    }
  };

  return (
    <div className="bg-neutral-900 mt-6 rounded-xl p-4">
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type comment here..."
        className="bg-transparent text-white border-none placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <div className="flex justify-end items-center gap-3 mt-3">
        {editComment && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setComment("");
              onCancelEdit();
            }}
            className="text-red-400"
          >
            <XIcon size={16} className="mr-1" />
            Cancel
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          className="bg-zinc-100 hover:bg-zinc-200 text-neutral-900 cursor-pointer px-4 py-2"
        >
          <SendHorizonalIcon size={16} className="mr-1" />
          {editComment ? "Update" : "Comment"}
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
