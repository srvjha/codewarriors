import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import CodeEditor from "@/components/ui/CodeEditor";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="relative flex flex-col min-h-screen">
      <motion.div
        initial={{scale: 0.9}}
        animate={{scale: [0.9, 1.1, 0.9]}}
        transition={{repeat: Infinity, duration: 8, ease: 'easeInOut'}}
        className=" absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-400  opacity-30 blur-3xl pointer-events-none z-0"
      />

      <motion.div
        initial={{scale: 1}}
        animate={{scale: [1, 1.2, 1]}}
        transition={{repeat: Infinity, duration: 10, ease: 'easeInOut'}}
        className="absolute top-[400px] -left-20 w-96 h-96 rounded-full bg-blue-500  opacity-20 blur-3xl pointer-events-none z-10"
      />

     

      <div className="text-white px-6 py-12 md:py-24 min-h-screen ">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-12 -mt-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-500">
              Code. Compete. Conquer.
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Step into the ultimate coding arena. Solve real-world challenges,
              track your progress, and became a CodeWarrior
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/problemset">
              <Button className="text-lg px-6 py-6 bg-blue-600 hover:bg-blue-500 rounded-lg">
                Start Solving
              </Button>
               </Link>
              
              <Link to="/login">
              <Button
                variant="outline"
                className="text-lg px-6 py-6 border-gray-700 hover:bg-zinc-800"
              >
                Join Codewarrior <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
             
            </div>
          </motion.div>

          {/* Code Editor Preview (Right) */}
          <div className="w-full">
            <CodeEditor />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-36 px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left content */}
            <div
              className="
            flex-1           
            rounded-2xl
            backdrop-blur-md
            p-10
            text-white
            shadow-sm
          "
            >
              <h2 className="text-4xl font-bold mb-6">
                What is{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  CodeWarrior?
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                CodeWarrior is a modern coding platform that offers real-world
                coding challenges, instant feedback, and a community for
                developers to learn, compete, and grow their skills. Whether
                you're preparing for interviews or sharpening your coding
                skills, CodeWarrior provides the tools and environment to excel.{" "}
                <br />
                <br />
                Whether you're a beginner taking your first steps or a seasoned
                developer aiming to stay sharp, CodeWarrior makes practice
                engaging, competitive, and growth-focused.
              </p>
            </div>

            {/* Right GIF */}
            <div className="flex-1 max-w-lg w-full ">
              <img
                src="coder2.gif"
                alt="CodeWarrior demo"
                className="w-full rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-44 px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-World Challenges",
                desc: "Practice problems modeled after real interview scenarios.",
              },
              {
                title: "Instant Feedback",
                desc: "Know what went wrong and how to improve immediately.",
              },
              {
                title: "Leaderboard",
                desc: "Climb ranks by solving challenges and beating the clock.",
              },
              {
                title: "Discuss & Learn",
                desc: "Join discussions, ask questions, and learn from others.",
              },
              {
                title: "Admin Problem Management",
                desc: "Admins can easily add, edit, and monitor problems.",
              },
              {
                title: "Coding Profile",
                desc: "Track your growth, performance, and rank over time.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-transparent border border-white/10 rounded-2xl px-6 py-12 backdrop-blur-md transition duration-300 hover:shadow-sm hover:shadow-blue-400"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
