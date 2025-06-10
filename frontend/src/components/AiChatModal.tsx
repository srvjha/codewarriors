import { useEffect, useRef, useState } from "react";
import type { UserData } from "@/redux/slices/auth/authTypes";
import type { Problem } from "@/types/problem/problemTypes";
import API from "@/utils/AxiosInstance";
import ReactMarkdown from "react-markdown";

interface AiChatModalProps {
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  userData: UserData;
  context: Problem;
}

interface Message {
  role: "user" | "bot";
  text: string;
}

const AiChatModal = ({
  aiChatOpen,
  setAiChatOpen,
  userData,
  context,
}: AiChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hey How Could i help you" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  interface HandleSendMessageEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSendMessage = async (
    e: HandleSendMessageEvent
  ): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response: { data?: { data?: string } } = await API.post(
        "/auth/ai/ask/question",
        {
          context: context,
          message: input,
        }
      );
      // console.log("response: ", response);

      const botReply: Message = {
        role: "bot",
        text: response?.data?.data || "Sorry, I couldn't understand that.",
      };

      setMessages((prev: Message[]) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev: Message[]) => [
        ...prev,
        { role: "bot", text: "Error: Failed to get AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    aiChatOpen && (
      <div className="fixed bottom-20 right-6 w-96 h-[32rem] bg-neutral-900 border-none shadow-2xl rounded-xl flex flex-col z-50">
        <div className="flex justify-between items-center p-4 border-b border-b-neutral-500">
          <h3 className="font-semibold text-lg text-gray-200">Ask AI</h3>
          <button
            onClick={() => setAiChatOpen(false)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "bot" && (
                <img
                  src="/chatbot.png"
                  alt="AI"
                  className="w-8 h-8 rounded-full bg-gray-200"
                />
              )}
              <div
                className={`px-3 py-2 rounded-lg text-sm max-w-[80%] break-words whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-100 text-zinc-800"
                    : "bg-zinc-100 text-zinc-800"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {msg.role === "user" && (
                <img
                  src={userData?.avatar}
                  alt="You"
                  className="w-8 h-8 rounded-full bg-zinc-200 object-cover"
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-zinc-400">AI is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-t-neutral-600 p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border-none text-sm rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default AiChatModal;
