import { Card, CardContent } from "@/components/ui/Card";
import type { SubmissionType } from "@/types/submit/SubmissionTypes";
import { CheckCircle2, Cpu, Timer } from "lucide-react";

const SubmissionResult = ({ submission }:{submission:SubmissionType}) => {
  const {
    status,
    time,
    memory,
    stdout,
    language,
    TestCaseResult,
    createdAt,
    sourceCode
  } = submission;

  // console.log("Submission Result: ", submission);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-green-600 font-semibold text-lg flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          {status} <span className="text-gray-400 text-sm">({TestCaseResult.length} test cases passed)</span>
        </div>
        <div className="text-sm text-gray-500">
          Submitted at {new Date(createdAt).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Runtime</div>
                <div className="text-xl font-semibold flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  {time}
                </div>
              </div>
              <div className="text-xs text-right text-muted-foreground">
                Based on internal test
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Memory</div>
                <div className="text-xl font-semibold flex items-center gap-1">
                  <Cpu className="w-4 h-4" />
                  {memory}
                </div>
              </div>
              <div className="text-xs text-right text-muted-foreground">
                Evaluated per test case
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="font-mono text-sm text-muted-foreground mb-2">Output (stdout)</div>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm whitespace-pre-wrap">
            {stdout}
          </pre>
        </CardContent>
      </Card>

      {/* Source Code */}
      <Card>
        <CardContent className="p-4">
          <div className="text-muted-foreground text-sm mb-2">
            Code ({language})
          </div>
          <pre className="bg-gray-900 text-white p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
            {sourceCode}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionResult;
