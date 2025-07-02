import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Calendar, Check, Clock } from "lucide-react";
import ContestTimer from "@/components/ui/ContestTimer";
import {  ClipLoader } from "react-spinners";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import UnregisterDialog from "@/components/ui/UnRegisteredDialog";
import type { Contest, ContestSubmission } from "@/types/contest/contest.Types";

export default function ContestDetailPage() {
  const { contestId: id } = useParams();
  const [contest, setContest] = useState<Contest | null>(null);
  const [contestSubmission, setContestSubmission] = useState<string[]>([]);
  const [serverOffset, setServerOffset] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await API.get(`/contests/${id}`);
        setContest(res.data.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          ToastError("Contest not found");
        } else {
          ToastError("Failed to fetch contest details");
        }
      }
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

  const handleSolve = (problemId: string) => {
    if (!registered) {
      ToastError("You must register for the contest to solve problems.");
      return;
    }
    navigate(`/contest/${id}/problem/${problemId}`);
  };

  useEffect(() => {
    const getContestProblemsDetails = async () => {
      try {
        const res = await API.get(`/contests/${id}/submissions/details`);
        if (res.status) {
          const data = res.data.data;
          const submittedProblems = data.map(
            (problem: ContestSubmission) => problem.problemId
          );
          setContestSubmission(submittedProblems);
        }
      } catch (error: any) {
        ToastError(error.response.data.error);
      }
    };
    getContestProblemsDetails();
  }, []);

  if (!contest)
 {
    return (
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
    );
 }
   

  return (
    <>
      <Toast />
      <div className="bg-gradient-to-b from-gray-950/20 via-blue-950/20 to-neutral-950 min-h-[calc(100vh-60px)]">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-white ">
        <div>
        <h1 className="text-5xl h-14 font-semibold bg-gradient-to-r from-blue-500 via-sky-400 to-blue-200 text-transparent bg-clip-text">
  {contest.title}
</h1>

          <p className="text-slate-300 mt-2 text-lg">{contest.description}</p>
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
                className="bg-transparent border border-neutral-600 text-blue-400 hover:bg-transparent hover:cursor-pointer hover:text-blue-600 w-32 h-10 rounded-full text-base"
                onClick={handleRegister}
              >
                {loading ? "Registering..." : "</> Register"}
              </Button>
            ) : (
              <UnregisterDialog
                onConfirm={handleUnregister}

                trigger={
                  <Button className="bg-transparent border border-neutral-600 text-green-600 hover:bg-transparent hover:cursor-pointer hover:text-green-700 w-32 h-10 rounded-full text-base">
                    <Check className="font-bold text-xl"/>
                    Registered
                  </Button>
                }
              />
            )}

           
          </>
        )}

        {contest.status === "LIVE" && (
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
                    <Button
                      asChild
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {!contestSubmission.includes(entry.problem.id) ? (
                        <div onClick={() => handleSolve(entry.problem.id)}>
                          Solve
                        </div>
                      ) : (
                        <div className="bg-emerald-700 hover:bg-emerald-600">
                          Solved
                        </div>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {contest.status === "ENDED" && (
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
                    <Button
                      asChild
                      className="border-neutral-600 bg-zinc-100 hover:bg-zinc-200 text-neutral-800"
                    >
                      <Link to={`/contest/problem/${entry.problem.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

         <div className="bg-transparent p-3 space-y-4 mt-3">
              <h2 className="text-xl font-semibold">Contest Guidelines</h2>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>
                  The contest will start at the scheduled time. Be punctual.
                </li>
                <li>
                  Each problem carries specific points. Solve as many as you
                  can.
                </li>
                <li>
                  You can submit multiple times — only the best score is
                  considered.
                </li>
                <li>Plagiarism will result in disqualification.</li>
                <li>Leaderboard will be available after the contest ends.</li>
              </ul>
            </div>
      </div>
      </div>
    </>
  );
}
