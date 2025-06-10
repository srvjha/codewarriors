import React, { useEffect, useRef, useState } from "react";
import { X, Search, Plus } from "lucide-react";
import type { Playlist, Problem } from "@/types/problem/problemTypes";
import API from "@/utils/AxiosInstance";
import { Input } from "./Input";
import { debounce } from "@/utils/debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ToastError, ToastSuccess } from "@/utils/ToastContainers";

interface AddProblemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName?: string;
  playlistId?: string;
}

const difficultyColor = {
  EASY: "text-green-500",
  MEDIUM: "text-yellow-500",
  HARD: "text-red-500",
};

const AddProblemsModal: React.FC<AddProblemsModalProps> = ({
  isOpen,
  onClose,
  playlistName = "My Playlist",
  playlistId,
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [playlistProblems, setPlaylistProblems] = useState<Playlist>();
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const searchRef =
    useRef<(event: React.ChangeEvent<HTMLInputElement>) => void | null>(null);

  useEffect(() => {
    if (!isOpen || !playlistId) return;

    const fetchData = async () => {
      try {
        const allProblemsRes = await API.get("/problem/all-problems", {
          withCredentials: true,
        });
        setProblems(allProblemsRes.data.data || []);
        setFilteredProblems(allProblemsRes.data.data || []);

        const playlistRes = await API.get(`/playlist/${playlistId}`, {
          withCredentials: true,
        });
        setPlaylistProblems(playlistRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load problems:", err);
      }
    };

    fetchData();
  }, [isOpen, playlistId]);

  useEffect(() => {
    searchRef.current = debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        const filtered = problems.filter((problem) =>
          problem.title.toLowerCase().includes(query)
        );
        setFilteredProblems(filtered);
      },
      1000
    );
  }, [problems]);

  const handleAddProblem = async (problemId: string) => {
    try {
      const res = await API.post(
        `/playlist/${playlistId}/problem/${problemId}/add`,
        {},
        { withCredentials: true }
      );
      // console.log("res: ", res);
      if (res.status) {
        isProblemAdded(problemId);
        ToastSuccess(res.data.message);
      }
    } catch (err: any) {
      console.error("Failed to add problem:", err);
      ToastError(err.response.data.error);
    }
  };

  const isProblemAdded = (problemId: string) => {
    return playlistProblems?.problems.some((p) => p.problem.id === problemId);
  };

  const handleProblemSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current(event);
    }
  };

  if (!isOpen) return null;

  const handleRemoveProblem = async (problemId: string) => {
    try {
      const res = await API.delete(
        `/playlist/${playlistId}/problem/${problemId}/remove`,
        { withCredentials: true }
      );
      if (res.status) {
        setPlaylistProblems((prev) =>
          prev
            ? {
                ...prev,
                problems: prev.problems.filter(
                  (p) => p.problem.id !== problemId
                ),
              }
            : prev
        );
        ToastSuccess("Problem removed from playlist");
      }
    } catch (err: any) {
      console.error("Failed to remove problem:", err);
      ToastError(err.response?.data?.error || "Failed to remove problem.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col border border-zinc-800">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Add Problems</h2>
            <p className="text-sm text-gray-400 mt-1">
              Add problems to "{playlistName}"
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-zinc-800">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search questions"
                className="pl-8 bg-zinc-900 text-white border-zinc-700"
                onChange={handleProblemSearch}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-zinc-800 text-white border-zinc-700"
                >
                  {selectedDifficulty === "ALL"
                    ? "All Difficulties"
                    : selectedDifficulty.charAt(0) +
                      selectedDifficulty.slice(1).toLowerCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 text-white border border-zinc-700">
                {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                  <DropdownMenuItem
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`hover:bg-zinc-700 cursor-pointer ${
                      selectedDifficulty === diff ? "font-semibold" : ""
                    }`}
                  >
                    {diff === "ALL"
                      ? "All Difficulties"
                      : diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredProblems
            .filter((problem) => {
              if (selectedDifficulty === "ALL") return true;
              return problem.difficulty === selectedDifficulty;
            })
            .map((problem, index) => {
              const added = isProblemAdded(problem.id);

              return (
                <div
                  key={problem.id}
                  className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-medium">
                        {index + 1}. {problem.title}
                      </h3>
                      <span
                        className={`text-sm font-semibold ${
                          difficultyColor[problem.difficulty]
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      {problem.description.length > 100
                        ? problem.description.slice(0, 100) + "..."
                        : problem.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-zinc-700 text-xs text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {added ? (
                    <button
                      onClick={() => handleRemoveProblem(problem.id)}
                      className="mt-2 px-2 py-2 rounded-lg bg-red-600/60 hover:bg-red-600/70 cursor-pointer text-white font-medium transition"
                    >
                      <div className="flex items-center gap-1">
                        <X size={16} />
                        Remove
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddProblem(problem.id)}
                      className="mt-2 px-4 py-2 rounded-lg cursor-pointer bg-blue-600/70 hover:bg-blue-600/80 text-white font-medium transition"
                    >
                      <div className="flex items-center gap-1">
                        <Plus size={16} />
                        Add
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        <div className="p-6 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProblemsModal;
