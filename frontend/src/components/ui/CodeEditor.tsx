import { motion } from "framer-motion";

export default function FancyCodeEditor() {
  const codeLines = [
    "function findMissingNumber(nums) {",
    "  const n = nums.length;",
    "  const expectedSum = (n * (n + 1)) / 2;",
    "  const actualSum = nums.reduce((sum, num) => sum + num, 0);",
    "  const missing = expectedSum - actualSum;",
    "  console.log(`Expected: ${expectedSum}, Actual: ${actualSum}`);",
    "  return missing;",
    "}",
    "",
    "const numbers = [0, 1, 2, 4, 5];",
    "const result = findMissingNumber(numbers);",
    "console.log('Missing Number:', result);"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto mt-10"
    >
      <div className="relative rounded-2xl overflow-hidden  bg-[#0d0d0d] shadow-lg shadow-[#088bd7]">
        
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

        {/* Code block */}
        <div className="p-6 font-mono text-sm text-gray-100 overflow-x-auto">
          <pre className="flex flex-col">
            {codeLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-8 text-right text-gray-500 mr-4 select-none">
                  {i + 1}
                </span>
                <code className="whitespace-pre-wrap">{line}</code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
