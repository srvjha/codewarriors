import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, ChevronRight, Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const HomePage = () => {
  type User = {
    fullName: string;
    avatar?: string; // OR avatar: string | undefined;
    email: string;
  };
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = async () => {
      try {
        const data = await axios.get("http://localhost:3000/api/v1/auth/me", {
          withCredentials: true,
        });
        setUser(data.data.data);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    currentUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen ">
      <nav className="text-white flex flex-row justify-between px-4 md:px-8 py-4 h-16 border-b border-neutral-800 sticky top-0 z-50  bg-opacity-90 backdrop-blur-sm">
        <div className="flex flex-row gap-5 items-center">
          <img
            src="codewarriorblue.png"
            alt="Code Warrior"
            width="160"
            className="h-7 w-auto"
          />
          <div className="hidden md:flex space-x-6">
            <Link
              to="/challenges"
              className="hover:text-blue-400 transition-colors"
            >
              Problems
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-blue-400 transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              to="/discuss"
              className="hover:text-blue-400 transition-colors"
            >
              Discuss
            </Link>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <Link to="/about" className="hover:text-blue-400 transition-colors">
            About
          </Link>
          {user ? (
            // <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user?.fullName.split("")[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <div className="text-white px-6 py-12 md:py-24 min-h-screen ">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 mt-22">
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Become a <span className="text-blue-400">Code Warrior</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mb-8">
              Master your coding skills through challenging problems, real-time
              feedback, and a competitive community. Join thousands of
              developers leveling up their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="text-lg px-6 py-6 bg-blue-600 hover:bg-blue-500 rounded-lg">
                Start Solving
              </Button>
              <Button
                variant="outline"
                className="text-lg px-6 py-6 border-gray-700 hover:bg-gray-800"
              >
                View Challenges <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 flex items-center text-gray-400">
              <Users className="h-5 w-5 mr-2" />
              <span>Joined by over 25,000 developers worldwide</span>
            </div>
          </motion.div>

          {/* Right Side Code Editor Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1"
          >
            <div className="rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              <div className="bg-gray-800 px-4 py-2 flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="text-sm text-gray-400">challenge.js</div>
              </div>
              <div className="bg-gray-900 p-4 font-mono text-sm text-gray-300">
                <pre className="whitespace-pre-wrap">
                  <span className="text-blue-400">function</span>{" "}
                  <span className="text-blue-400">findMissingNumber</span>
                  (nums) {"{"}
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">const</span> n =
                  nums.length;
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">
                    const
                  </span>{" "}
                  expectedSum = (n * (n + 1)) / 2;
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">
                    const
                  </span>{" "}
                  actualSum = nums.reduce(
                  <span className="text-blue-400">(sum, num)</span> = sum + num,
                  0);
                  <br />
                  &nbsp;&nbsp;<span className="text-orange-400">
                    return
                  </span>{" "}
                  expectedSum - actualSum;
                  <br />
                  {"}"}
                </pre>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-blue-400">• All tests passed</span>
                  <span className="text-gray-400">Runtime: 52ms</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className=" text-gray-300 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <img
                src="codewarriorblue.png"
                alt="Code Warrior"
                width="170"
                className="h-8 w-auto mb-4"
              />
              <p className="text-sm text-gray-400 mb-4">
                Empowering developers to become coding masters through practice,
                challenges, and community.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Challenges
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Discussion Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Legal
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Code Warriors. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
