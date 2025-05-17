import { Route, Routes } from "react-router-dom";
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

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("fetch user call")
    dispatch(fetchCurrentUser());
  }, []);
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
      </Route>
       <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
