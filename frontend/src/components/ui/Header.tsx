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
import { List, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import { TbFlame, TbFlameFilled } from "react-icons/tb";

export const Header = () => {
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
    const result = await dispatch(LogoutUser());
    if (LogoutUser.fulfilled.match(result)) {
      ToastSuccess(result.payload);
    } else {
      ToastError(`${result.payload}`);
    }
  };
  return (
    <>
      <nav className="text-white flex flex-row justify-between px-4 md:px-8 py-4 h-14 border-b border-neutral-800 sticky top-0 z-50  bg-opacity-90 backdrop-blur-sm">
        <div className="flex flex-row gap-5 items-center">
          <Link to="/">
            <img
              src="/codewarrior_logo.png"
              alt="Code Warrior"
              className="h-6 w-auto"
            />
          </Link>
          <div className="hidden md:flex space-x-6">
           

            {/* <Link
              to="/discuss"
              className="hover:text-blue-400 transition-colors"
            >
              Discuss
            </Link>
            <Link
              to="/pricing"
              className="hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link> */}
          </div>
        </div>
        <div className="flex flex-row items-center gap-5 mr-3">
          {userData && userData?.dailyProblemStreak > 0 ? (
            <div className="flex gap-1">
              <TbFlameFilled
                className="text-blue-500 mt-1"
                size={18}
                data-tip="daily streak"
              />
              <span>{userData?.dailyProblemStreak}</span>
            </div>
          ) : (
            <div className="flex gap-1">
              <TbFlame
                className="text-white mt-1"
                size={18}
                data-tip="daily streak"
              />
              <span>{userData?.dailyProblemStreak}</span>
            </div>
          )}

           <Link
              to="/problemset"
              className="hover:text-blue-400 transition-colors"
            >
              Problems
            </Link>

          <Link to="/about" className="hover:text-blue-400 transition-colors">
            About
          </Link>
          {userData?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="bg-cyan-800 border border-cyan-700 text-sm px-2.5 hover:bg-cyan-700 hover:border-cyan-900 rounded-lg py-1.5 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {userData ? (
            // <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <div className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 border-none">
                <Avatar className=" h-10 w-10 ">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-black font-semibold text-xl bg-white">
                    {userData?.fullName.split("")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black text-white border-none shadow-sm shadow-gray-800 z-50">
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer"> 
                    <User />
                    Profile
                  </DropdownMenuItem>
                </Link>
                 <Link to="/my-list">
                <DropdownMenuItem className="cursor-pointer">
                  <List />
                 
                    My List
                  
                </DropdownMenuItem>
                </Link>
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  <div onClick={() => logout()} className="cursor-pointer">
                    Logout
                  </div>
                </DropdownMenuItem>
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
      {isAuthenticated && !userData?.isEmailVerified && (
        <div className="w-full bg-gradient-to-r from-cyan-900 via-blue-700 to-cyan-900 text-white text-center text-sm py-1.5 shadow-sm">
          📩 We’ve sent a verification email. Please verify your email to
          continue.
        </div>
      )}
    </>
  );
};
