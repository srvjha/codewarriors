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
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";

export const Header = () => {

      const dispatch = useDispatch<AppDispatch>()
     const {userData,isAuthenticated} = useSelector((state: RootState) => state.auth); 
     console.log("user header: ",userData);
     console.log("is authe: ",isAuthenticated)
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
         
           const result = await dispatch(LogoutUser())
           if(LogoutUser.fulfilled.match(result)){     
           ToastSuccess(result.payload);
           } else{
             ToastError(`${result.payload}`);
           }
        
       };
  return (
     <nav className="text-white flex flex-row justify-between px-4 md:px-8 py-4 h-16 border-b border-neutral-800 sticky top-0 z-50  bg-opacity-90 backdrop-blur-sm">
          <div className="flex flex-row gap-5 items-center">
            <Link to="/">
            <img
              src="/codewarriorblue.png"
              alt="Code Warrior"             
              className="h-6 w-auto"
            />
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/problemset"
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
          <div className="flex flex-row items-center gap-5 mr-2">
            {/* <Link to="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link> */}
            {userData ? (
              // <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Avatar className=" h-10 w-10 ">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="text-black font-semibold text-xl">
                      {userData?.fullName.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <LogOut />
                    <div onClick={() => logout()}>Logout</div>
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
  )
}

