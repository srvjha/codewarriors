// import Editor from "@monaco-editor/react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Send, PlayCircle } from "lucide-react";

// // Inside return statement

// <div className="w-1/2 flex flex-col mt-2 rounded-2xl bg-[#1e1e1e] p-3 space-y-3">
//   {/* Language Selector */}
//   <div className="flex justify-between items-center">
//     <select
//       value={language}
//       onChange={(e) => setLanguage(e.target.value as any)}
//       className="bg-[#2e2e2e] text-white px-3 py-2 rounded-md"
//     >
//       {Object.keys(problem.codeSnippets).map((lang) => (
//         <option key={lang} value={lang}>{lang}</option>
//       ))}
//     </select>
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={() => setCode(problem.codeSnippets[language])}
//       className="text-sm"
//     >
//       Reset
//     </Button>
//   </div>

//   {/* Code Editor */}
//   <div className="h-[320px] rounded-xl overflow-hidden border border-[#2e2e2e]">
//     <Editor
//       height="100%"
//       defaultLanguage={syntaxMap[language]}
//       language={syntaxMap[language]}
//       theme="vs-dark"
//       value={code}
//       onChange={(value) => setCode(value || "")}
//       options={{
//         fontSize: 14,
//         minimap: { enabled: false },
//         fontFamily: "monospace",
//         scrollBeyondLastLine: false,
//         automaticLayout: true,
//       }}
//     />
//   </div>

//   {/* Action Buttons */}
//   <div className="flex gap-2 justify-end">
//     <Button onClick={handleRun} disabled={isRunning}>
//       <PlayCircle className="w-4 h-4 mr-2" />
//       Run
//     </Button>
//     <Button variant="success" onClick={handleSubmit} disabled={isRunning}>
//       <Send className="w-4 h-4 mr-2" />
//       Submit
//     </Button>
//   </div>

//   {/* Tabs: Input/Output/Test Cases */}
//   <Tabs defaultValue="output" className="mt-3 w-full">
//     <TabsList className="bg-[#2e2e2e] rounded-md">
//       <TabsTrigger value="input">Custom Input</TabsTrigger>
//       <TabsTrigger value="output">Output</TabsTrigger>
//       <TabsTrigger value="testcases">Test Cases</TabsTrigger>
//     </TabsList>
    
//     <TabsContent value="input">
//       <textarea
//         placeholder="Enter your test input here..."
//         value={customInput}
//         onChange={(e) => setCustomInput(e.target.value)}
//         className="w-full h-24 mt-2 p-3 rounded-md bg-[#1e1e1e] text-gray-200 border border-[#2e2e2e] resize-none"
//       />
//     </TabsContent>
    
//     <TabsContent value="output">
//       <div className="h-24 overflow-auto p-3 bg-[#1e1e1e] rounded-md text-sm text-green-400 whitespace-pre-wrap">
//         {isRunning ? "Executing..." : output || "No output yet."}
//       </div>
//     </TabsContent>

//     <TabsContent value="testcases">
//       <div className="space-y-2 mt-2">
//         {problem.testcases?.map((testcase, index) => (
//           <div key={index} className="bg-[#1e1e1e] p-3 rounded-md">
//             <p className="text-sm text-gray-400">Test Case {index + 1}</p>
//             <p className="text-xs text-gray-300 mt-1">Input:</p>
//             <pre className="bg-[#2a2a2a] p-2 rounded">{testcase.input}</pre>
//             <p className="text-xs text-gray-300 mt-1">Expected Output:</p>
//             <pre className="bg-[#2a2a2a] p-2 rounded">{testcase.output}</pre>
//           </div>
//         ))}
//       </div>
//     </TabsContent>
//   </Tabs>
// </div>
