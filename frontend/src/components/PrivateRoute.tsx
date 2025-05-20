import type { RootState } from "@/redux/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const {  isAuthenticated,isError } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("Private route Auth: ", isAuthenticated);
  console.log("Private route Error: ", isError);
   
  if (!isAuthenticated && !isError) {
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
