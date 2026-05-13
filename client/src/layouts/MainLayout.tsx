import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ padding: 20, background: "#f5f6fa", flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}