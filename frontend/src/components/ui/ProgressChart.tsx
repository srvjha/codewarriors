import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { P, Problem } from "@/types/problem/problemTypes";
import { useEffect, useState } from "react";
import API from "@/utils/AxiosInstance";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ progressData }: P) => {
  const [problemData, setProblemData] = useState<Problem[]>([]);

  useEffect(() => {
    const getAllProblems = async () => {
      try {
        const res = await API.get("/problem/all-problems", {
          withCredentials: true,
        });
        const data: Problem[] = res.data.data;
        setProblemData(data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      }
    };
    getAllProblems();
  }, []);

  const problemsData = problemData.reduce(
    (acc, problem) => {
      const difficulty = problem.difficulty;

      if (difficulty === "EASY") acc.totalEasyProblems += 1;
      else if (difficulty === "MEDIUM") acc.totalMedProblems += 1;
      else if (difficulty === "HARD") acc.totalHardProblems += 1;

      return acc;
    },
    {
      totalEasyProblems: 0,
      totalMedProblems: 0,
      totalHardProblems: 0,
      totalProblems: 0,
    }
  );

  problemsData.totalProblems =
    problemsData.totalEasyProblems +
    problemsData.totalMedProblems +
    problemsData.totalMedProblems;

  const totalSolved = progressData.solvedProblems;

  const data =
    totalSolved > 0
      ? {
          labels: ["Easy", "Medium", "Hard"],
          datasets: [
            {
              data: [
                progressData.easyProblems,
                progressData.medProblems,
                progressData.hardProblems,
              ],
              backgroundColor: ["#0cebcd", "#faae32", "#c62828"],
              borderWidth: 0,
              cutout: "90%",
              radius: "90%",
            },
          ],
        }
      : {
          labels: ["No Data"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#484d54"],
              borderWidth: 0,
              cutout: "90%",
              radius: "90%",
            },
          ],
        };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const totals: Record<string, number> = {
              Easy: problemsData.totalEasyProblems,
              Medium: problemsData.totalMedProblems,
              Hard: problemsData.totalHardProblems,
            };
            return `${label}: ${value}/${totals[label]} solved`;
          },
        },
      },
    },
  };

  return (
    <div className="flex items-center bg-transparent border-none border-neutral-800 relative h-[360px]   shadow-none shadow-neutral-500/40 justify-center  rounded-xl px-2 py-8  text-white col-span-1 row-span-1 ">
      <div className="relative w-[250px] h-[250px]">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-semibold">
            {totalSolved}
            <span className="text-lg text-gray-400">
              /{progressData.totalProblems}
            </span>
          </div>
          <div className="text-green-400 text-lg">✓ Solved</div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-2 ">
        <div className="bg-neutral-900 px-4 py-2 rounded-md text-[#00bfa6] text-sm font-medium flex justify-between">
          <span>Easy</span>
          <span className="ml-2 text-white font-bold">
            {progressData.easyProblems}
          </span>
          <span className="ml-1 text-white">
            /{problemsData.totalEasyProblems}
          </span>
        </div>
        <div className="bg-neutral-900 px-4 py-2 rounded-md text-[#f9a825] text-sm font-medium flex justify-between">
          <span>Med.</span>
          <span className="ml-2 text-white font-bold">
            {progressData.medProblems}
          </span>
          <span className="ml-1 text-white">
            /{problemsData.totalMedProblems}
          </span>
        </div>
        <div className="bg-neutral-900 px-4 py-2 rounded-md text-[#c62828] text-sm font-medium flex justify-between">
          <span>Hard</span>
          <span className="ml-2 text-white font-bold">
            {progressData.hardProblems}
          </span>
          <span className="ml-1 text-white">
            /{problemsData.totalHardProblems}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
