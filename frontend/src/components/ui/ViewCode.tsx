import {  useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, X } from "lucide-react";

const ViewCode = ({
  onCancel,
  codeString,
}: {
  onCancel: () => void;
  codeString: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  return (
    <div
      className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <button
        className="absolute top-2 right-2 text-white hover:text-red-500 transition"
        onClick={onCancel}
        aria-label="Close"
      >
        <X />
      </button>
      <div ref={modalRef} className="flex relative">
        <SyntaxHighlighter
          language="javascript"
          style={vscDarkPlus}
          customStyle={{ borderRadius: "8px" }}
        >
          {codeString}
        </SyntaxHighlighter>
        <Copy
          className="cursor-pointer hover:text-neutral-500 absolute top-4 right-4"
          size={20}
          onClick={() => handleCopy(codeString)}
        />
      </div>
    </div>
  );
};

export default ViewCode;
