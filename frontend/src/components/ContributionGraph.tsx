import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import type {
  Submission
} from "@/types/submit/SubmissionTypes";


type SubmissionProps = {
  submissions:Submission[]
}

const ContributionCalendar = ({ submissions }:SubmissionProps) => {
  const dateMap = submissions.reduce(
    (acc: { [key: string]: number }, submission: Submission) => {
      const date = new Date(submission?.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const heatmapData = Object.entries(dateMap).map(([date, count]) => ({
    date,
    count: Number(count),
  }));

  const endDate = new Date();
  const rawStartDate = new Date(
    new Date().setFullYear(endDate.getFullYear() - 1)
  );
  const startDate = new Date(rawStartDate);
  startDate.setDate(startDate.getDate() + ((6 - startDate.getDay()) % 7));

  return (
    <div className="px-4 py-4  rounded shadow w-[970px] h-[100px]">
      <h2 className="text-xl font-bold mb-8 text-center">
        Your Submission Activity
      </h2>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapData}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-scale-0";
          if (value.count >= 5) return "color-scale-4";
          if (value.count >= 3) return "color-scale-3";
          if (value.count >= 1) return "color-scale-2";
          return "color-scale-1";
        }}
        tooltipDataAttrs={(value) => {
          if (value && value.date) {
            return {
              "data-tooltip-id": "tooltip",
              "data-tooltip-content": `${value.date}: ${value.count} submission(s)`,
            } as { [key: string]: string };
          }
          return {};
        }}
        showWeekdayLabels={false}
      />
      <ReactTooltip id="tooltip" />
    </div>
  );
};

export default ContributionCalendar;
