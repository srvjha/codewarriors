import { Card } from "@/components/ui/Card";
import { difficultyColor } from "@/helper/Problem.helper";
import type { Playlist } from "@/types/problem/problemTypes";
import API from "@/utils/AxiosInstance";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { List, Target, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);

  const allPlaylistsDetails = async () => {
    try {
      const response = await API.get(
        "/playlist/all",
        { withCredentials: true }
      );
      setPlaylists(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }
  };

  useEffect(() => {
    allPlaylistsDetails();
  }, []);

  const selectedPlaylist = playlists[selectedPlaylistIndex];

  const handleRemoveFromPlaylist = async (
    playlistId: string,
    problemId: string
  ) => {
    try {
      const res = await API.delete(
        `/playlist/${playlistId}/problem/${problemId}/remove`,
        { withCredentials: true }
      );
      console.log(res);
      if (res.data.success) {
        ToastSuccess(res.data.message);
        await allPlaylistsDetails();
      }
    } catch (err: any) {
      ToastError(err.response.data.error);
    }
  };

  const handleRemovePlaylist = async(playListId:string) => {
    try{
    const res = await API.delete(`/playlist/${playListId}`,{
        withCredentials:true
    })
    if (res.data.success) {
        ToastSuccess(res.data.message);
        await allPlaylistsDetails();
      }
    } catch (err: any) {
      ToastError(err.response.data.error);
    }
  };

  return (
    <>
      <Toast />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className=" min-h-[calc(100vh-100px)] flex gap-4">
          {/* Left: List Deatils */}
          <div className="w-[350px] bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-900 px-4 py-3 rounded-lg shadow-md shadow-blue-500">
            <p className="text-xl font-semibold text-neutral-100 mb-4 flex items-center">
              <List className="mr-2" />
              Playlists
            </p>
            <div className="space-y-3">
              {playlists.map((playlist, index) => (
                <Card
                  key={playlist.id}
                  onClick={() => setSelectedPlaylistIndex(index)}
                  className={`p-4 w-full border-none rounded-lg flex justify-between cursor-pointer text-neutral-100 shadow-lg shadow-neutral-950 bg-zinc-800 font-semibold ${
                    selectedPlaylistIndex === index
                      ? "bg-zinc-700 "
                      : "hover:bg-zinc-800 "
                  }`}
                >
                  {playlist.name}
                  <Trash
                    size={16}
                    className="cursor-pointer mt-0.5 text-red-400 hover:text-red-900"
                    onClick={() => handleRemovePlaylist(playlist.id)}
                  />
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Problems in List*/}
          <div className="flex-1 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-900 px-6 py-4 rounded-lg shadow-md shadow-blue-500">
            <p className="text-xl font-semibold text-white mb-4 flex">
              {selectedPlaylist?.name} Problems{" "}
              <Target className="mt-1.5 ml-2" size={18} />
            </p>
            {selectedPlaylist?.problems?.length > 0 ? (
              <div className="space-y-4">
                {selectedPlaylist.problems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 w-full cursor-pointer border-none shadow-lg shadow-neutral-950 bg-zinc-800 rounded-md flex justify-between items-center text-white"
                  >
                    <Link to={`/problem/${item.problem.id}`}>
                      <span>{item.problem.title}</span>
                    </Link>
                    <div className="flex items-center gap-4 px-1 py-1 mr-4">
                      <span
                        className={`text-sm font-semibold ${
                          difficultyColor[item.problem.difficulty]
                        }`}
                      >
                        {item.problem.difficulty.length > 4
                          ? `${item.problem.difficulty.slice(0, 3)}.`
                          : item.problem.difficulty}
                      </span>
                      <span>
                        <Trash
                          size={16}
                          className="cursor-pointer text-red-400 hover:text-red-900"
                          onClick={() =>
                            handleRemoveFromPlaylist(
                              item.playListId,
                              item.problem.id
                            )
                          }
                        />
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No problems in this playlist yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistPage;
