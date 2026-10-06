// components/AppLayout.jsx
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import { useIdleLogout } from "../hooks/useIdleLogout";
import "./AppLayout.css";

export default function AppLayout() {
  useIdleLogout();

  return (
    <div className="app-shell">
      <TopNav />
      <Sidebar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}