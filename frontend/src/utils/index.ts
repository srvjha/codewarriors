export const formatTime = (date: string) => {
  const postTime = new Date(date).getTime();
  const now = Date.now();

  if (isNaN(postTime)) return "Invalid date";

  const diff = Math.floor((now - postTime) / 1000); // seconds

  if (diff < 0) return "Just now";

  const units = [
    { label: "year", value: 365 * 24 * 60 * 60 },
    { label: "month", value: 30 * 24 * 60 * 60 },
    { label: "day", value: 24 * 60 * 60 },
    { label: "hour", value: 60 * 60 },
    { label: "minute", value: 60 },
  ];

  if (diff < 60) return "Just now";

  for (const unit of units) {
    const amount = Math.floor(diff / unit.value);
    if (amount >= 1) {
      return `${amount} ${unit.label}${amount > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};