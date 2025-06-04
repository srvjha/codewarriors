import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/CodeEditor";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import faqs from "../constants/faqs.json";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import CoderDesc from "@/components/ui/CoderDesc";
import Features from "@/components/ui/Features";



const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="relative flex flex-col min-h-screen  text-white overflow-hidden">
      <div className="relative z-10   px-6 py-20 md:py-32 min-h-screen flex-row items-center justify-center">
        <div className=" flex justify-center items-center -mt-10">
          <div className=" px-6 py-2 flex  text-sm font-semibold rounded-full text-white bg-gradient-to-r from-neutral-600 via-neutral-800 to-neutral-900 shadow-md ring-1 ring-white/10 backdrop-blur-sm">
            ✨ Join AI Assisted coding platform built for real-world problem solvers
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-5 flex flex-col items-center text-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full "
          >
            {" "}
            <div className="flex justify-center items-center">
              <h1 className="text-4xl sm:text-2xl md:text-6xl w-full max-w-4xl sm:max-w-4xl md:max-w-4xl lg:max-w-4xl mx-auto   font-bold leading-tight tracking-tight">
                A platform to{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                  master coding
                </span>{" "}
                & shape your future.
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-4">
              Solve challenges, level up your skills, and stand out. Dive into a
              clean, powerful coding experience made for true developers.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/problemset">
                <Button className="text-lg px-6 py-6 cursor-pointer bg-zinc-50 text-black hover:bg-gray-200 rounded-xl shadow-lg">
                  Start Solving
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/" : "/login"}>
                <Button className="text-lg px-6 py-6 cursor-pointer bg-transparent border border-white hover:bg-white hover:text-black text-white rounded-xl shadow-inner">
                  Join Codewarrior
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full shadow-2xl rounded-2xl border border-neutral-800 bg-neutral-950"
          >
            <CodeEditor />
          </motion.div>
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
              <h2 className="text-4xl font-medium mb-6 text-zinc-50">
                What is{" "}
                 <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
           
                  CodeWarrior
                </span>
                <span className="ml-1">?</span>
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

            <div className="flex-1 max-w-lg w-full ">
             <CoderDesc/>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-40 px-4">
          <h2 className="text-5xl font-bold mb-12 text-center text-white">
            Key Features of Our {" "}
             <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Coding Platform
            </span>
          </h2>

         <Features/>
        </div>

         

        <div className="max-w-4xl mx-auto mt-42 px-4">
          <h2 className="text-5xl font-bold text-center text-white mb-8">
            FAQs
          </h2>
          <Accordion type="multiple" className="space-y-2">
            {faqs.map((faq: { q: string; a: string }, index: number) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className=" rounded-none backdrop-blur-sm"
              >
                <AccordionTrigger className=" text-zinc-50 text-left text-xl font-normal px-4 py-3 ">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300 px-4 pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
