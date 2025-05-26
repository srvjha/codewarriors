import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContributionCalendar from "@/components/ContributionGraph";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import API from "@/utils/AxiosInstance";

type Submission = {
  id: string;
  language: string;
  sourceCode: string;
  status: string;
  memory: string;
  time: string;
  createdAt: string;
  problem: {
    [key: string]: string;
  };
};

const ProfilePage = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const username = userData?.username ?? "";
  const fullName = userData?.fullName ?? "";
  const email = userData?.email ?? "";
  const avatar = userData?.avatar ?? "";
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  

  useEffect(()=>{
 const fetchSubmissions = async () => {
  try {
    const res = await API.get("/submission/all", {
      withCredentials: true,
    });

    const data = res.data.data.filter((submission:Submission)=>submission.status === "Accepted")

    const latestMap = new Map();

    for (const sub of data) {
      const existing = latestMap.get(sub.problem.id);
      if (!existing || new Date(sub.createdAt) > new Date(existing.createdAt)) {
        latestMap.set(sub.problem.id, sub);
      }
    }
    const uniqueLatestSubmissions = Array.from(latestMap.values()).sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setSubmissions(uniqueLatestSubmissions.slice(0, 10));

  } catch (error) {
    console.error("Failed to fetch submissions", error);
  }
};

fetchSubmissions();
},[])


  return (
    <div className="flex flex-col items-center min-h-screen  p-4">
      <div className="w-full max-w-5xl  p-6 rounded-lg shadow-lg shadow-neutral-800 ">
        {/* User Info */}
        <div className="flex items-center gap-4 justify-between mb-6 border-b border-b-gray-700 pb-4">
          <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={`${username} avatar`}
            className="w-18 h-18 rounded-xl object-cover border-none"
          />
          <div>
            <h2 className="text-2xl font-semibold">{fullName}</h2>
            <p className="text-gray-500">{email}</p>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
          </div>
          <Button>Change Password</Button>
        </div>

        {/* Contribution Graph */}
        <div className="mb-8 shadow-lg shadow-neutral-900 h-[300px]">
          <ContributionCalendar />
        </div>

        {/* Submissions List */}
        <div className="rounded-lg shadow-lg shadow-neutral-900  mb-4 mt-20 px-8 py-8">
          <h3 className="text-lg font-semibold mt  bg-neutral-900 w-[120px] px-2 py-2 rounded-xl flex items-center justify-center text-center">
            Recent AC
          </h3>
          <ul className="space-y-4 ">
            {submissions.length === 0 ? (
              <p className="text-gray-500">No submissions found.</p>
            ) : (
              submissions.map((sub) => (
                <li
                  key={sub.id}
                  className="p-4 bg-neutral-900 mt-6 rounded-lg "
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-gray-100">
                      Language: {sub.language}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        sub.status === "Accepted"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-200 mt-1 truncate">
                    {sub.problem.title}
                  </p>
                  <div className="text-xs text-gray-500 mt-2 flex gap-4">
                    <span>Memory: {sub.memory}</span>
                    <span>Time: {sub.time}</span>
                    <span>
                      Submitted: {new Date(sub.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
