import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea"; 
import { X, Plus } from "lucide-react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";

const CreatePlaylistModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
   const [visibility, setVisibility] = useState<"public" | "private">("private");
  const handleCreatePlaylist = async () => {
    if (!name.trim()) return ToastError("Playlist name is required");

    try {
      const res = await API.post(
        "/playlist/create",
        {
          name,
          description,
          visibilty: visibility === "public" ? true : false,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        ToastSuccess("Playlist created successfully!");
        setName("");
        setDescription("");
        setTimeout(() => onClose(), 1500);
      }
    } catch (err: any) {
      ToastError(err.response?.data?.error || "Failed to create playlist");
    }
  };

  return (
    <>
      <Toast />
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-zinc-950 p-6 rounded-xl w-[430px] relative">
          <button
            className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            onClick={onClose}
          >
            <X />
          </button>
          <h2 className="text-lg font-semibold text-white text-center mb-4">
            Create New Playlist
          </h2>
          <div className="flex flex-col gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist Name"
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="bg-zinc-800 text-white border-zinc-700 resize-none"
              rows={3}
            />
            <div className="flex items-center gap-3">
                <label className="text-sm text-white">Visibility:</label>
                <select
                  value={visibility}
                  onChange={(e) =>
                    setVisibility(e.target.value as "public" | "private")
                  }
                  className="bg-zinc-800 text-white px-3 py-1 rounded-md border border-zinc-700"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            <button
              onClick={handleCreatePlaylist}
              className="bg-zinc-100 text-black flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-zinc-200 transition"
            >
              <Plus size={18} />
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePlaylistModal;
