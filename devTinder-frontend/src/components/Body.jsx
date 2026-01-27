import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../hooks/useAuth";

const Body = () => {
  useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="flex-1 bg-black">
        <image href="">
          <Outlet/>
        </image>
      </main>

      <Footer />
    </div>
  );
};

export default Body;
