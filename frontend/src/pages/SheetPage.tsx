import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "@/utils/AxiosInstance";
import { Play, Trash } from "lucide-react";
import type { Playlist } from "@/types/problem/problemTypes";
import { difficultyColor } from "@/helper/Problem.helper";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const SheetPage = () => {
  const { id: playlistId} = useParams();
  const {userData} = useSelector((state:RootState)=>state.auth)
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const fetchPlaylist = async () => {
    try {
      const res = await API.get(`/playlist/${playlistId}`, {
        withCredentials: true,
      });
      // console.log("res: ", res);
      setPlaylist(res.data?.data);
    } catch (err) {
      console.error("Failed to fetch playlist:", err);
    }
  };

  const handleDelete = async (problemId: string) => {
    try {
      await API.delete(
        `/playlist/${playlistId}/problem/${problemId}/remove`,
        { withCredentials: true }
      );
      fetchPlaylist();
    } catch (err) {
      console.error("Failed to delete problem:", err);
    }
  };

  useEffect(() => {
    if (playlistId) fetchPlaylist();
  }, [playlistId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">
        {playlist?.name || "Loading..."}
      </h1>
      <p className="text-gray-400 mb-8">{playlist?.description}</p>

      <div className="space-y-6">
        {playlist?.problems?.map((p, index) => {
          const { problem } = p;
          return (
            <div
              key={p.id}
              className="border border-zinc-700 p-4 rounded-xl bg-zinc-900 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-lg font-semibold mr-2">
                    {index + 1}. {problem.title}
                  </h2>
                  <Badge
                    className={`${
                      difficultyColor[problem.difficulty]
                    } bg-neutral-50 font-semibold`}
                  >
                    {problem.difficulty}
                  </Badge>
                  {problem.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-zinc-700 text-gray-300 font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-gray-400 mb-2">
                  {problem.description.length > 150
                    ? problem.description.slice(0, 150) + "..."
                    : problem.description}
                </p>
              </div>

              <div className="flex flex-row gap-2 ml-4 mt-6">
                <div className="flex items-center gap-4 ml-4">
                  <Link
                    to={`/problem/${problem.id}`}
                    className="text-green-400 hover:text-green-400"
                  >
                    <Play className="w-5 h-5" />
                  </Link>
                 
                 {userData?.role ==="ADMIN" && (
                   <button
                    onClick={() => handleDelete(problem.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                 )}
                 
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SheetPage;
