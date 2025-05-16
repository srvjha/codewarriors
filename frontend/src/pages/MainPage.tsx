import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Welcome to <span className="text-green-400">Code Warriors</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Sharpen your coding skills by solving real-world problems, writing
          clean code, running it, and submitting like a pro.
        </p>
        <Button className="text-lg px-6 py-6 bg-blue-600">Start Solving</Button>
      </motion.div>

      {/* Code Interaction Simulation */}
      <div className="mt-20 max-w-4xl h-[500px] mx-auto rounded-xl bg-transparent  p-6 shadow-lg border border-gray-700"></div>
    </div>
  );
}
