import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { PrivateRoute } from "./components/PrivateRoute";
import ProblemsetPage from "./pages/ProblemsetPage";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { fetchCurrentUser } from "./redux/slices/auth/authThunks";
import { useEffect } from "react";
import Layout from "./Layout";
import ProblemPage from "./pages/ProblemPage";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    const excludedPaths = ["/login","/register"];
    if (!excludedPaths.includes(location.pathname)) {
      console.log("fetch user call");
      dispatch(fetchCurrentUser());
    }
  }, [location.pathname]); 

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/problemset"
          element={
            <PrivateRoute>
              <ProblemsetPage />
            </PrivateRoute>
          }
        />
         <Route
          path="/problem/:problemId"
          element={
            <PrivateRoute>
            <ProblemPage/>
            </PrivateRoute>
          }
        />
      </Route>

     
     
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
