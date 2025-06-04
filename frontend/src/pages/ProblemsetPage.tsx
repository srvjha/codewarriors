import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Search, Filter, CirclePlus, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { debounce } from "@/utils/debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/components/ui/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import Playlist from "@/components/ui/Playlist";
import { difficultyColor } from "@/helper/Problem.helper";
import API from "@/utils/AxiosInstance";
// import {useCollapse} from "react-collapsed"
type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  isSolved: boolean;
};

const problemsPerPage = 10;

const ProblemsetPage = () => {
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [visibleProblems, setVisibleProblems] = useState<Problem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [addProblem, setAddProblem] = useState("");
  // const [isExpanded, setExpanded] = useState(false);
  // const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  const searchRef =
    useRef<(event: React.ChangeEvent<HTMLInputElement>) => void | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get("/problem/all-problems", {
          withCredentials: true,
        });
        const data: Problem[] = res.data.data;

        const solvedRes = await API.get("/problem/solved/all-problems", {
          withCredentials: true,
        });
        const solvedIds = solvedRes.data.data.map((p: Problem) => p.id);

        const updated = data.map((problem) => ({
          ...problem,
          isSolved: solvedIds.includes(problem.id),
        }));

        setAllProblems(updated);
        setFilteredProblems(updated);
        setVisibleProblems(updated.slice(0, problemsPerPage));
        setHasMore(updated.length > problemsPerPage);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const fetchMoreData = () => {
    const next = filteredProblems.slice(
      visibleProblems.length,
      visibleProblems.length + problemsPerPage
    );

    setVisibleProblems((prev) => [...prev, ...next]);
    setHasMore(visibleProblems.length + next.length < filteredProblems.length);
  };

  const tagCounts: Record<string, number> = {};
  allProblems.forEach((problem) => {
    problem.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const totalCount = allProblems.length;
  const topicList = [
    { label: "All Topics", count: totalCount },
    ...Object.entries(tagCounts).map(([tag, count]) => ({ label: tag, count })),
  ];

  useEffect(() => {
    searchRef.current = debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        const filtered = allProblems.filter((problem) =>
          problem.title.toLowerCase().includes(query)
        );
        setFilteredProblems(filtered);
        setVisibleProblems(filtered.slice(0, problemsPerPage));
        setHasMore(filtered.length > problemsPerPage);
      },
      1000
    );
  }, [allProblems]);

  const handleProblemSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current(event);
    }
  };

  const handleSortClick = (value: string) => {
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    let sortedProblems: Problem[] = [...filteredProblems];

    const clicked = value.toUpperCase();

    if (difficulties.includes(clicked)) {
      const startIndex = difficulties.indexOf(clicked);
      const reordered = [
        ...difficulties.slice(startIndex),
        ...difficulties.slice(0, startIndex),
      ];

      sortedProblems.sort(
        (a, b) =>
          reordered.indexOf(a.difficulty.toUpperCase()) -
          reordered.indexOf(b.difficulty.toUpperCase())
      );

      setActive(false);
    } else if (value === "all" && !active) {
      setActive(true);
      sortedProblems = [...allProblems];
    }

    setFilteredProblems(sortedProblems);
    setVisibleProblems(sortedProblems.slice(0, problemsPerPage));
    setHasMore(sortedProblems.length > problemsPerPage);
  };

  const handleLabelBasedSearch = (tag: string) => {
    let tagBasedData = allProblems;
    if (tag !== "All Topics") {
      tagBasedData = allProblems.filter((problem) =>
        problem.tags.includes(tag)
      );
    }

    setFilteredProblems(tagBasedData);
    setVisibleProblems(tagBasedData.slice(0, problemsPerPage));
    setHasMore(tagBasedData.length > problemsPerPage);
  };

  const handleAddPlaylist = (problemId: string) => {
    setAddProblem(problemId);
    setShowPlaylist(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Interview Problem Set
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Curated problems across categories for interviews and challenges.
          </p>
        </div>
        {userData?.role === "ADMIN" && (
          <Link to="/create/problem">
            <Button variant="secondary" className="text-sm mr-2 cursor-pointer">
              Create Problem <CirclePlus />
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {topicList.map((topic) => (
          <Badge
            key={topic.label}
            className="text-sm px-3 py-1 cursor-pointer bg-zinc-800 text-white hover:bg-zinc-700"
            onClick={() => handleLabelBasedSearch(topic.label)}
          >
            {topic.label}{" "}
            <span className="ml-1 text-gray-400">({topic.count})</span>
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
              className="bg-zinc-800 text-white border-zinc-900"
            >
              <Filter className="mr-2" size={16} /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 text-left px-2  bg-zinc-800 text-zinc-100 border-none">
            <DropdownMenuSub>
              {!active ? (
                <DropdownMenuItem onClick={() => handleSortClick("all")}>
                  All Problems
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>All Problems</DropdownMenuItem>
              )}
              <DropdownMenuSubTrigger className="text-zinc-100 hover:bg-zinc-100 hover:text-zinc-800 hover:rounded-lg p-1.5 ">
                Sort By Difficulty
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-zinc-800 text-zinc-100 border-none p-2 rounded-lg">
                <DropdownMenuItem
                  className="hover:bg-zinc-700 text-green-500"
                  onClick={() => handleSortClick("Easy")}
                >
                  Easy
                </DropdownMenuItem>
                <hr className="border-gray-700 my-1" />
                <DropdownMenuItem
                  className="hover:bg-zinc-700 text-yellow-500"
                  onClick={() => handleSortClick("Medium")}
                >
                  Medium
                </DropdownMenuItem>
                <hr className="border-gray-700 my-1" />
                <DropdownMenuItem
                  className="hover:bg-zinc-700 text-red-600"
                  onClick={() => handleSortClick("Hard")}
                >
                  Hard
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading problems...</p>
      ) : visibleProblems.length === 0 ? (
        <p className="text-gray-400">No problems found.</p>
      ) : (
        <InfiniteScroll
          dataLength={visibleProblems.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <h4 className="text-white text-center">
              <Spinner className="mt-6" />
            </h4>
          }
          endMessage={
            <p className="mt-6 text-center text-lg font-semibold text-zinc-200">
              Yay! You have seen it all
            </p>
          }
        >
          <div className="space-y-2">
            {showPlaylist && (
              <Playlist
                problemId={addProblem}
                onClose={() => {
                  setShowPlaylist(false);
                  setAddProblem("");
                }}
              />
            )}

            {visibleProblems.map((problem, index) => (
              <Card
                key={problem.id}
                className="p-4 w-full flex items-center justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 cursor-pointer"
              >
                <Link to={`/problem/${problem.id}`}>
                  <div className="flex flex-row">
                    {problem.isSolved ? (
                      <CheckCircle className="mt-2 mr-3 text-green-500" />
                    ) : (
                      <div className="mr-9"></div>
                    )}
                    <div className="text-white font-medium flex flex-col">
                      <span className="problemtitle">
                        {index + 1}. {problem.title}
                      </span>
                      <span className="text-sm text-gray-400">
                        {problem.description.length > 80
                          ? problem.description.slice(0, 80) + "..."
                          : problem.description}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-4 px-1 py-1 mr-4">
                  <Star
                    size={22}
                    className="mt-1 text-zinc-600 hover:text-yellow-600"
                    onClick={() => handleAddPlaylist(problem.id)}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      difficultyColor[problem.difficulty]
                    }`}
                  >
                    {problem.difficulty.length > 4
                      ? `${problem.difficulty.slice(0, 3)}.`
                      : problem.difficulty}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ProblemsetPage;
