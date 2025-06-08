import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { X, PlusSquare, Trash } from "lucide-react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Playlist } from "@/types/problem/problemTypes";

const PlaylistSheet = ({
  problemId,
  onClose,
}: {
  problemId: string;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState<"public" | "private">("public");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  const fetchPlaylists = async () => {
    try {
      const res = await API.get(`/playlist/all/${tab}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const playlistData = res.data.data;
        const favouriteSection = playlistData.filter(
          (data: Playlist) => (data.name !== "Beginner's Foundation" 
          && data.name !== "Intermediate Mastery"
          && data.name !== "Advanced Conquest"
          && data.name !== "Google Interview Questions"
          && data.name !== "Amazon Interview Questions"
          && data.name !== "Microsoft Interview Questions")
        );
        if (tab === "public") {
          setPlaylists(favouriteSection);
        }
       else{
         setPlaylists(playlistData);
       }
      }
    } catch (err) {
      ToastError("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [tab]);

  const handleAdd = async (playlistId: string) => {
    try {
      const res = await API.post(
        `/playlist/${playlistId}/problem/${problemId}/add`,
        {},
        { withCredentials: true }
      );
      ToastSuccess(res.data.message);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      ToastError(err.response.data.error);
    }
  };

  const handleRemove = async (playlistId: string) => {
    try {
      const res = await API.delete(
        `/playlist/${playlistId}/problem/${problemId}/remove`,
        { withCredentials: true }
      );
      ToastSuccess(res.data.message);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      ToastError(err.response.data.error);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return ToastError("Enter playlist name");
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
      ToastSuccess(res.data.message);
      setPlaylists((prev) => [...prev, res.data.data]);
      setName("");
      setDescription("");
    } catch (err: any) {
      ToastError(err.response.data.error);
    }
  };

  return (
    <>
      <Toast />
      <div className="fixed inset-0 bg-neutral-900/40 z-50 flex items-center justify-center">
        <div className="bg-neutral-950 p-5 rounded-xl w-[450px] max-h-[90vh] overflow-auto relative">
          <button
            className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            onClick={onClose}
          >
            <X />
          </button>
          <h2 className="text-lg font-semibold text-white text-center mb-4">
            Add to Playlist
          </h2>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("public")}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                tab === "public"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              )}
            >
              Public
            </button>
            <button
              onClick={() => setTab("private")}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                tab === "private"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              )}
            >
              Private
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between p-2 bg-zinc-800 rounded-md"
              >
                <div className="text-white font-medium">{playlist.name}</div>
                <div className="flex gap-2">
                  <PlusSquare
                    className="text-green-500 hover:text-green-700 cursor-pointer"
                    size={18}
                    onClick={() => handleAdd(playlist.id)}
                  />
                  {playlist.name !== "Favourite" && (
                    <Trash
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      size={18}
                      onClick={() => handleRemove(playlist.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-zinc-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Create New Playlist
            </h3>
            <div className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Playlist name"
                className="bg-zinc-800 text-white border-zinc-700"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="bg-zinc-800 text-white border-zinc-700"
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
                onClick={handleCreate}
                className="w-full bg-white text-black py-2 rounded-lg hover:bg-zinc-200 font-medium"
              >
                Create Playlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistSheet;
