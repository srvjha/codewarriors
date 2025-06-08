import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TbFlameFilled } from "react-icons/tb";
import {
  ListTodo,
  User,
  Trophy,
  MessageSquare,
  BookOpen,
  Plus,
  Calendar,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import API from "@/utils/AxiosInstance";
import type { UserData } from "@/redux/slices/auth/authTypes";
import { Link } from "react-router-dom";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalProblems, setTotalProblems] = useState<number>(0);
  const [totalContests, setTotalContests] = useState<number>(0);
  const [totalDiscussions, setTotalDiscussions] = useState<number>(0);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [publicPlaylists, setPublicPlaylists] = useState<number>(0);
  const [privatePlaylists, setPrivatePlaylists] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/all/users", { withCredentials: true });
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchTotalProblems = async () => {
      try {
        const res = await API.get("/problem/all-problems");
        setTotalProblems(res.data.data.length);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    const fetchContests = async () => {
      try {
        const res = await API.get("/contests/all");
        setTotalContests(res.data.data.length);
      } catch (err) {
        console.error("Error fetching contests:", err);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const res = await API.get("/discuss/post/all", {
          withCredentials: true,
        });
        setTotalDiscussions(res.data.data.length);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const [publicRes, privateRes] = await Promise.all([
          API.get("/playlist/all/public", { withCredentials: true }),
          API.get("/playlist/all/private", { withCredentials: true }),
        ]);
        const publicCount = publicRes.data.data.length;
        const privateCount = privateRes.data.data.length;
        setPublicPlaylists(publicCount);
        setPrivatePlaylists(privateCount);
        setTotalPlaylists(publicCount + privateCount);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };

    fetchUsers();
    fetchTotalProblems();
    fetchContests();
    fetchDiscussions();
    fetchPlaylists();
  }, []);

  const verifiedUsers = users.filter((user) => user.isEmailVerified).length;
  const unverifiedUsers = users.length - verifiedUsers;
  const activeUsers = users.filter(
    (user) => user.dailyProblemStreak > 0
  ).length;

  const userVerificationData = {
    labels: ["Verified", "Unverified"],
    datasets: [
      {
        data: [verifiedUsers, unverifiedUsers],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderColor: ["#059669", "#d97706"],
        borderWidth: 2,
      },
    ],
  };

  const playlistData = {
    labels: ["Public", "Private"],
    datasets: [
      {
        data: [publicPlaylists, privatePlaylists],
        backgroundColor: ["#3b82f6", "#8b5cf6"],
        borderColor: ["#2563eb", "#7c3aed"],
        borderWidth: 2,
      },
    ],
  };

  const activityData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "User Activity",
        data: [activeUsers, users.length - activeUsers],
        backgroundColor: ["#06b6d4", "#64748b"],
        borderColor: ["#0891b2", "#475569"],
        borderWidth: 1,
      },
    ],
  };

  const streakDistribution = {
    labels: ["0 Days", "1-5 Days", "6-15 Days", "16-30 Days", "30+ Days"],
    datasets: [
      {
        label: "Users",
        data: [
          users.filter((u) => u.dailyProblemStreak === 0).length,
          users.filter(
            (u) => u.dailyProblemStreak >= 1 && u.dailyProblemStreak <= 5
          ).length,
          users.filter(
            (u) => u.dailyProblemStreak >= 6 && u.dailyProblemStreak <= 15
          ).length,
          users.filter(
            (u) => u.dailyProblemStreak >= 16 && u.dailyProblemStreak <= 30
          ).length,
          users.filter((u) => u.dailyProblemStreak > 30).length,
        ],
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
    scales: {
      x: { ticks: { color: "#ffffff" }, grid: { color: "#374151" } },
      y: { ticks: { color: "#ffffff" }, grid: { color: "#374151" } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/create/problem">
            <Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Problem
            </Button>
          </Link>

          <UITooltip>
            <TooltipTrigger asChild>
              <Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Create Contest
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming Soon...</p>
            </TooltipContent>
          </UITooltip>
        </div>
      </div>

      <div className="flex flex-row gap-10">
        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[250px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl mt-2 font-bold">{users.length}</p>
            </div>
            <User className="w-12 h-12 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[250px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Problems</h2>
              <p className="text-3xl mt-2 font-bold">{totalProblems}</p>
            </div>
            <ListTodo className="w-12 h-12 text-green-400" />
          </div>
        </Card>

        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[250px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Contests</h2>
              <p className="text-3xl mt-2 font-bold">{totalContests}</p>
            </div>
            <Trophy className="w-12 h-12 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[250px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Discussions</h2>
              <p className="text-3xl mt-2 font-bold">{totalDiscussions}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-orange-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <Card className="bg-transparent w-full drop-shadow-lg border border-neutral-800 p-6 text-white col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            User Verification Status
          </h3>
          <div className="h-64">
            <Doughnut data={userVerificationData} options={doughnutOptions} />
          </div>
        </Card>

        <Card className="bg-transparent w-full drop-shadow-lg border border-neutral-800 p-6 text-white col-span-2">
          <h3 className="text-xl font-semibold mb-4">Playlist Distribution</h3>
          <div className="h-64">
            <Doughnut data={playlistData} options={doughnutOptions} />
          </div>
        </Card>

        <Card className="bg-transparent w-full drop-shadow-lg border border-neutral-800 p-6 text-white col-span-2">
          <h3 className="text-xl font-semibold mb-4">User Activity</h3>
          <div className="h-64">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </Card>

        <Card className="bg-transparent w-full drop-shadow-lg border border-neutral-800 p-6 text-white col-span-2">
          <h3 className="text-xl font-semibold mb-4">Streak Distribution</h3>
          <div className="h-64">
            <Bar data={streakDistribution} options={chartOptions} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[90%]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Playlists</h2>
              <p className="text-3xl mt-2 font-bold">{totalPlaylists}</p>
            </div>
            <BookOpen className="w-12 h-12 text-cyan-400" />
          </div>
        </Card>

        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[98%]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Active Users</h2>
              <p className="text-3xl mt-2 font-bold">{activeUsers}</p>
            </div>
            <TbFlameFilled className="w-12 h-12 text-emerald-400" />
          </div>
        </Card>

        <Card className="bg-transparent drop-shadow-lg border border-neutral-800 p-6 text-white w-[98%]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Verified Users</h2>
              <p className="text-3xl mt-2 font-bold">{verifiedUsers}</p>
            </div>
            <User className="w-12 h-12 text-amber-400" />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          User Management
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-sm shadow-neutral-700/50">
          <table className="min-w-full  text-white">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Avatar
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Verified
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Daily Streak
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Last Submission
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent drop-shadow-lg border border-neutral-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No users available.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-black font-semibold text-xl bg-white">
                          {user?.fullName.split("")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-4 py-3 font-medium">{user.fullName}</td>
                    <td className="px-4 py-3 text-blue-400">
                      @{user.username}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-xs font-semibold ${
                          user.isEmailVerified
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-yellow-600 hover:bg-yellow-500"
                        }`}
                      >
                        {user.isEmailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.dailyProblemStreak > 0 ? (
                        <div className="flex items-center gap-1">
                          <TbFlameFilled
                            className="text-orange-500"
                            size={18}
                          />
                          <span className="font-semibold">
                            {user?.dailyProblemStreak}
                          </span>
                        </div>
                      ) : (
                        <Badge className="bg-gray-600 text-xs">No streak</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.lastSubmissionDate
                        ? new Date(user.lastSubmissionDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
