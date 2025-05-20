export const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colorMap = {
    EASY: "bg-green-600",
    MEDIUM: "bg-yellow-600",
    HARD: "bg-red-600",
  };

  return (
    <span
      className={`${
        colorMap[difficulty as keyof typeof colorMap]
      } px-2 py-1 text-xs rounded-full font-medium`}
    >
      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
    </span>
  );
};