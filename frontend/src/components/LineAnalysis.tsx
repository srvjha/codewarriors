import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import type { Submission } from '@/types/submit/SubmissionTypes';


ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

interface Props {
  submissions: Submission[];
}

export const LineAnalysis = ({ submissions }: Props) => {

  const usageMap: Record<string, Record<string, number>> = {};

  submissions.forEach((submission) => {
    const date = new Date(submission.createdAt).toLocaleDateString();
    const lang = submission.language;

    if (!usageMap[date]) usageMap[date] = {};
    if (!usageMap[date][lang]) usageMap[date][lang] = 0;

    usageMap[date][lang]++;
  });

  const sortedDates = Object.keys(usageMap).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const languages = Array.from(
    new Set(submissions.map((sub) => sub.language))
  );

  const datasets = languages.map((lang) => ({
    label: lang,
    data: sortedDates.map((date) => usageMap[date]?.[lang] || 0),
    fill: false,
    borderColor: getColor(lang),
    tension: 0.3,
  }));

  const data = {
    labels: sortedDates,
    datasets,
  };

  return (
    <div className="bg-transparent border border-neutral-800 rounded-xl px-6 py-8   drop-shadow-lg col-span-1 ">
      <h2 className="text-lg font-semibold text-white mb-4">Language Usage Over Time</h2>
      <Line data={data} />
    </div>
  );
};


const getColor = (lang: string) => {
  const colorMap: Record<string, string> = {
    JAVASCRIPT: '#facc15',
    PYTHON: '#4ade80',
    CPP: '#60a5fa',
    JAVA: '#f472b6',
    C: '#f87171',
  };
  return colorMap[lang.toUpperCase()] || '#a78bfa';
};
