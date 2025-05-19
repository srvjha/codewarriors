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
  XOctagon,
  CheckCircle,
  Clock,
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
   const [isRunning, setIsRunning] = useState(false);
  type TestCaseResultType = {
    testCase: number | string;
    passed: boolean;
    time: string;
    memory: string;
    [key: string]: any;
  };

  type ResultType = {
    status: string;
    stderr?: string;
    [key: string]: any;
  };
  const [results, setResults] = useState<ResultType | null>(null);
  const [activeResultTab, setActiveResultTab] = useState("testcase"); 

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

    const type = "run"
    
    const handleRunCode = async () => {
      setIsRunning(true);
      let payload = {
            source_code: codeSnippet,
            language: selectedLang,
           
          }
      try {
        const res = await axios.post(
          `http://localhost:3000/api/v1/execute/code/${problemId}/${type}`,
          JSON.stringify(payload),
          {
            withCredentials: true,
         
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.success) {
          console.log("Code executed successfully:", res.data.data);
          setResults(res.data.data);
        setActiveResultTab("result");
        }
      } catch (error: any) {
        console.error("Error executing code:", error);
       setResults({
        status: "Error",
        stderr: error.message || "An error occurred during execution"
      });
      setActiveResultTab("result");
    } finally {
      setIsRunning(false);
    }
    };
     
    const handleCodeUpdate = (newCode: string) => {
      setCodeSnippet(newCode);
    };


  const formatRuntime = (timeStr: string) => {
    if (!timeStr || timeStr === "false") return "0 ms";
    // Convert "0.123s" to "123 ms"
    if (timeStr.includes("s")) {
      const seconds = parseFloat(timeStr.replace("s", ""));
      return `${Math.round(seconds * 1000)} ms`;
    }
    return timeStr;
  };

  // Result status indicator component
  const StatusIndicator = ({ status }:{status: string}) => {
    if (status === "Accepted") {
      return (
        <div className="flex items-center text-green-500 font-medium">
          <CheckCircle size={18} className="mr-2" />
          Accepted
        </div>
      );
    } else if (status === "Wrong Answer") {
      return (
        <div className="flex items-center text-red-500 font-medium">
          <XOctagon size={18} className="mr-2" />
          Wrong Answer
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-yellow-500 font-medium">
          <XCircle size={18} className="mr-2" />
          {status || "Error"}
        </div>
      );
    }
  };
  return (
    <div className=" text-white -mt-2 ">
      {/* Main Content */}
      <div className="flex flex-row p-4 gap-2">
        {/* Left Panel */}
        <div className="bg-[#242222] w-1/2 h-[calc(100vh-80px)] rounded-lg flex flex-col shadow-lg overflow-hidden">
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
        <div className=" w-1/2 h-[calc(100vh-80px)] rounded-lg flex flex-col shadow-lg overflow-hidden bg-[#1e1e1e]">
          {/* Tab Navigation */}
          <div className="bg-[#2d2d2d] border-b border-gray-700 flex px-2 py-1">
            <div className="flex-1 flex items-center">
              <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-[#3e3e3e] text-white rounded-md">
                <CodeXml size={16} className="mr-1.5 text-green-500" />
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
                <DropdownMenuTrigger className="flex text-gray-300 cursor-pointer focus:outline-none focus-visible:outline-none hover:bg-[#464242] px-2 py-1 rounded-md text-sm ">
                  {selectedLang.charAt(0).toUpperCase() + selectedLang.toLowerCase().slice(1)} <ChevronDown size={18} className="ml-1 mt-[3px]" />
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
              <MyEditor 
              codeSnippet={codeSnippet} 
              language={selectedLang}
              onCodeChange={handleCodeUpdate}
               />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end p-1 mr-1">
              <Button 
              className="bg-[#343131] h-8 hover:bg-[#464242] cursor-pointer text-white  rounded-md mr-2 text-sm font-semibold"
              onClick = {handleRunCode}
              >
               {isRunning ? "Running..." : "Run"}
              </Button>
              <Button className="bg-green-500 h-8 hover:bg-green-700 cursor-pointer text-white rounded-md text-sm font-semibold">
                Submit
              </Button>
            </div>
          </div>

          <div className="bg-[#2e2e2d] h-[300px] -mt-4 rounded-b-md shadow-inner flex flex-col">
  {/* Header Section */}
  <div className="px-4 py-2 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
    <div className="text-base font-medium flex items-center space-x-2">
      <button 
        className={`flex items-center px-3 py-1 rounded ${
          activeResultTab === "testcase" 
            ? "text-green-500 border-b-2 border-green-500" 
            : "text-gray-300 hover:text-white"
        }`}
        onClick={() => setActiveResultTab("testcase")}
      >
        <SquareCheck className="mr-2" size={20} />
        Testcase
      </button>
      <span className="text-gray-500">|</span>
      <button 
        className={`flex items-center px-3 py-1 rounded ${
          activeResultTab === "result" 
            ? "text-green-500 border-b-2 border-green-500" 
            : "text-gray-300 hover:text-white"
        }`}
        onClick={() => setActiveResultTab("result")}
        disabled={isRunning}
      >
        <ChevronRight className="mr-2" size={20} />
        {isRunning ? (
          <span className="flex items-center">
            Test Result <RotateCw className="ml-2 animate-spin" size={14} />
          </span>
        ) : (
          "Test Result"
        )}
      </button>
    </div>
  </div>

  {/* Content area with proper scrolling */}
  <div className="flex-1 overflow-hidden">
    {/* Testcase Tab */}
    {activeResultTab === "testcase" && (
      <div className="h-full overflow-y-auto px-4 py-3 bg-[#212121]">
        {/* Test case tabs */}
        <div className="flex items-center space-x-2 mb-3 sticky top-0 bg-[#212121] z-10 pb-2">
          {testCases.map((_, index) => (
            <button
              key={index}
              className={`h-8 px-3 text-sm font-medium rounded-md ${
                activeTestCase === index + 1
                  ? "bg-[#3e3e3e] text-white hover:bg-[#3e3e3e]"
                  : "text-gray-400 bg-transparent hover:bg-[#3e3e3e]"
              }`}
              onClick={() => setActiveTestCase(index + 1)}
            >
              Case {index + 1}
            </button>
          ))}
          <button className="px-2 py-1 text-gray-400 hover:bg-[#3e3e3e] rounded-md">
            +
          </button>
        </div>

        {testCases.length > 0 && (
          <div className="space-y-4">
            {/* Input Display */}
            <div>
              <label className="text-sm text-gray-400 font-semibold mb-1 block">
                Input
              </label>
              <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-sm w-full font-mono">
                {testCases[activeTestCase - 1]?.input || ""}
              </div>
            </div>

            {/* Output Display */}
            <div>
              <label className="text-sm text-gray-400 font-semibold mb-1 block">
                Output
              </label>
              <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-sm w-full font-mono">
                {testCases[activeTestCase - 1]?.output || ""}
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Result Tab */}
    {activeResultTab === "result" && (
      <div className="h-full scroll-hidden overflow-y-scroll px-4 py-3">
        {isRunning ? (
          <div className="flex flex-col items-center justify-center h-40">
            <RotateCw className="animate-spin text-blue-500 mb-3" size={24} />
            <p className="text-pink-700">Running code...</p>
          </div>
        ) : results ? (
          <div className="space-y-4 ">
            {/* Result header with status */}
            <div className="flex items-center justify-between">
              <StatusIndicator status={results.status} />
              <div className="flex items-center text-gray-300 text-sm">
                <Clock size={16} className="mr-1" />
                Runtime: {formatRuntime(results.TestCaseResult?.[0]?.time || "0 ms")}
              </div>
            </div>

            {/* Test case results */}
            <div className="border border-gray-700 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="py-2 px-3 text-left text-gray-300">Test Case</th>
                    <th className="py-2 px-3 text-left text-gray-300">Status</th>
                    <th className="py-2 px-3 text-left text-gray-300">Runtime</th>
                    <th className="py-2 px-3 text-left text-gray-300">Memory</th>
                  </tr>
                </thead>
                <tbody>
                  {results.TestCaseResult?.map((result: TestCaseResultType, index: number) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-2 px-3 text-gray-300">Case {result.testCase}</td>
                      <td className="py-2 px-3">
                        {result.passed ? (
                          <span className="text-green-500 flex items-center">
                            <CheckCircle size={14} className="mr-1" />
                            Accepted
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <XOctagon size={14} className="mr-1" />
                            Wrong Answer
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-gray-300">{formatRuntime(result.time)}</td>
                      <td className="py-2 px-3 text-gray-300">{result.memory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Output details */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Output:</h3>
              <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-sm font-mono whitespace-pre">
                {results.stdout || "No output"}
              </div>
            </div>

            {/* Error details, if any */}
            {results.stderr && (
              <div>
                <h3 className="text-sm font-medium text-red-400 mb-2">Error:</h3>
                <div className="bg-[#3a2c2c] px-3 py-2 rounded-md text-red-300 text-sm font-mono whitespace-pre">
                  {results.stderr}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p>Run your code to see results</p>
          </div>
        )}
      </div>
    )}
  </div>
</div>
</div>
</div>
</div>
  );
};

export default ProblemPage;
