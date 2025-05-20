export const Tag = ({ name }: { name: string }) => {
  return (
    <span className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded-md mr-2">
      {name}
    </span>
  );
};