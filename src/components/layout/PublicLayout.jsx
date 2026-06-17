import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Chatbot from "../common/Chatbot.jsx";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
