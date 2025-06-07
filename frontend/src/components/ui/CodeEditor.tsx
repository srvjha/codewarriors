import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeEditor() {
  const code = `
function findMissingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  const missing = expectedSum - actualSum;
  console.log(\`Expected: \${expectedSum}, Actual: \${actualSum}\`);
  return missing;
}

const numbers = [0, 1, 2, 4, 5];
const result = findMissingNumber(numbers);
console.log('Missing Number:', result);

const numbers = [0, 1, 2, 3, 4,6];
const result = findMissingNumber(numbers);
console.log('Missing Number:', result);
`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl h-full mx-auto"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-sm shadow-neutral-400">
        {/* Top bar */}
        <div className="px-4 py-2 flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-gray-400">challenge.js</div>
          </div>
        </div>

        {/* Code block with syntax highlighting */}
        <div className="p-6 text-sm text-gray-100 overflow-x-auto">
          <SyntaxHighlighter
            language="javascript"
            style={oneDark}
            showLineNumbers
            customStyle={{
              background: "transparent",
              padding: 0,
              margin: 0,
              fontSize: "0.875rem",
            }}
            codeTagProps={{
              style: {
                fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </motion.div>
  );
}
