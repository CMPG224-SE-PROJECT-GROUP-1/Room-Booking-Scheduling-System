import { Outlet } from "react-router-dom";
import Banner from "./Banner";
import "./BannerLayout.css";

export default function BannerLayout() {
  return (
    <div className="banner-shell">
      <Banner/>
      <main className="banner-content">
        <Outlet />
      </main>
    </div>
  );
}