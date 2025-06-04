import { MessageCircle } from "lucide-react";

const DiscussWithAI = ({ onClick }:{onClick:()=>void}) => {
  return (
    <button
      onClick={onClick}
      className="fixed cursor-pointer bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition duration-300"
    >
      <MessageCircle className="w-5 h-5" />
      Discuss with AI
    </button>
  );
};

export default DiscussWithAI;
