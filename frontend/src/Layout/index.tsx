import { matchPath, Outlet, useLocation, useParams } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

const Layout = () => {
  const params = useParams();
  const location = useLocation();
 const isProblemPage =
  matchPath("/problem/:id", location.pathname) || matchPath("/contest/:contestId/problem/:id", location.pathname) ||
  location.pathname === "/problem";

  const { problemId } = params;
  return (
    <>
      {!isProblemPage && <Header />}
      <Outlet />
      {problemId ? null : <Footer />}
    </>
  );
};

export default Layout;
