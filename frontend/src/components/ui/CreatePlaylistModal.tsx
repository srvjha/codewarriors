import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea"; 
import { X, Plus, Edit } from "lucide-react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";

interface CreatePlaylistModalProps {
  onClose: () => void;
  defaultName?: string;
  defaultDescription?: string;
  defaultVisibility?: "public" | "private";
  playlistId?: string | null;
  isEditing?: boolean;
}

const CreatePlaylistModal = ({ 
  onClose, 
  defaultName = "", 
  defaultDescription = "", 
  defaultVisibility = "private",
  playlistId = null,
  isEditing = false
}: CreatePlaylistModalProps) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [visibility, setVisibility] = useState<"public" | "private">(defaultVisibility);


  useEffect(() => {
    setName(defaultName);
    setDescription(defaultDescription);
    setVisibility(defaultVisibility);
  }, [defaultName, defaultDescription, defaultVisibility]);

  const handleCreateOrUpdatePlaylist = async () => {
    if (!name.trim()) return ToastError("Playlist name is required");

    try {
      let res;
      
      if (isEditing && playlistId) {
        // Update existing playlist
        res = await API.put(
          `/playlist/${playlistId}`,
          {
            name,
            description,
            visibility: visibility === "public" ? true : false,
            type: visibility === "public" ? "public" : "private"
          },
          { withCredentials: true }
        );
      } else {
        // Create new playlist
        res = await API.post(
          "/playlist/create",
          {
            name,
            description,
            visibilty: visibility === "public" ? true : false,
            type: visibility === "public" ? "public" : "private"
          },
          { withCredentials: true }
        );
      }

      if (res.data.success) {
        ToastSuccess(
          isEditing 
            ? "Playlist updated successfully!" 
            : "Playlist created successfully!"
        );
        setName("");
        setDescription("");
        setVisibility("private");
        setTimeout(() => onClose(), 1500);
      }
    } catch (err: any) {
      ToastError(
        err.response?.data?.error || 
        `Failed to ${isEditing ? 'update' : 'create'} playlist`
      );
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
            {isEditing ? "Edit Playlist" : "Create New Playlist"}
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
              onClick={handleCreateOrUpdatePlaylist}
              className="bg-zinc-100 text-black flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-zinc-200 transition"
            >
              {isEditing ? <Edit size={18} /> : <Plus size={18} />}
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePlaylistModal;