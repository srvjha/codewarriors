import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Search, Filter, CirclePlus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { debounce } from "@/utils/debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/components/ui/Spinner";

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  isSolved: boolean;
};

const difficultyColor: Record<Problem["difficulty"], string> = {
  EASY: "text-green-500",
  MEDIUM: "text-yellow-500",
  HARD: "text-red-500",
};

const ProblemsetPage = () => {
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [visibleProblems, setVisibleProblems] = useState<Problem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state: RootState) => state.auth);
  const problemsPerPage = 10;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/problem/all-problems",
          { withCredentials: true }
        );
        const data: Problem[] = res.data.data;

        setAllProblems(data);
        setFilteredProblems(data);
        setVisibleProblems(data.slice(0, problemsPerPage));
        setHasMore(data.length > problemsPerPage);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const fetchSolvedStatus = async (problems: Problem[]) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/problem/solved/all-problems",
        { withCredentials: true }
      );

      const solvedIds = response.data.data;

      return problems.map((problem) => ({
        ...problem,
        isSolved: solvedIds.some((solved: Problem) => solved.id === problem.id),
      }));
    } catch (error) {
      console.error("Failed to fetch solved problems:", error);
      return problems.map((p) => ({ ...p, isSolved: false }));
    }
  };

  const fetchMoreData = async () => {
    if (visibleProblems.length >= filteredProblems.length) {
      setHasMore(false);
      return;
    }

    const nextProblems = filteredProblems.slice(
      visibleProblems.length,
      visibleProblems.length + problemsPerPage
    );

    const updatedNext = await fetchSolvedStatus(nextProblems);
    setVisibleProblems((prev) => [...prev, ...updatedNext]);
  };

  useEffect(() => {
    const initializeSolvedStatus = async () => {
      const updated = await fetchSolvedStatus(filteredProblems.slice(0, problemsPerPage));
      setVisibleProblems(updated);
    };
    initializeSolvedStatus();
  }, [filteredProblems]);

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

  const searchRef = useRef<(event: React.ChangeEvent<HTMLInputElement>) => void | null>(null);

  useEffect(() => {
    searchRef.current = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value.toLowerCase();
      const filtered = allProblems.filter((problem) =>
        problem.title.toLowerCase().includes(query)
      );
      setFilteredProblems(filtered);
      setVisibleProblems([]);
      setHasMore(filtered.length > problemsPerPage);
    }, 1000);
  }, [allProblems]);

  const handleProblemSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current(event);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview Problem Set</h1>
          <p className="text-gray-400 text-sm mt-1">
            Curated problems across categories for interviews and challenges.
          </p>
        </div>
        {userData?.role === "ADMIN" && (
          <Link to="/create/problem">
            <Button variant="primary">
              Create Problem <CirclePlus className="ml-2" />
            </Button>
          </Link>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {topicList.map((topic) => (
          <Badge
            key={topic.label}
            className="text-sm px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700"
          >
            {topic.label} <span className="ml-1 text-gray-400">({topic.count})</span>
          </Badge>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <Input
            placeholder="Search questions"
            className="pl-8 bg-zinc-900 text-white border-zinc-700"
            onChange={handleProblemSearch}
          />
        </div>
        <Button variant="outline" className="bg-zinc-800 text-white border-zinc-900">
          <Filter className="mr-2" size={16} /> Filter
        </Button>
      </div>

      {/* Infinite Scroll */}
      {loading ? (
        <p className="text-gray-400">Loading problems...</p>
      ) : visibleProblems.length === 0 ? (
        <p className="text-gray-400">No problems found.</p>
      ) : (
        <InfiniteScroll
          dataLength={visibleProblems.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className="text-white text-center"><Spinner className="mt-6"/></h4>}
          endMessage={
            <p className="mt-6 text-center text-lg font-semibold text-zinc-200">
              Yay! You have seen it all
            </p>
          }
        >
          <div className="space-y-2">
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
                  <span
                    className={`text-sm font-semibold ${difficultyColor[problem.difficulty]}`}
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
