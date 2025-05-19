import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  CodeXml,
  FlaskConical,
  History,
  Lightbulb,
  MessageSquare,
  RotateCw,
  Scan,
  XCircle,
  AlignLeft,
  Settings,
  SquareCheck,
  ChevronRight,
} from "lucide-react";

import axios from "axios";
import type { Problem } from "@/redux/slices/problem/problemTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MyEditor from "@/utils/MyEditor";
import { Button } from "@/components/ui/button";

// Difficulty Badge Component
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colorMap = {
    EASY: "bg-green-600",
    MEDIUM: "bg-yellow-600",
    HARD: "bg-red-600",
  };

  return (
    <span
      className={`${
        colorMap[difficulty as keyof typeof colorMap]
      } px-2 py-1 text-xs rounded-full font-medium`}
    >
      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
    </span>
  );
};

// Tag Component
const Tag = ({ name }: { name: string }) => {
  return (
    <span className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded-md mr-2">
      {name}
    </span>
  );
};

const ProblemPage = () => {
  const params = useParams();
  const { problemId } = params;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<
    "JAVASCRIPT" | "PYTHON" | "C++"
  >("JAVASCRIPT");
  const [activeTab, setActiveTab] = useState<string>("description");
  const [activeTestCase, setActiveTestCase] = useState<number>(1);
  const [testCases, setTestCases] = useState<
    { input: string; output: string }[]
  >([]);

  const [codeSnippet, setCodeSnippet] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/problem/${problemId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setProblem(res.data.data);
          setActiveTestCase(res.data.data.testcases.length);
          setTestCases(res.data.data.testcases);
          console.log("testcases: ", res.data.data.testcases);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);
  useEffect(() => {
    if (problem?.codeSnippets && problem.codeSnippets[selectedLang]) {
      const snippet = problem.codeSnippets[selectedLang] || "";
      setCodeSnippet(snippet);
      console.log("Code Snippet: ", snippet);
    }
  }, [selectedLang, problem]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <div className="text-white mt-4">Loading problem...</div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center">
          <XCircle className="mr-2" size={20} />
          Problem not found
        </div>
      </div>
    );
  }

  const selectedExample =
    problem.examples[selectedLang] || Object.values(problem.examples)[0];

  return (
    <div className=" min-h-screen text-white mt-2">
      {/* Main Content */}
      <div className="flex flex-row p-4 gap-2">
        {/* Left Panel */}
        <div className="bg-[#242222] w-1/2 h-[calc(100vh-90px)] rounded-lg flex flex-col shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-[#2d2d2d] border-b border-gray-700 flex space-x-1 px-2 py-1">
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "description"
                  ? "bg-[#3e3e3e] text-white"
                  : "text-gray-400 hover:bg-[#3e3e3e] hover:text-white"
              }`}
              onClick={() => setActiveTab("description")}
            >
              <AlignLeft size={16} className="mr-1.5" />
              Description
            </button>
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "hints"
                  ? "bg-[#3e3e3e] text-white"
                  : "text-gray-400 hover:bg-[#3e3e3e] hover:text-white"
              }`}
              onClick={() => setActiveTab("hints")}
            >
              <Lightbulb size={16} className="mr-1.5" />
              Hints
            </button>
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "solution"
                  ? "bg-[#3e3e3e] text-white"
                  : "text-gray-400 hover:bg-[#3e3e3e] hover:text-white"
              }`}
              onClick={() => setActiveTab("solution")}
            >
              <FlaskConical size={16} className="mr-1.5" />
              Solution
            </button>
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "editorial"
                  ? "bg-[#3e3e3e] text-white"
                  : "text-gray-400 hover:bg-[#3e3e3e] hover:text-white"
              }`}
              onClick={() => setActiveTab("editorial")}
            >
              <BookOpen size={16} className="mr-1.5" />
              Editorial
            </button>
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "submissions"
                  ? "bg-[#3e3e3e] text-white"
                  : "text-gray-400 hover:bg-[#3e3e3e] hover:text-white"
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              <History size={16} className="mr-1.5" />
              Submissions
            </button>
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "discussion"
                  ? "bg-[#3e3e3e] text-white"
                  : "text-gray-400 hover:bg-[#3e3e3e] hover:text-white"
              }`}
              onClick={() => setActiveTab("discussion")}
            >
              <MessageSquare size={16} className="mr-1.5" />
              Discussion
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "description" && (
              <div>
                {/* Problem Metadata */}
                <h1 className="text-xl font-medium">{problem.title}</h1>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  {problem.tags.map((tag, index) => (
                    <Tag key={index} name={tag} />
                  ))}
                </div>

                {/* Problem Description */}
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                {/* Constraints */}
                <div className="mb-6">
                  <h3 className="text-gray-200 font-medium mb-2">
                    Constraints:
                  </h3>
                  <div className="bg-[#2d2d2d] p-3 rounded-md text-gray-300 font-mono text-sm">
                    {problem.constraints}
                  </div>
                </div>

                {/* Examples */}
                {selectedExample && (
                  <div className="mb-6">
                    <h3 className="text-gray-200 font-medium mb-2">Example:</h3>
                    <div className="bg-[#2d2d2d] p-3 rounded-md mb-3">
                      <div className="mb-2">
                        <span className="text-gray-50 font-medium">
                          Input:{" "}
                        </span>
                        <code className="text-gray-400 font-mono">
                          {selectedExample.input}
                        </code>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-50 font-medium">
                          Output:{" "}
                        </span>
                        <code className="text-gray-400 font-mono">
                          {selectedExample.output}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-50 font-medium">
                          Explanation:{" "}
                        </span>
                        <span className="text-gray-400">
                          {selectedExample.explanation}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div>
                {problem.hints ? (
                  <div>
                    <h3 className="text-xl font-medium mb-4">Hints</h3>
                    <div className="space-y-4">
                      {problem.hints.split(",").map((hint, index) => (
                        <div
                          key={index}
                          className="bg-[#2d2d2d] p-4 rounded-md"
                        >
                          <h4 className="text-md font-medium text-blue-400 mb-2">
                            Hint {index + 1}
                          </h4>
                          <p className="text-gray-300">{hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Lightbulb size={48} className="mb-4 opacity-50" />
                    <p>No hints available for this problem.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "editorial" && (
              <div>
                {problem.editorial ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: problem.editorial }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <BookOpen size={48} className="mb-4 opacity-50" />
                    <p>No editorial available yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "solution" && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FlaskConical size={48} className="mb-4 opacity-50" />
                <p>
                  Solution content will be available after you solve the
                  problem.
                </p>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <History size={48} className="mb-4 opacity-50" />
                <p>No submissions yet.</p>
              </div>
            )}

            {activeTab === "discussion" && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare size={48} className="mb-4 opacity-50" />
                <p>Join the discussion about this problem.</p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Add Comment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor and Results */}
        <div className=" w-1/2 h-[calc(100vh-90px)] rounded-lg flex flex-col shadow-lg overflow-hidden bg-[#1e1e1e]">
          {/* Tab Navigation */}
          <div className="bg-[#2d2d2d] border-b border-gray-700 flex px-2 py-1">
            <div className="flex-1 flex items-center">
              <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-[#3e3e3e] text-white rounded-md">
                <CodeXml size={16} className="mr-1.5" />
                Code
              </button>
            </div>
            <div className="flex items-center">
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded-md">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Editor Controls */}
          <div className="flex justify-between items-center p-2 ">
            <div className="relative">
              {/* Language dropdown would go here */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex cursor-pointer focus:outline-none focus-visible:outline-none hover:bg-[#464242] px-2 py-1 rounded-md text-sm text-white">
                  {selectedLang} <ChevronDown size={18} className="ml-1 mt-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="px-3 py-1 mt-2 text-gray-200 bg-[#3f3b3b] rounded-md shadow-md">
                  {["JAVASCRIPT", "PYTHON", "C++"].map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onSelect={() =>
                        setSelectedLang(lang as "JAVASCRIPT" | "PYTHON" | "C++")
                      }
                      className="cursor-pointer hover:bg-[#555] px-2 py-1 rounded"
                    >
                      {lang}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded-md">
                <Scan size={16} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded-md">
                <RotateCw size={16} />
              </button>
            </div>
          </div>

          <div className="h-[320px]">
            {codeSnippet.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <RotateCw size={48} className="mb-4 opacity-50 animate-spin" />
                <p>Loading code editor...</p>
              </div>
            ) : (
              <MyEditor codeSnippet={codeSnippet} language={selectedLang} />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end p-1 mr-1">
              <Button className="bg-[#343131] h-8 hover:bg-[#464242] cursor-pointer text-white  rounded-md mr-2 text-sm font-semibold">
                Run
              </Button>
              <Button className="bg-green-500 h-8 hover:bg-green-700 cursor-pointer text-white rounded-md text-sm font-semibold">
                Submit
              </Button>
            </div>
          </div>

          <div className=" bg-[#2e2e2d] h-[300px] -mt-4 rounded-b-md shadow-inner">
            {/* Header Section */}
            <div className=" px-4 py-2 flex items-center justify-between">
              <div className="text-base font-medium  flex items-center space-x-2">
                <span className="text-gray-300 flex">
                  <SquareCheck className="text-green-500 mt-[3px] mr-1" size={20} />
                  Testcase
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-300 flex">
                  <ChevronRight className="inline-block text-green-500 mt-[3px] mr-1" size={20} />
                  Test Result
                  </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-4 py-1 space-x-2 bg-[#212121] mt-1 ">
              {testCases.map((_, index) => (
                <Button
                  key={index}
                  className={` h-9  text-base font-semibold rounded-md ${
                    activeTestCase === index + 1
                      ? "bg-[#3e3e3e] text-white hover:bg-[#3e3e3e]"
                      : "text-gray-400 bg-transparent hover:bg-[#3e3e3e]"
                  }`}
                  onClick={() => setActiveTestCase(index + 1)}
                >
                  Case {index + 1}
                </Button>
              ))}
              <button className="px-2 py-1 text-gray-400 hover:bg-[#3e3e3e] rounded-md">
                +
              </button>
            </div>

            {/* Inputs */}
            <div className="px-4 py-3 bg-[#212121] overflow-y-auto h-full space-y-4">
              {testCases.length > 0 && (
                <>
                  {/* Input Display */}
                  <div>
                    <label className="text-sm text-gray-400 font-semibold mb-1 block">
                      nums =
                    </label>
                    <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-base w-full">
                      {testCases[activeTestCase - 1]?.input || ""}
                    </div>
                  </div>

                  {/* Output Display */}
                  <div>
                    <label className="text-sm text-gray-400 font-semibold mb-1 block">
                      target =
                    </label>
                    <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-base w-full">
                      {testCases[activeTestCase - 1]?.output || ""}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
