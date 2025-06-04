import API from "@/utils/AxiosInstance";
import { Cpu, Gauge, X } from "lucide-react";
import { useEffect, useState } from "react";

const ComplexityModal = ({
  onCancel,
  sourceCode,
}: {
  onCancel: () => void;
  sourceCode:string;
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    time_complexity: string;
    space_complexity: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateComplexity = async () => {
      try {
        setLoading(true);
        const response = await API.post("/auth/get-complexity", {sourceCode});
        const cleaned = response.data.data.replace(/```json\s*/, "").replace(/```$/, "")   
        const parsed = JSON.parse(cleaned);
        setResult(parsed);
        setError(null);
      } catch (err: any) {
        console.error("Error calculating complexity:", err);
        setError("Failed to calculate complexity.");
      } finally {
        setLoading(false);
      }
    };

    calculateComplexity();
  }, []);

  return (
    <div className="bg-black/50 fixed inset-0 z-50 w-1/2 flex justify-center items-center backdrop-blur-sm p-4">
      <button
        className="absolute top-2 right-2 text-white hover:text-red-500 transition"
        onClick={onCancel}
        aria-label="Close"
      >
        <X />
      </button>

      <div className="bg-neutral-900 w-72 p-5 rounded-xl shadow-lg text-white flex flex-col space-y-4">
        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Complexity Result
        </h3>

        {loading ? (
          <div className="text-sm text-gray-400">Analyzing code...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : result ? (
          <>
            <div className="text-sm flex items-center gap-2">
              <Gauge className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 font-medium">Time Complexity:</span>
              <span className="text-blue-400 ml-auto">
                {result.time_complexity}
              </span>
            </div>
            <div className="text-sm flex items-center gap-2">
              <Gauge className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300 font-medium">Space Complexity:</span>
              <span className="text-blue-400 ml-auto">
                {result.space_complexity}
              </span>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-400">No result available.</div>
        )}
      </div>
    </div>
  );
};

export default ComplexityModal;
