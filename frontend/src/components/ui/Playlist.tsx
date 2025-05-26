// components/ui/Playlist.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { X, Plus, PlusSquare, Trash } from "lucide-react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";


const Playlist = ({
  problemId,
  onClose,
}: {
  problemId: string;
  onClose: () => void;
}) => {
  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    const getAllPlaylists = async () => {
      try {
        const res = await API.get("/playlist/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          setAllPlaylists(res.data.data);
        }
      } catch (err) {
        ToastError("Failed to fetch playlists");
      }
    };

    getAllPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      const res = await API.post(
        `/playlist/${playlistId}/problem/${problemId}/add`,
        {},
        { withCredentials: true }
      );
      console.log(res)
      if (res.data.success) {
        console.log("res data: ",res.data.message)
        ToastSuccess(res.data.message);
        setTimeout(()=>onClose(),2000);
      }
    } catch (err:any) {
        ToastError(err.response.data.error);
     
    }
  };

   const handleRemoveFromPlaylist = async (playlistId: string) => {
    try {
      const res = await API.delete(
        `/playlist/${playlistId}/problem/${problemId}/remove`,
        { withCredentials: true }
      );
      console.log(res)
      if (res.data.success) {
        ToastSuccess(res.data.message);
        setTimeout(()=>onClose(),2000);
      }
    } catch (err:any) {
        ToastError(err.response.data.error);     
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return ToastError("Enter playlist name");

    try {
      const res = await API.post(
        "/playlist/create",
        { name: newPlaylistName },
        { withCredentials: true }
      );
      if (res.data.success) {
         ToastSuccess(res.data.message);
        setAllPlaylists((prev) => [...prev, res.data.data]);
        setNewPlaylistName("");
      }
    } catch (err:any) {
       ToastError(err.response.data.error);
    }
  };

  return (
    <>
    <Toast/>
    <div className="fixed inset-0 bg-black/30 bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-zinc-900 p-5 rounded-xl w-[350px] relative max-h-[80vh] overflow-auto">
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-white cursor-pointer"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold text-white text-center mb-4">
          Add to Playlist
        </h2>
        <div className="flex flex-col gap-2">
          {allPlaylists.map((playlist) => (
            <div className="flex items-center justify-between cursor-pointer p-1 rounded-lg">
            <div
              key={playlist._id}
              className="  font-semibold p-1 text-white"
            >
              {playlist.name}
            </div>
            <div className="flex gap-1">
            <PlusSquare 
            className="text-green-500 hover:text-green-800"
            size={19}
            onClick={() => handleAddToPlaylist(playlist.id)}
            />
            <Trash 
            className="text-red-500 hover:text-red-900" 
            size={19}
             onClick={() => handleRemoveFromPlaylist(playlist.id)}
            />
            </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-zinc-700 pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Create new playlist
          </h3>
          <div className="flex gap-2">
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Button
              onClick={handleCreatePlaylist}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Playlist;
