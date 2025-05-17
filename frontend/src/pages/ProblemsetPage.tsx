import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Search, Filter } from "lucide-react";

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  successRate?: number; // Optional if your backend sends this
};

const difficultyColor: Record<Problem["difficulty"], string> = {
  EASY: "text-green-500",
  MEDIUM: "text-yellow-500",
  HARD: "text-red-500",
};

const ProblemsetPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/problem/all-problems",
          {
            withCredentials: true,
          }
        );
        setProblems(res.data.data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Count tags
  const tagCounts: Record<string, number> = {};
  problems.forEach((problem) => {
    problem.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const totalCount = problems.length;
  const topicList = [
    { label: "All Topics", count: totalCount },
    ...Object.entries(tagCounts).map(([tag, count]) => ({ label: tag, count })),
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Interview Problem Set
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Curated problems across categories for interviews and challenges.
          </p>
        </div>
        <Button variant="primary">Create Problem</Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {topicList.map((topic) => (
          <Badge
            key={topic.label}
            className="text-sm px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700"
          >
            {topic.label}{" "}
            <span className="ml-1 text-gray-400">({topic.count})</span>
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
          />
        </div>
        <Button
          variant="outline"
          className="bg-zinc-800 text-white border-zinc-700"
        >
          <Filter className="mr-2" size={16} /> Filter
        </Button>
      </div>

      {/* Problem List */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-400">Loading problems...</p>
        ) : (
          problems.map((problem, index) => (
            <Card
              key={problem.id}
              className="p-4 w-full flex items-center justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 cursor-pointer"
            >
              <div className="text-white font-medium flex flex-col">
                <span>
                  {index + 1}. {problem.title}
                </span>
               
                <span className="text-sm text-gray-400">
                  {problem.description.length > 80
                    ? problem.description.slice(0, 80) + "..."
                    : problem.description}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-semibold ${
                    difficultyColor[problem.difficulty]
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemsetPage;
