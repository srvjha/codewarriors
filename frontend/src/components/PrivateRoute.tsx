import type { RootState } from "@/redux/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { userData, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
   console.log("isAuth: ",isAuthenticated)
  if (!userData) {
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

  return isAuthenticated ? children : <Navigate to="/login" />;
};
