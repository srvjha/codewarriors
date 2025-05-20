import { CheckCircle, XCircle, XOctagon } from "lucide-react";

export const formatRuntime = (timeStr: string) => {
    if (!timeStr || timeStr === "false") return "0 ms";
    if (timeStr.includes("s")) {
      const seconds = parseFloat(timeStr.replace("s", ""));
      return `${Math.round(seconds * 1000)} ms`;
    }
    return timeStr;
  };

  // Result status indicator component
  export const StatusIndicator = ({ status }: { status: string }) => {
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