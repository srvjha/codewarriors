import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X } from 'lucide-react';



const ViewCode = ({ onCancel,codeString }: { onCancel: () => void ,codeString:string}) => {
  return (
    <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <button
        className="absolute top-2 right-2 text-white hover:text-red-500 transition"
        onClick={onCancel}
        aria-label="Close"
      >
        <X />
      </button>

      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ borderRadius: '8px' }}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default ViewCode;
