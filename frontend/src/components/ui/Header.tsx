import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { LogoutUser } from "@/redux/slices/auth/authThunks";
import { ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import { TbFlame, TbFlameFilled } from "react-icons/tb";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const Header = ({ children }: React.PropsWithChildren) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!userData && isAuthenticated) {
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
  const logout = async () => {
    try {
      const result = await dispatch(LogoutUser()).unwrap();
      ToastSuccess(result);
    } catch (error: any) {
      ToastError(
        error || error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  return (
    <>
      <nav className="text-white flex flex-row justify-between px-4 md:px-8 py-4 h-14 border-b border-neutral-800 sticky top-0 z-50  bg-opacity-90 backdrop-blur-sm">
        <div className="flex flex-row gap-5 items-center">
          <Link to="/">
            <svg
              width="200"
              height="90"
              viewBox="0 0 820 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1_3)">
                <path
                  d="M147.094 80.25H156.094V90.42L145.654 96.45H121.984L111.544 90.42V38.58L121.984 32.55H145.654L156.094 38.58V48.75H147.094V40.65H120.544V88.35H147.094V80.25ZM208.748 90.42L198.308 96.45H180.938L170.498 90.42V56.58L180.938 50.55H198.308L208.748 56.58V90.42ZM179.228 58.38V88.62H200.018V58.38H179.228ZM233.584 50.55H247.174L253.564 54.24V30.3H262.294V96.45H255.724L253.564 92.76L247.174 96.45H233.584L223.144 90.42V56.58L233.584 50.55ZM253.564 88.62V58.38H231.874V88.62H253.564ZM312.22 88.17V96H287.11L276.67 89.97V56.58L287.11 50.55H301.78L312.22 56.58V76.56H285.4V88.17H312.22ZM285.4 58.38V68.73H303.49V58.38H285.4ZM402.732 33L386.532 96H375.822L362.502 45.51H362.322L349.002 96H338.292L322.092 33H330.822L343.602 84.48H343.782L357.372 33H367.452L380.952 84.48H381.132L394.002 33H402.732ZM419.567 77.55V88.62H437.657V77.55H419.567ZM421.277 96.45L410.837 90.42V75.75L421.277 69.72H437.657V58.83H415.337V51H435.947L446.387 57.03V96.45H444.047L437.657 92.76L431.267 96.45H421.277ZM485.911 58.83H469.531V96H460.801V51H467.371L469.531 54.69L475.921 51H485.911V58.83ZM520.891 58.83H504.511V96H495.781V51H502.351L504.511 54.69L510.901 51H520.891V58.83ZM539.492 51V96H530.762V51H539.492ZM530.312 39.93V30.3H539.942V39.93H530.312ZM592.127 90.42L581.687 96.45H564.317L553.877 90.42V56.58L564.317 50.55H581.687L592.127 56.58V90.42ZM562.607 58.38V88.62H583.397V58.38H562.607ZM631.633 58.83H615.253V96H606.523V51H613.093L615.253 54.69L621.643 51H631.633V58.83ZM675.344 75.3V89.97L664.904 96H641.504V88.17H666.614V77.1H651.944L641.504 71.07V57.03L651.944 51H674.444V58.83H650.234V69.27H664.904L675.344 75.3Z"
                  fill="url(#paint0_linear_1_3)"
                />
                <path
                  d="M58.877 66.2988L85.4551 76.2246V86.6426L50.4688 71.5078V64.3711L58.877 66.2988ZM85.4551 58.2188L58.877 68.3086L50.4688 70.1133V62.9355L85.4551 47.8418V58.2188Z"
                  fill="#DFDFDF"
                />
                <path
                  d="M725.781 33.2812L703.223 98.127H694.979L717.537 33.2812H725.781ZM759.209 67.9395L732.221 58.1367V47.8008L767.822 62.9355V70.1543L759.209 67.9395ZM732.221 76.3477L759.25 66.2578L767.822 64.3301V71.5078L732.221 86.6426V76.3477Z"
                  fill="#DFDFDF"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_1_3"
                  x1="103"
                  y1="64.5"
                  x2="683"
                  y2="64.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#24B2F9" />
                  <stop offset="1" stop-color="#2097D3" />
                </linearGradient>
                <clipPath id="clip0_1_3">
                  <rect width="820" height="128" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              to="/problemset"
              className="hover:text-blue-400 transition-colors"
            >
              Problems
            </Link>

            <Link
              to="/discuss"
              className="hover:text-blue-400 transition-colors"
            >
              Discuss
            </Link>

            <Link to="/my-list" className="hover:text-blue-400 transition-colors">
              Sheets
            </Link>

            <Link to="/contest" className="hover:text-blue-400 transition-colors">
              Contests
            </Link>

            {/*  <Link
              to="/pricing"
              className="hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link> */}
          </div>
        </div>
        {children && <div className="mr-36 -mt-2">{children}</div>}

        <div  className="flex flex-row items-center gap-5 mr-3">
           <Link to="/profile" className="flex flex-row items-center gap-5">
          {userData && userData?.dailyProblemStreak > 0 ? (
            <div className="flex gap-1">
              <TbFlameFilled
                className="text-blue-400 mt-1"
                size={18}
                data-tip="daily streak"
              />
              <span>{userData?.dailyProblemStreak}</span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1 items-center">
                  <TbFlame className="text-white mt-1" size={18} />
                  <span>{userData?.dailyProblemStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-neutral-800 px-2.5 text-sm  py-2 mt-1 text-white leading-tight whitespace-nowrap">
                Solve one problem daily to refresh the streak
              </TooltipContent>
            </Tooltip>
          )}
          </Link>

            <Link to="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>

          {userData?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="bg-white text-neutral-950 font-semibold  border border-neutral-700 text-sm px-2.5 hover:bg-neutral-200 hover:border-neutral-900 rounded-lg py-1.5 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {userData ? (
            // <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 border-none">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="text-black font-semibold text-xl bg-white">
                      {userData?.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-black/80 text-white border border-neutral-800 z-50 mt-3 mr-5 w-64 p-3 rounded-lg shadow-lg">
                <div className="mb-3 border-b border-neutral-700 pb-3">
                  <p className="text-white font-semibold text-base truncate">
                    {userData.fullName}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {userData.email}
                  </p>
                </div>
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>

                {/* <Link to="/my-list">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <List className="w-4 h-4" />
                    My List
                  </DropdownMenuItem>
                </Link> */}

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer gap-2 text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                className="text-blue-50 bg-transparent px-6 cursor-pointer border-zinc-100 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
      {isAuthenticated && !userData?.isEmailVerified && (
        <div className="w-full bg-gradient-to-r from-cyan-900 via-blue-700 to-cyan-900 text-white text-center text-sm py-1.5 shadow-sm">
          📩 We’ve sent a verification email. Please verify your email to
          continue.
        </div>
      )}
    </>
  );
};
