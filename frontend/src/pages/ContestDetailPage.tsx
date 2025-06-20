import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Calendar, Clock } from "lucide-react";
import ContestTimer from "@/components/ui/ContestTimer";
import { BeatLoader } from "react-spinners";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import UnregisterDialog from "@/components/ui/UnRegisteredDialog";
import type { Contest } from "@/types/contest/contest.Types";





export default function ContestDetailPage() {
  const { contestId: id } = useParams();
  const [contest, setContest] = useState<Contest | null>(null);
  const [serverOffset, setServerOffset] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await API.get(`/contests/${id}`);
        console.log(res.data.data);
        setContest(res.data.data);
      } catch (err) {}
    };

    const fetchServerTime = async () => {
      try {
        const res = await API.get("/server-time");
        const serverNow = new Date(res.data.data.serverTime).getTime();
        const clientNow = Date.now();
        setServerOffset(serverNow - clientNow);
      } catch (err) {}
    };

    fetchServerTime();
    fetchContest();
  }, [id]);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const res = await API.get(`/contests/${id}/registration-status`);
        if (res.data.message === "User is registered") {
          setRegistered(true);
        } else {
          setRegistered(false);
        }
      } catch (error: any) {
        ToastError(error.response.data.error);
      }
    };

    fetchRegistrationStatus();
  }, [id]);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/contests/${id}/register/user`, {
        withCredentials: true,
      });
      if (res.data.success) {
        ToastSuccess("Registered successfully!");
        setRegistered(true);
      }
    } catch (error: any) {
      if (
        error?.response?.data?.error === "Already registered for this contest"
      ) {
        ToastError("You are already registered for this contest.");
        setRegistered(true);
      } else {
        ToastError(error?.response?.data?.error || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    try {
      const res = await API.delete(`/contests/${id}/register/user`, {
        withCredentials: true,
      });
      if (res.data.success) {
        ToastSuccess("Unregistered successfully!");
        setRegistered(false);
      }
    } catch (error: any) {
      ToastError(error?.response?.data?.message || "Unregistration failed");
    }
  };

  const handleSolve = (id:string)=>{
    if(!registered) {
      ToastError("You must register for the contest to solve problems.");
      return;
    }
    navigate(`/contest/problem/${id}`)
  }

  if (!contest)
    return (
      <div className="text-center text-white">
        <BeatLoader />
      </div>
    );

  return (
    <>
      <Toast />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-white">
        <div>
          <h1 className="text-4xl font-bold">{contest.title}</h1>
          <p className="text-slate-400 mt-2">{contest.description}</p>
        </div>

        <div className="flex flex-wrap gap-6 text-base">
          <div className="flex items-center gap-2">
            <Calendar className="text-rose-500" size={20} />
            Start: {new Date(contest.startTime).toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-green-400" size={20} />
            Duration:{" "}
            {Math.floor(
              (new Date(contest.endTime).getTime() -
                new Date(contest.startTime).getTime()) /
                60000
            )}{" "}
            minutes
          </div>
          <ContestTimer
            startTime={contest.startTime}
            endTime={contest.endTime}
            serverOffset={serverOffset}
          />
        </div>

        {contest.status === "UPCOMING" && (
          <>
            {!registered ? (
              <Button
                disabled={loading}
                className="bg-green-100 text-green-800 hover:bg-green-200 w-32 h-10 rounded-full text-base"
                onClick={handleRegister}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            ) : (
              <UnregisterDialog
                onConfirm={handleUnregister}
                trigger={
                  <Button className="bg-red-100 text-red-800 hover:bg-red-200 w-32 h-10 rounded-full text-base">
                    Registered
                  </Button>
                }
              />
            )}

            <div className="bg-transparent p-3 space-y-4 mt-3">
              <h2 className="text-xl font-semibold">Contest Guidelines</h2>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>The contest will start at the scheduled time. Be punctual.</li>
                <li>
                  Each problem carries specific points. Solve as many as you can.
                </li>
                <li>
                  You can submit multiple times — only the best score is
                  considered.
                </li>
                <li>Plagiarism will result in disqualification.</li>
                <li>Leaderboard will be available after the contest ends.</li>
              </ul>
            </div>
          </>
        )}
        
         {(contest.status === "LIVE") && (
          <div>
            <div className="mb-10">
             {!registered ? (
              <Button
                disabled={loading}
                className="bg-green-100 text-green-800 hover:bg-green-200 w-32 h-10 rounded-full text-base"
                onClick={handleRegister}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            ) : (
              <UnregisterDialog
                onConfirm={handleUnregister}
                trigger={
                  <Button className="bg-red-100 text-red-800 hover:bg-red-200 w-32 h-10 rounded-full text-base">
                    Registered
                  </Button>
                }
              />
            )}
            </div>

            <h2 className="text-2xl font-semibold mb-4">Problems</h2>
            <div className="space-y-4">
              {contest.problems.map((entry) => (
                <Card
                  key={entry.problem.id}
                  className="p-4 w-full flex items-center justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 cursor-pointer"
                >
                  <div>
                    <h3 className="text-lg font-medium">
                      {entry.order + 1}. {entry.problem.title}
                    </h3>
                    {entry.points !== undefined && (
                      <p className="text-sm text-slate-400">
                        Points: {entry.points}
                      </p>
                    )}
                  </div>
                  <div>
                    {contest.status === "LIVE" ? (
                      <Button
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <div onClick={()=>handleSolve(entry.problem.id)}>Solve</div>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="border-neutral-600 bg-zinc-100 hover:bg-zinc-200 text-neutral-800"
                      >
                        <Link to={`/problem/${entry.problem.id}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {(contest.status === "ENDED") && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Problems</h2>
            <div className="space-y-4">
              {contest.problems.map((entry) => (
                <Card
                  key={entry.problem.id}
                  className="p-4 w-full flex items-center justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 cursor-pointer"
                >
                  <div>
                    <h3 className="text-lg font-medium">
                      {entry.order + 1}. {entry.problem.title}
                    </h3>
                    {entry.problem.points !== undefined && (
                      <p className="text-sm text-slate-400">
                        Points: {entry.problem.points}
                      </p>
                    )}
                  </div>
                  <div>
                    {contest.status === "LIVE" ? (
                      <Button
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Link to={`/contest/problem/${entry.problem.id}`}>Solve</Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="border-neutral-600 bg-zinc-100 hover:bg-zinc-200 text-neutral-800"
                      >
                        <Link to={`/contest/problem/${entry.problem.id}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
