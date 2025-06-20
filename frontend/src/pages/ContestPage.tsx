import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import API from "@/utils/AxiosInstance";
import ContestTimer from "@/components/ui/ContestTimer";
import { ClipLoader } from "react-spinners";
import type { Contest } from "@/types/contest/contest.Types";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Toast, ToastError } from "@/utils/ToastContainers";

export default function ContestListPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverOffset, setServerOffset] = useState(0);
  const userInfo = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      const res = await API.get("/contests/all");
      setContests(res.data.data);
    } catch (err) {
      console.error("Failed to fetch contests:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServerTime = async () => {
    try {
      const res = await API.get("/server-time");
      const serverNow = new Date(res.data.data.serverTime).getTime();
      const clientNow = Date.now();
      setServerOffset(serverNow - clientNow);
    } catch (error) {
      console.error("Failed to fetch contests:", error);
    }
  };

  useEffect(() => {

    fetchContests();
    fetchServerTime();

  }, []);

  const statusColors = {
    UPCOMING:
      "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/25",
    LIVE: "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25",
    ENDED:
      "bg-gradient-to-r from-neutral-600 to-neutral-700 shadow-slate-500/25",
  };

  const handleContest = (contest: Contest) => {
    if (!userInfo.isAuthenticated) {
      ToastError("Please register/login.");
    } else {
      navigate(`/contest/${contest.id}`);
    }
  };

  return loading ? (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ClipLoader size={50} color="#4F46E5" />
    </div>
  ) : (
    <>
      <Toast />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            CodeWarriors Contests
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Practice and compete in weekly curated challenges across DSA topics.
          </p>
        </div>

        {contests.some((c) => c.status === "LIVE") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-white">
                Live Contests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contests
                .filter((c) => c.status === "LIVE")
                .map((contest) => (
                  <Card
                    key={contest.id}
                    className="group w-full transition-all duration-300 bg-[#00030a] border-none shadow shadow-neutral-500 hover:shadow-lg hover:shadow-neutral-600 backdrop-blur-md cursor-pointer relative overflow-hidden"
                    onClick={() => handleContest(contest)}
                  >
                    <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">
                          {contest.title}
                        </h2>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white ${
                            statusColors[contest.status]
                          } shadow-md`}
                        >
                          {contest.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {contest.description || "No description provided."}
                      </p>
                      <div className="text-base flex flex-col gap-1 text-white">
                        <div className="flex items-center gap-2">
                          <Calendar size={20} className="text-rose-500" />
                          {new Date(contest.startTime).toLocaleString("en-IN", {
                            weekday: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZoneName: "short",
                          })}
                        </div>
                        <ContestTimer
                          startTime={contest.startTime}
                          endTime={contest.endTime}
                          serverOffset={serverOffset}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {contests.some((c) => c.status === "UPCOMING") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-white">
                Upcoming Contests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contests
                .filter((c) => c.status === "UPCOMING")
                .map((contest) => (
                  <Card
                    key={contest.id}
                    className="group w-full transition-all duration-300 bg-[#00030a] border-none shadow shadow-neutral-500 hover:shadow-md hover:shadow-neutral-600 backdrop-blur-md cursor-pointer relative overflow-hidden"
                    onClick={() => handleContest(contest)}
                  >
                    <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">
                          {contest.title}
                        </h2>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white ${
                            statusColors[contest.status]
                          } shadow-md`}
                        >
                          {contest.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 h-10 line-clamp-2">
                        {contest.description || "No description provided."}
                      </p>
                      <div className="text-base flex flex-col gap-1 text-white">
                        <div className="flex items-center gap-2">
                          <Calendar size={20} className="text-rose-500" />
                          {new Date(contest.startTime).toLocaleString("en-IN", {
                            weekday: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZoneName: "short",
                          })}
                        </div>
                        <ContestTimer
                          startTime={contest.startTime}
                          endTime={contest.endTime}
                          serverOffset={serverOffset}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {contests.some((c) => c.status === "ENDED") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-white">
                Past Contests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contests
                .filter((c) => c.status === "ENDED")
                .map((contest) => (
                  <Card
                    key={contest.id}
                    className="group w-full transition-all duration-300 bg-[#00030a] border-none shadow shadow-neutral-500 hover:shadow-md hover:shadow-neutral-600 backdrop-blur-md cursor-pointer relative overflow-hidden"
                    onClick={() => handleContest(contest)}
                  >
                    <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">
                          {contest.title}
                        </h2>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white ${
                            statusColors[contest.status]
                          } shadow-md`}
                        >
                          {contest.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 h-10">
                        {contest.description || "No description provided."}
                      </p>
                      <div className="text-base flex flex-col gap-1 text-white">
                        <div className="flex items-center gap-2">
                          <Calendar size={20} className="text-rose-500" />
                          {new Date(contest.startTime).toLocaleString("en-IN", {
                            weekday: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZoneName: "short",
                          })}
                        </div>
                        <ContestTimer
                          startTime={contest.startTime}
                          endTime={contest.endTime}
                          serverOffset={serverOffset}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
