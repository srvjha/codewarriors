import { Outlet, useParams } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

const Layout = () => {
  const params = useParams();
  const { problemId } = params;
  console.log("problemId", problemId);
  return (
    <>
      <Header />
      <Outlet />
      {problemId ? null:(
         <Footer />
      )}
     
    </>
  );
};

export default Layout;
