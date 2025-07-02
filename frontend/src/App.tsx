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
import PricingPage from "./pages/PricingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import DiscussPage from "./pages/DiscussPage";
import ProfilePage from "./pages/ProfilePage";
import CreateProblem from "./pages/CreateProblem";
import VerifyEmail from "./pages/VerifyEmail";
import PlaylistPage from "./pages/PlaylistPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import ResetForgotPassword from "./pages/ResetForgotPassword";
import { NotFoundPage } from "./pages/NotFoundPage";
import DiscussCreatePage from "./pages/DiscussCreatePage";
import DiscussUpdatePage from "./pages/DiscussUpdatePage";
import PostPage from "./pages/PostPage";
import SheetPage from "./pages/SheetPage";
import ContestPage from "./pages/ContestPage";
import ContestDetailPage from "./pages/ContestDetailPage";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const excludedPaths = ["/login", "/register"];

  useEffect(() => {
    if (!excludedPaths.includes(location.pathname)) {
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
              <ProblemPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contest/:contestId/problem/:problemId"
          element={
            <PrivateRoute>
              <ProblemPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/discuss" element={<DiscussPage />} />

        <Route
          path="/discuss/create"
          element={
            <PrivateRoute>
              <DiscussCreatePage />
            </PrivateRoute>
          }
        />
        <Route path="/discuss/:postid" element={<PostPage />} />
        <Route
          path="/discuss/edit/:postid"
          element={
            <PrivateRoute>
              <DiscussUpdatePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-list"
          element={
            
              <PlaylistPage />
          
          }
        />

        <Route
          path="/create/problem"
          element={
            <PrivateRoute>
              <CreateProblem />
            </PrivateRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/reset-password/:token"
          element={
            <PrivateRoute>
              <ResetPasswordPage />
            </PrivateRoute>
          }
        />

        <Route path="/verify/:token" element={<VerifyEmail />} />

        <Route
          path="/forgot/password/:token"
          element={<ResetForgotPassword />}
        />
        <Route path="/:sheetname/:id" element={<SheetPage />} />

        <Route path="/contest" element={<ContestPage />} />

        <Route path="/contest/:contestId" element={<ContestDetailPage />} />

        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
