import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbFlameFilled } from "react-icons/tb";
import { ListTodo, User } from "lucide-react";

type User = {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  email: string;
  isEmailVerified: boolean;
  isStreakMaintained: boolean;
  lastSubmissionDate: string | null;
  dailyProblemStreak: number;
};

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalProblems, setTotalProblems] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/auth/all/users",
          {
            withCredentials: true,
          }
        );
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchTotalProblems = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/problem/all-problems"
        );
        setTotalProblems(res.data.data.length);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchUsers();
    fetchTotalProblems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 p-6 border border-zinc-800 text-white shadow-sm shadow-blue-700 hover:shadow-blue-500/30 transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl mt-2">{users.length}</p>
            </div>
            <User className="w-10 h-10 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-zinc-900 p-6 border border-zinc-800   text-white shadow-sm shadow-green-700 hover:shadow-green-500/30 transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Total Problems</h2>
              <p className="text-3xl mt-2">{totalProblems}</p>
            </div>
            <ListTodo className="w-10 h-10 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">User List</h2>

        <div className="overflow-x-auto rounded-lg shadow-md  shadow-neutral-500">
          <table className="min-w-full divide-y divide-zinc-700 text-white">
            <thead className="bg-zinc-800">
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
            <tbody className="divide-y divide-zinc-700 bg-zinc-900">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No users available.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <Avatar className=" h-10 w-10 ">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-black font-semibold text-xl bg-white">
                          {user?.fullName.split("")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">@{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-xs ${
                          user.isEmailVerified
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {user.isEmailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.dailyProblemStreak > 0 ? (
                        <div className="flex gap-1">
                          <TbFlameFilled
                            className="text-blue-500 mt-1"
                            size={18}
                            data-tip="daily streak"
                          />
                          <span>{user?.dailyProblemStreak}</span>
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
