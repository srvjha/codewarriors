import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import type { Submission } from "@/types/submit/SubmissionTypes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  submissions: Submission[];
};

const ChartAnalysis = ({ submissions }: Props) => {
  const tagCountMap: Record<string, number> = {};

  submissions.forEach((submission) => {
    submission.problem.tags.forEach((tag: string) => {
      tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
    });
  });


  const labels = Object.keys(tagCountMap);
  const dataCounts = Object.values(tagCountMap);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Tag Frequency",
        data: dataCounts,
        backgroundColor: ["#00bfa6", "#f9a825", "#c62828", "#2196f3", "#9c27b0", "#ff9800", "#607d8b"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.y} submission(s)`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#444" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#ccc", stepSize: 1 },
        grid: { color: "#444" },
      },
    },
  };

  return (
 <div className="bg-transparent border border-neutral-800 rounded-xl px-6 py-8 drop-shadow-lg lg:col-span-1 sm:col-span-1 col-span-1">
  <h2 className="text-xl font-semibold mb-4 text-white">Skill Analysis</h2>
  <Bar data={chartData} options={options} />
</div>

  );
};

export default ChartAnalysis;
