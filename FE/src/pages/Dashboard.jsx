import React, { useState } from "react";
import "./Dashboard.css";
import ReportsDashboard from "./ReportsDashboard"; // 👈 import màn báo cáo
import Account from "./Account"; // 👈 import Account
import Home from "./Home";   // 👈 file Home.jsx bạn vừa tạo
import Vehicles from "./Vehicles";
import Drivers from "./Drivers";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("home"); // 👈 state chọn menu

  const getNavItemClass = (key) =>
    "dashboard-nav-item" + (activeMenu === key ? " is-active" : "");

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">🚚</div>
          <div className="dashboard-logo-text">
            <span className="dashboard-logo-title">FMS</span>
            <span className="dashboard-logo-subtitle">Fleet Manager</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button
            className={getNavItemClass("home")}
            onClick={() => setActiveMenu("home")}
          >
            <span className="dashboard-nav-icon">🏠</span>
            <span className="dashboard-nav-label">Trang chủ</span>
          </button>

          <button
            className={getNavItemClass("vehicles")}
            onClick={() => setActiveMenu("vehicles")}
          >
            <span className="dashboard-nav-icon">🚛</span>
            <span className="dashboard-nav-label">Quản lý phương tiện</span>
          </button>

          <button
            className={getNavItemClass("drivers")}
            onClick={() => setActiveMenu("drivers")}
          >
            <span className="dashboard-nav-icon">👨‍✈️</span>
            <span className="dashboard-nav-label">Quản lý tài xế</span>
          </button>

          <button
            className={getNavItemClass("trips")}
            onClick={() => setActiveMenu("trips")}
          >
            <span className="dashboard-nav-icon">🧭</span>
            <span className="dashboard-nav-label">Quản lý chuyến đi</span>
          </button>

          <button
            className={getNavItemClass("fuel")}
            onClick={() => setActiveMenu("fuel")}
          >
            <span className="dashboard-nav-icon">⛽</span>
            <span className="dashboard-nav-label">Quản lý nhiên liệu</span>
          </button>

          <button
            className={getNavItemClass("maintenance")}
            onClick={() => setActiveMenu("maintenance")}
          >
            <span className="dashboard-nav-icon">🛠️</span>
            <span className="dashboard-nav-label">Bảo dưỡng</span>
          </button>

          <button
            className={getNavItemClass("gps")}
            onClick={() => setActiveMenu("gps")}
          >
            <span className="dashboard-nav-icon">📡</span>
            <span className="dashboard-nav-label">GPS / Tracking</span>
          </button>

          <button
            className={getNavItemClass("reports")}
            onClick={() => setActiveMenu("reports")}
          >
            <span className="dashboard-nav-icon">📊</span>
            <span className="dashboard-nav-label">Báo cáo &amp; Thống kê</span>
          </button>

          <button
            className={getNavItemClass("account")}
            onClick={() => setActiveMenu("account")}
          >
            <span className="dashboard-nav-icon">⚙️</span>
            <span className="dashboard-nav-label">Tài khoản</span>
          </button>
        </nav>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-user">
            <div className="dashboard-user-avatar">A</div>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">Admin User</span>
              <span className="dashboard-user-email">admin@example.com</span>
            </div>
          </div>

          <button className="dashboard-logout">
            <span className="dashboard-logout-icon">↩</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {activeMenu === "reports" ? (
          <ReportsDashboard />

        ) : activeMenu === "account" ? (
          <Account />

        ) : activeMenu === "home" ? (
          <Home />                // 👈 HIỂN THỊ TRANG HOME THẬT Ở ĐÂY

        ) : activeMenu === "vehicles" ? (
          <Vehicles />                // 👈 HIỂN THỊ TRANG Vehicles

        ) : activeMenu === "drivers" ? (
          <Drivers />                // 👈 HIỂN THỊ TRANG Vehicles

        ) : (
          <div className="dashboard-empty-state">
            {activeMenu === "vehicles" && <h2>Quản lý phương tiện</h2>}
            {activeMenu === "drivers" && <h2>Quản lý tài xế</h2>}
            {activeMenu === "trips" && <h2>Quản lý chuyến đi</h2>}
            {activeMenu === "fuel" && <h2>Quản lý nhiên liệu</h2>}
            {activeMenu === "maintenance" && <h2>Bảo dưỡng</h2>}
            {activeMenu === "gps" && <h2>GPS / Tracking</h2>}
            {activeMenu === "reports" && <h2>Báo cáo và thống kê</h2>}
            {activeMenu === "account" && <h2>Quản lý tài khoản</h2>}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
