import {
  Boxes,
  Bot,
  Flame,
  MessagesSquare,
  FileText,
  Code2,
  LayoutDashboard
} from 'lucide-react';
import FeatureDash from './FeatureDash'; 

const Features = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:auto-rows-[240px] auto-rows-auto  items-start">

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-10 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2 row-span-1  lg:row-span-1">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className='text-zinc-100 text-2xl'>Structured DSA Practice</span>
          <Boxes size={24} className="mt-1 text-[#f97316]" />
        </h3>
        <p className="text-sm text-gray-400">
          Master Data Structures and Algorithms through a well-organized collection of problems categorized by topic such as Arrays, Strings, Dynamic Programming, Trees, and Graphs. Filter problems based on difficulty level or company-specific patterns to align your preparation with your target job.
        </p>
      </div>

 
      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-6 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2 row-span-2  lg:row-span-2">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-2xl font-semibold mb-2 flex gap-2 text-white">
          <span className='text-zinc-100 text-2xl'>Discuss with AlgoAI</span>
          <Bot size={24} className="mt-1 text-[#a855f7]" />
        </h3>
        <p className="text-sm text-gray-300">
          Struggling with a problem? Instantly initiate a conversation with AlgoAI, your intelligent assistant designed to explain concepts, guide you through solution steps, and answer questions contextually.
        </p>
        <div className="-mb-6">
            <img src="./mfeat.png" alt=""/>
        </div>
      </div>

    
      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-6 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2 row-span-2  lg:row-span-2">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Profile Dashboard</span>
         <LayoutDashboard size={24} className='mt-1 text-cyan-500' />
        </h3>
        <p className="text-sm text-gray-300 ">
          Dive into your personalized dashboard showcasing your coding progress. Track solved problems, monitor your daily streak, and analyze submission trends through interactive graphs. View recent submissions, contribution history. </p>
         <div className=' flex justify-center items-center'> <FeatureDash /></div>
      </div>

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-10 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2    lg:row-span-1 ">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className='text-zinc-100 text-2xl'>Practice Sheets</span>
          <FileText size={24} className="mt-1 text-[#10b981]" />
        </h3>
        <p className="text-sm text-gray-400">
          Access curated practice sheets for different topics and difficulty levels, or create your own personalized problem sets.
        </p>
      </div>
     

     
      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-10  hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-4  lg:row-span-1 md:-mt-14   ">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className='text-zinc-100 text-2xl'>Code Editors</span>
          <Code2 size={24} className="mt-1 text-[#22d3ee]" />
        </h3>
        <p className="text-sm text-gray-400">
          Write, test, and run code in a feature-rich environment built for competitive programming and interview preparation. The editor supports multiple languages, intelligent autocompletion, and real-time feedback.
        </p>
        <div className='mt-2 z-50 relative h-[310px]'>
            <img src="./editr.png" className='cursor-pointer rounded-xl w-full h-[340px]  shadow-xs shadow-neutral-100'/>
        </div>
      </div>

       <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-10 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2  lg:row-span-1 lg:-mt-14">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className='text-zinc-100 text-2xl'>Discussion Forum</span>
          <MessagesSquare size={24} className="mt-1 text-[#ef4444]" />
        </h3>
        <p className="text-sm text-gray-400">
          Engage with a vibrant community of coders. Ask doubts, discuss problem-solving techniques, and share your interview experiences.
        </p>
      </div>
      

        <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-16 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2  lg:col-start-5 lg:-mt-28">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className='text-zinc-100 text-2xl'>Daily Streak Feature</span>
          <Flame size={24} className="mt-1 text-[#eca409]" />
        </h3>
        <p className="text-sm text-gray-400">
         Stay consistent and motivated with a gamified daily streak system. Visualize your consistency, analyze day-wise performance, and push yourself to keep the momentum going. The system highlights your improvement over time, making it easier to spot weak areas and celebrate your growth.
           </p>
      </div>

    </div>
  );
};

export default Features;
