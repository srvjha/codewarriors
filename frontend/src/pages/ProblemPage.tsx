import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  CodeXml,
  FlaskConical,
  History,
  Lightbulb,
  RotateCw,
  XCircle,
  AlignLeft,
  // Settings,
  SquareCheck,
  ChevronRight,
  XOctagon,
  CheckCircle,
  Clock,
  Timer,
  Cpu,
  X,
  Sparkles,
  Copy,
  Play,
  SendHorizontal,
  Lock,
  Eye,
} from "lucide-react";

import {
  ExecutionStatus,
  type Problem,
  type ResultType,
  type TestCaseResultType,
} from "@/types/problem/problemTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MyEditor from "@/utils/MyEditor";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { StatusIndicator } from "@/helper/Problem.helper";
import { ClipLoader } from "react-spinners";
import type { SubmissionType } from "@/types/submit/SubmissionTypes";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import tags from "../../companyTags.json";
import API from "@/utils/AxiosInstance";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Header } from "@/components/ui/Header";
import DiscussWithAI from "@/components/ui/DiscussWithAI";
import AiChatModal from "@/components/AiChatModal";
import ComplexityModal from "@/components/ComplexityModal";
import ViewCode from "@/components/ui/ViewCode";
import { Toast, ToastError } from "@/utils/ToastContainers";
const ProblemPage = () => {
  const params = useParams();
  const { problemId } = params;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<
    "JAVASCRIPT" | "PYTHON" | "JAVA" | "CPP"
  >("JAVASCRIPT");
  const [activeTab, setActiveTab] = useState<string>("description");
  const [activeTestCase, setActiveTestCase] = useState<number>(1);
  const [testCases, setTestCases] = useState<
    { input: string; output: string }[]
  >([]);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ResultType | null>(null);
  const [activeResultTab, setActiveResultTab] = useState("testcase");
  const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const { userData } = useSelector((state: RootState) => state.auth);
  console.log({ userData });
  const [executionType, setExecutionType] = useState<ExecutionStatus>();
  const [defaultCodeSnippet, setDefaultCodeSnippet] = useState("");
  const [viewCodeStatus, setViewCodeStatus] = useState(false);
  const [viewCode, setViewCode] = useState("");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [complexity, setShowComplexity] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problem/${problemId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setProblem(res.data.data);
          setActiveTestCase(res.data.data.testcases.length);
          setTestCases(res.data.data.testcases);
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
      setDefaultCodeSnippet(snippet);
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

  const selectedExample = problem.examples;

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setExecutionType("SUBMIT");
    let payload = {
      source_code: codeSnippet,
      language: selectedLang,
    };
    try {
      const res = await API.post(
        `/execute/code/${problemId}/${ExecutionStatus.SUBMIT}`,
        JSON.stringify(payload),
        {
          withCredentials: true,

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        // console.log("Execution result:", res.data.data);
        setResults(res.data.data);
        setActiveTab("submit");
      }
    } catch (error: any) {
      ToastError(
        error.response.data.error || "An error occurred during execution"
      );
      console.error("Error executing code:", error);

      setResults({
        status: "Error",
        stderr: error.message || "An error occurred during execution",
      });
      setActiveResultTab("submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionType("RUN");
    let payload = {
      source_code: codeSnippet,
      language: selectedLang,
    };
    try {
      const res = await API.post(
        `/execute/code/${problemId}/${ExecutionStatus.RUN}`,
        JSON.stringify(payload),
        {
          withCredentials: true,

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setResults(res.data.data);
        setActiveResultTab("result");
      }
    } catch (error: any) {
      ToastError(
        error.response.data.error || "An error occurred during execution"
      );
      console.error("Error executing code:", error);
      setResults({
        status: "Error",
        stderr: error.message || "An error occurred during execution",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCodeUpdate = (newCode: string) => {
    setCodeSnippet(newCode);
  };

  const getSubmissions = async () => {
    try {
      setActiveTab("submissions");
      const res = await API.get(`/submission/problem/${problemId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const resData = res.data.data.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSubmissions(resData);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const getCompanyTags = (title: string) => {
    const tagObj = tags.find((tag) => tag.problem === title);
    if (!tagObj || !tagObj.companies || tagObj.companies.length === 0)
      return null;
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {tagObj.companies.map((company: string, idx: number) => (
          <div
            className="flex bg-neutral-900  px-2 py-1 text-[12px] rounded-lg"
            key={idx}
          >
            <img
              src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
              alt="companylogo"
              className="w-4 h-4 rounded-lg"
            />
            <div className="ml-1">{company}</div>
          </div>
        ))}
      </div>
    );
  };

  const handleComplexity = () => {
    setShowComplexity(true);
  };
  const handleCancelComplexity = () => {
    setShowComplexity(false);
  };

  const handleReset = () => {
    setCodeSnippet(defaultCodeSnippet);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleViewCode = (code: string) => {
    setViewCode(code);
    setViewCodeStatus(true);
  };
  const handleCancel = () => {
    setViewCodeStatus(false);
  };

  const handleDiscuss = () => {
    setAiChatOpen(true);
  };

  return (
    <>
      <Toast />
      <Header>
        <div className="flex justify-end p-1">
          <Button
            className="bg-[#343131] h-8 hover:bg-[#464242] cursor-pointer text-white rounded-md mr-2 text-sm font-semibold"
            onClick={handleRunCode}
          >
            {isRunning ? (
              <ClipLoader size={18} color={"#fff"} />
            ) : (
              <>
                <Play size={16} /> Run
              </>
            )}
          </Button>
          <Button
            className="bg-green-600 h-8 hover:bg-green-700 cursor-pointer text-white rounded-md text-sm font-semibold"
            onClick={handleSubmitCode}
          >
            {isSubmitting ? (
              <ClipLoader size={18} color={"#fff"} />
            ) : (
              <>
                <SendHorizontal size={16} />
                Submit
              </>
            )}
          </Button>
        </div>
      </Header>

      {viewCodeStatus && (
        <ViewCode onCancel={handleCancel} codeString={viewCode} />
      )}
      <DiscussWithAI onClick={handleDiscuss} />
      <AiChatModal
        aiChatOpen={aiChatOpen}
        setAiChatOpen={setAiChatOpen}
        userData={userData!}
        context={problem}
      />
      {complexity && (
        <ComplexityModal
          onCancel={handleCancelComplexity}
          sourceCode={codeSnippet}
        />
      )}

      <div className=" text-white -mt-2 ">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex flex-row p-4 gap-2"
        >
          {/* Left Panel */}
          <ResizablePanel
            minSize={30}
            className="bg-[#242222] w-1/2 h-[calc(100vh-80px)] rounded-lg flex flex-col shadow-lg overflow-hidden "
          >
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
                onClick={getSubmissions}
              >
                <History size={16} className="mr-1.5" />
                Submissions
              </button>
              {results && executionType === "SUBMIT" && (
                <div className="flex items-center ">
                  <button
                    className="flex items-center px-1 py-1.5 text-sm font-medium rounded-md transition-colors  text-white "
                    onClick={() => setActiveTab("submit")}
                  >
                    <History size={16} className="mr-1" />
                    {results?.status}
                  </button>
                  <button
                    onClick={() => {
                      setResults(null);
                      setActiveTab("description");
                    }}
                    className="text-gray-400  transition-colors "
                    title="Cancel"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              {activeTab === "description" && (
                <div>
                  <h1 className="text-xl font-medium">{problem.title}</h1>
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    {problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-neutral-900 text-gray-300 px-2 py-1 text-xs rounded-md -mr-1"
                      >
                        {" "}
                        {tag}{" "}
                      </span>
                    ))}
                  </div>

                  <div>{getCompanyTags(problem.title)}</div>

                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-gray-200 font-medium mb-2">
                      Constraints:
                    </h3>
                    <div className="bg-[#2d2d2d] p-3 rounded-md text-gray-300 font-mono text-sm">
                      {problem.constraints}
                    </div>
                  </div>

                  {selectedExample &&
                    selectedExample.map((example, index) => (
                      <div className="mb-6" key={index + 1}>
                        <h3 className="text-gray-200 font-medium mb-2">
                          Example {index + 1}:
                        </h3>
                        <div className="bg-[#2d2d2d] p-3 rounded-md mb-3">
                          <div className="mb-2">
                            <span className="text-gray-50 font-medium">
                              Input:{" "}
                            </span>
                            <code className="text-gray-400 font-mono">
                              {example.input}
                            </code>
                          </div>
                          <div className="mb-2">
                            <span className="text-gray-50 font-medium">
                              Output:{" "}
                            </span>
                            <code className="text-gray-400 font-mono">
                              {example.output}
                            </code>
                          </div>
                          <div>
                            <span className="text-gray-50 font-medium">
                              Explanation:{" "}
                            </span>
                            <span className="text-gray-400">
                              {example.explanation}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <div className="w-full h-[70vh]">
                      <div className="flex flex-col  w-full items-center justify-center h-full text-gray-400">
                        <BookOpen size={48} className="mb-4 opacity-50" />
                        <p>No editorial available yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "solution" && (
                <div className="flex flex-col  h-full text-gray-400">
                  {executionType === "SUBMIT" &&
                  results?.status === "Accepted" ? (
                    <pre className="bg-transparent p-4 rounded-md overflow-x-auto hide-scrollbar">
                      <p className="text-cyan-100">{selectedLang}:</p>
                      <div className="flex relative bg-[#2f2f2f] rounded-lg">
                        <SyntaxHighlighter
                          class="hide-scrollbar"
                          language="javascript"
                          style={materialDark}
                          wrapLines={true}
                          wrapLongLines={true}
                          customStyle={{
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          {problem.referenceSolutions[selectedLang]}
                        </SyntaxHighlighter>
                        <Copy
                          className=" top-6 right-6 absolute cursor-pointer hover:text-neutral-500 "
                          size={20}
                          onClick={() =>
                            handleCopy(problem.referenceSolutions[selectedLang])
                          }
                        />
                      </div>
                    </pre>
                  ) : (
                    <div className="h-full w-full flex flex-col justify-center items-center text-center gap-2 text-gray-500">
                      <Lock size={48} className="mb-4 opacity-50" />
                      <p>Solve the problem to see the solution</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "submissions" &&
                (submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <History size={48} className="mb-4 opacity-50" />
                    <p>No submissions yet.</p>
                  </div>
                ) : (
                  <div className="">
                    <table className="min-w-full text-left text-sm text-gray-300 border-none">
                      <thead className=" text-gray-400 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3">Language</th>
                          <th className="px-4  py-3">Status</th>
                          <th className="px-4 py-3 ">Time</th>
                          <th className="px-4 py-3 text-xs">Memory</th>
                          <th className="px-4  py-3">Submitted At</th>
                          <th className="px-4 py-2">Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map(
                          (sub: SubmissionType, index: number) => (
                            <tr
                              key={index}
                              className={`border-t border-gray-700 `}
                            >
                              <td className="px-4 py-3 font-mono">
                                {sub.language}
                              </td>
                              <td className="px-4 py-3 flex items-center gap-2">
                                {sub.status === "Accepted" ? (
                                  <CheckCircle className="text-green-400 w-4 h-4" />
                                ) : (
                                  <XCircle className="text-red-400 w-4 h-4" />
                                )}
                                {sub.status}
                              </td>
                              <td className="px-4 py-3 ">
                                {Number(String(sub.time).split("s").join(" ")) *
                                  1000 +
                                  " ms" || "--"}
                              </td>
                              <td className="px-4 py-3">
                                {(() => {
                                  const memStr = String(sub.memory);
                                  const memNum = parseFloat(
                                    memStr.replace(/[^0-9.]/g, "")
                                  );
                                  return !isNaN(memNum)
                                    ? (memNum / 1000).toFixed(2) + " MB"
                                    : "--";
                                })()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {new Date(sub.createdAt).toLocaleString()}
                              </td>
                              <td
                                className="text-center  flex justify-center items-center cursor-pointer hover:text-neutral-500"
                                onClick={() => handleViewCode(sub.sourceCode)}
                              >
                                <Eye size={18} />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}

              {activeTab === "submit" && results && (
                <div className=" text-white min-h-screen py-10 px-4 flex justify-center -mt-8 ">
                  <div className="w-full max-w-4xl space-y-8">
                    <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-1  font-semibold text-base min-w-[200px]">
                          {results.status === "Accepted" ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <XCircle size={18} className="text-red-500" />
                          )}
                          <span
                            className={`${
                              results.status === "Accepted"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {results.status}
                          </span>
                          <span className="text-gray-400 font-normal text-sm ml-1">
                            {results.status === "Accepted"
                              ? `${
                                  results?.TestCaseResult?.length || 0
                                } testcases passed`
                              : "0 testcases passed"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <img
                            src={userData?.avatar}
                            alt="avatar"
                            className="w-6 h-6 rounded-full object-cover border border-gray-700"
                          />
                          <span className="text-white font-medium">
                            {userData?.fullName}
                          </span>
                          <span className="text-gray-500">
                            submitted at{" "}
                            {new Date(results?.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2  gap-6  p-2 rounded-lg">
                      <div className="bg-white/8 p-4 rounded-lg shadow space-y-2">
                        <div className="text-sm text-neutral-300 flex gap-1">
                          <Timer size={17} className="text-green-500" />
                          Runtime
                        </div>
                        <div className="text-lg font-bold text-neutral-300 flex items-center gap-2">
                          {results?.time}
                        </div>
                      </div>
                      <div className="bg-white/8  p-4 rounded-lg shadow space-y-2">
                        <div className="text-sm text-neutral-300 flex gap-1">
                          <Cpu size={18} className="text-cyan-500" />
                          Memory
                        </div>
                        <div className="text-lg font-bold text-neutral-300 flex items-center gap-2">
                          {results?.memory}
                        </div>
                      </div>
                    </div>
                    {/* hidden ke jgh flex  */}
                    {activeTab === "submit" &&
                      results &&
                      results.status === "Accepted" && (
                        <div
                          className="text-[#061a45] flex bg-clip-text cursor-pointer text-base font-semibold gap-0.5 px-2 -mt-2"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgb(175, 82, 222), rgb(0, 122, 255))",
                            WebkitTextFillColor: "transparent",
                          }}
                          onClick={handleComplexity}
                        >
                          {" "}
                          <Sparkles
                            size={18}
                            className="mt-0.5 text-purple-500"
                          />
                          Analyze Complexity
                        </div>
                      )}

                    <div className=" p-4 rounded-lg bg-gradient-to-br from-[#232323] to-[#1A1A1A] ">
                      <div className="text-sm text-gray-400 mb-2">
                        Code ({results?.language})
                      </div>

                      <SyntaxHighlighter
                        language="javascript"
                        style={oneDark}
                        wrapLines={true}
                        wrapLongLines={true}
                        customStyle={{
                          borderRadius: "0.5rem",
                          padding: "1rem",

                          fontSize: "0.875rem",
                        }}
                      >
                        {results?.sourceCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle className=" bg-gray-600 " withHandle />

          {/* Right Panel*/}
          <ResizablePanel
            minSize={30}
            className=" w-1/2 h-[calc(100vh-80px)] rounded-lg flex flex-col shadow-lg overflow-hidden bg-[#1e1e1e]"
          >
            <div className="bg-[#2d2d2d] border-b border-gray-700 flex px-2 py-1">
              <div className="flex-1 flex items-center">
                <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-[#3e3e3e] text-white rounded-md">
                  <CodeXml size={16} className="mr-1.5 text-green-500" />
                  Code
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center p-2 ">
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex text-gray-300 cursor-pointer focus:outline-none focus-visible:outline-none hover:bg-[#464242] px-2 py-1 rounded-md text-sm ">
                    {selectedLang.charAt(0).toUpperCase() +
                      selectedLang.toLowerCase().slice(1)}{" "}
                    <ChevronDown size={18} className="ml-1 mt-[3px]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="px-3 py-1 mt-2 text-gray-200 bg-[#3f3b3b] rounded-md shadow-md">
                    {["JAVASCRIPT", "PYTHON", "JAVA", "CPP"].map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onSelect={() =>
                          setSelectedLang(
                            lang as "JAVASCRIPT" | "PYTHON" | "JAVA" | "CPP"
                          )
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
                <button
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded-md"
                  onClick={() => handleReset()}
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>

            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>
                {codeSnippet.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <RotateCw
                      size={48}
                      className="mb-4 opacity-50 animate-spin"
                    />
                    <p>Loading code editor...</p>
                  </div>
                ) : (
                  <MyEditor
                    codeSnippet={codeSnippet}
                    language={selectedLang}
                    onCodeChange={handleCodeUpdate}
                  />
                )}
              </ResizablePanel>
              <ResizableHandle className=" bg-gray-600 " withHandle />
              <ResizablePanel className="bg-[#2e2e2d] rounded-b-md shadow-inner flex flex-col">
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
                          Test Result{" "}
                          <RotateCw className="ml-2 animate-spin" size={14} />
                        </span>
                      ) : (
                        "Test Result"
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  {activeResultTab === "testcase" && (
                    <div className="h-full overflow-y-auto px-4 py-3 bg-[#212121]">
                      <div className="flex items-center space-x-2 mb-3 sticky top-0 bg-[#212121] z-10 pb-2">
                        {testCases.slice(0, 3).map((_, index) => (
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
                      </div>

                      {testCases.length > 0 && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 font-semibold mb-1 block">
                              Input
                            </label>
                            <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-sm w-full font-mono">
                              {testCases[activeTestCase - 1]?.input || ""}
                            </div>
                          </div>

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

                  {activeResultTab === "result" && (
                    <div className="h-full scroll-hidden overflow-y-scroll px-4 py-3">
                      {isRunning ? (
                        <div className="flex flex-col items-center justify-center h-40">
                          <RotateCw
                            className="animate-spin text-blue-500 mb-3"
                            size={24}
                          />
                          <p className="text-green-500">Running code...</p>
                        </div>
                      ) : results ? (
                        <div className="space-y-4 ">
                          <div className="flex items-center justify-between">
                            <StatusIndicator status={results.status} />
                            <div className="flex items-center text-gray-300 text-sm">
                              <Clock size={16} className="mr-1" />
                              Runtime: {results.time}
                            </div>
                          </div>

                          <div className=" rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr>
                                  <th className="py-2 px-3 text-left text-gray-300">
                                    Test Case
                                  </th>
                                  <th className="py-2 px-3 text-left text-gray-300">
                                    Status
                                  </th>
                                  <th className="py-2 px-3 text-left text-gray-300">
                                    Runtime
                                  </th>
                                  <th className="py-2 px-3 text-left text-gray-300">
                                    Memory
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.testCases
                                  ?.slice(0, 3)
                                  .map(
                                    (
                                      result: TestCaseResultType,
                                      index: number
                                    ) => (
                                      <tr
                                        key={index}
                                        className="border-t border-gray-700"
                                      >
                                        <td className="py-2 px-3 text-gray-300">
                                          Case {result.testCases}
                                        </td>
                                        <td className="py-2 px-3">
                                          {result.passedTestCases ? (
                                            <span className="text-green-500 flex items-center">
                                              <CheckCircle
                                                size={14}
                                                className="mr-1"
                                              />
                                              Accepted
                                            </span>
                                          ) : (
                                            <span className="text-red-500 flex items-center">
                                              <XOctagon
                                                size={14}
                                                className="mr-1"
                                              />
                                              Wrong Answer
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2 px-3 text-gray-300">
                                          {result.time}
                                        </td>
                                        <td className="py-2 px-3 text-gray-300">
                                          {result.memory}
                                        </td>
                                      </tr>
                                    )
                                  )}
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-2">
                              Output:
                            </h3>
                            <div className="bg-[#363535] px-3 py-2 rounded-md text-white text-sm font-mono whitespace-pre">
                              {JSON.parse(results.stdout) || "No output"}
                            </div>
                          </div>

                          {results.stderr && (
                            <div>
                              <h3 className="text-sm font-medium text-red-400 mb-2">
                                Error:
                              </h3>
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
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
};

export default ProblemPage;
