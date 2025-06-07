import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContributionCalendar from "@/components/ContributionGraph";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import API from "@/utils/AxiosInstance";
import ProgressChart from "@/components/ui/ProgressChart";
import type { ProgressData } from "@/types/problem/problemTypes";
import PasswordChangeModal from "@/components/ui/PasswordChangeModal";
import { Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Submission } from "@/types/submit/SubmissionTypes";
import ChartAnalysis from "@/components/ChartAnalysis";
import { LineAnalysis } from "@/components/LineAnalysis";

const ProfilePage = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const username = userData?.username ?? "";
  const fullName = userData?.fullName ?? "";
  const email = userData?.email ?? "";
  const avatar = userData?.avatar ?? "";
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [openModal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allSubmission, setAllSubmissions] = useState<Submission[]>([]);

  const totalProblems = 33;

  const progressData: ProgressData = submissions.reduce(
    (acc, submission) => {
      const difficulty = submission.problem.difficulty;

      if (difficulty === "EASY") acc.easyProblems += 1;
      else if (difficulty === "MEDIUM") acc.medProblems += 1;
      else if (difficulty === "HARD") acc.hardProblems += 1;

      return acc;
    },
    {
      totalProblems,
      easyProblems: 0,
      medProblems: 0,
      hardProblems: 0,
      solvedProblems: 0,
    }
  );

  progressData.solvedProblems =
    progressData.easyProblems +
    progressData.medProblems +
    progressData.hardProblems;

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await API.get("/submission/all", {
          withCredentials: true,
        });

        setAllSubmissions(res.data.data);

        const data = res.data.data.filter(
          (submission: Submission) => submission.status === "Accepted"
        );

        const latestMap = new Map();

        for (const sub of data) {
          const existing = latestMap.get(sub.problem.id);
          if (
            !existing ||
            new Date(sub.createdAt) > new Date(existing.createdAt)
          ) {
            latestMap.set(sub.problem.id, sub);
          }
        }
        const uniqueLatestSubmissions = Array.from(latestMap.values()).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setSubmissions(uniqueLatestSubmissions.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleModal = () => {
    setModal(true);
  };

  const langColor: { [key: string]: string } = {
    javascript: "text-amber-600",
    python: "text-green-600",
    cpp: "text-purple-400",
    java: "text-rose-400",
  };

  return (
    <div className="flex flex-col items-center min-h-screen  p-4">
      {loading ? (
        <div className="text-gray-500 flex justify-center items-center">
          No Profile Page Found
        </div>
      ) : (
        <div className="w-full max-w-6xl  p-6 rounded-lg  ">
          <div className="flex items-center gap-4 justify-between mb-6 border-b border-b-gray-700 pb-4">
            <div className="flex items-center gap-4">
              <Avatar className=" h-18 w-18 rounded-xl object-cover border-none">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-black font-semibold text-xl bg-white">
                  {fullName.split("")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{fullName}</h2>
                <p className="text-gray-500">{email}</p>
                <p className="text-sm text-gray-400">@{username}</p>
              </div>
            </div>
            <Button onClick={handleModal}>Change Password</Button>
          </div>

          {openModal && (
            <PasswordChangeModal
              onClose={() => {
                setModal(false);
              }}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-3  items-start mb-4">
            <ProgressChart progressData={progressData} />
            <div className="bg-transparent   drop-shadow-lg border border-neutral-800 text-white p-6 rounded-2xl flex flex-col items-center justify-center w-full h-full  transition duration-300 ease-in-out">
              <h2 className="text-xl font-semibold mb-2">🔥 Daily Streak</h2>

              <div className="text-5xl font-bold text-green-400 animate-pulse">
                {userData?.dailyProblemStreak}
              </div>
              <p className="mt-1 text-gray-400 text-sm">Days in a row</p>

         
              <div className="flex gap-1 mt-4">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded ${
                      i < (userData?.dailyProblemStreak ?? 0) % 7 ? "bg-green-400" : "bg-neutral-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <LineAnalysis submissions={allSubmission} />
            <ChartAnalysis submissions={allSubmission} />
          </div>

          <div className="mb-8 bg-transparent  drop-shadow-lg border border-neutral-800 flex justify-center h-[280px] rounded-xl">
            <ContributionCalendar submissions={allSubmission} />
          </div>

          <div className="rounded-lg bg-transparent  drop-shadow-lg border border-neutral-800   mb-4 mt-20 px-8 py-8">
            <h3 className="text-lg font-semibold mt  bg-neutral-900/80 border border-neutral-800 w-[120px] px-2 py-2 rounded-xl flex items-center justify-center text-center">
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
                      <span
                        className={`font-medium text-sm ${
                          langColor[sub.language.toLowerCase()]
                        }`}
                      >
                        {sub.language}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          sub.status === "Accepted"
                            ? "bg-green-700 text-zinc-100"
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
                      <span className="flex justify-center">
                        Memory: {sub.memory}{" "}
                        <span>
                          <Dot
                            size={26}
                            className="-mt-1 -ml-1 text-blue-600"
                          />
                        </span>
                      </span>
                      <span className="flex justify-center">
                        Time: {sub.time}{" "}
                        <span>
                          <Dot
                            size={26}
                            className="-mt-1 -ml-1 text-[#05db4d]"
                          />
                        </span>
                      </span>
                      <span className="flex justify-center">
                        Submitted: {new Date(sub.createdAt).toLocaleString()}
                        <span>
                          <Dot
                            size={26}
                            className="-mt-1 -ml-1 text-[#b8e113]"
                          />
                        </span>
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
