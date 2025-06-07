import { useEffect, useState, type ReactElement } from "react";
import { Clock, Play, XCircle } from "lucide-react";

export default function ContestTimer({
  startTime,
  endTime,
  serverOffset,
}: {
  startTime: string;
  endTime: string;
  serverOffset: number;
}) {
  const [statusText, setStatusText] = useState("");
  const [statusIcon, setStatusIcon] = useState<ReactElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now() + serverOffset;
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now >= end) {
        setStatusText("Contest Ended");
        setStatusIcon(<XCircle className="text-red-500 w-5 h-5" />);
        clearInterval(interval);
        return;
      }

      if (now >= start && now < end) {
        setStatusText("Contest Started");
        setStatusIcon(<Play className="text-green-400 w-5 h-5" />);
        return;
      }

      const diff = start - now;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setStatusText(`Starts in ${d}d ${h}h ${m}m ${s}s`);
      setStatusIcon(<Clock className="text-amber-400 w-5 h-5" />);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, serverOffset]);

  return (
    <p className="text-base text-white flex items-center gap-2">
      {statusIcon}
      {statusText}
    </p>
  );
}
