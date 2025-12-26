import React, { useState } from "react";
import "./Dashboard.css";
import Account from "./Account";
import Home from "./Home";
import Vehicles from "./Vehicles";
import Drivers from "./Drivers";
import VehicleHistory from "./VehicleHistory";
const LazyDriverHistory = React.lazy(() => import("./DriverHistory"));
import TripManagement from "./TripManagement";
import DriverAssignment from "./DriverAssignment";
import Bookings from "./Bookings";
import Orders from "./Orders";
import Emergency from "./Emergency";
import Maintenance from "./Maintenance";

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
            <span className="dashboard-logo-subtitle">Fleet Management</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button
            className={getNavItemClass("home")}
            onClick={() => setActiveMenu("home")}
          >
            <span className="dashboard-nav-icon">🏠</span>
            <span className="dashboard-nav-label">Tổng quan</span>
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
            className={getNavItemClass("bookings")}
            onClick={() => setActiveMenu("bookings")}
          >
            <span className="dashboard-nav-icon">📅</span>
            <span className="dashboard-nav-label">Lịch đặt trước</span>
          </button>

          <button
            className={getNavItemClass("orders")}
            onClick={() => setActiveMenu("orders")}
          >
            <span className="dashboard-nav-icon">📦</span>
            <span className="dashboard-nav-label">Quản lý đơn hàng</span>
          </button>

          <button
            className={`${getNavItemClass("emergency")} emergency-item`}
            onClick={() => setActiveMenu("emergency")}
          >
            <span className="dashboard-nav-icon">⚠️</span>
            <span className="dashboard-nav-label">Báo cáo khẩn cấp</span>
          </button>

          <button
            className={getNavItemClass("maintenance")}
            onClick={() => setActiveMenu("maintenance")}
          >
            <span className="dashboard-nav-icon">🛠️</span>
            <span className="dashboard-nav-label">Bảo trì &amp; Sửa chữa</span>
          </button>

          <button
            className={getNavItemClass("vehicleHistory")}
            onClick={() => setActiveMenu("vehicleHistory")}
          >
            <span className="dashboard-nav-icon">🚗</span>
            <span className="dashboard-nav-label">Lịch sử xe</span>
          </button>

          <button
            className={getNavItemClass("driverHistory")}
            onClick={() => setActiveMenu("driverHistory")}
          >
            <span className="dashboard-nav-icon">🕒</span>
            <span className="dashboard-nav-label">Lịch sử tài xế</span>
          </button>

          <button
            className={getNavItemClass("assignments")}
            onClick={() => setActiveMenu("assignments")}
          >
            <span className="dashboard-nav-icon">👥</span>
            <span className="dashboard-nav-label">Phân công tài xế</span>
          </button>
        </nav>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-user">
            <div className="dashboard-user-avatar">T</div>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">Trần Thị Bình</span>
              <span className="role-badge">Quản lý</span>
            </div>
          </div>

          <button className="dashboard-logout">
            <span className="dashboard-logout-icon">↩</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {activeMenu === "home" ? (
          <Home />
        ) : activeMenu === "vehicles" ? (
          <Vehicles />
        ) : activeMenu === "drivers" ? (
          <Drivers />
        ) : activeMenu === "vehicleHistory" ? (
          <VehicleHistory />
        ) : activeMenu === "driverHistory" ? (
          <React.Suspense fallback={null}><LazyDriverHistory /></React.Suspense>
        ) : activeMenu === "trips" ? (
          <TripManagement />
        ) : activeMenu === "assignments" ? (
          <DriverAssignment />
        ) : activeMenu === "bookings" ? (
          <Bookings />
        ) : activeMenu === "orders" ? (
          <Orders />
        ) : activeMenu === "emergency" ? (
          <Emergency />
        ) : activeMenu === "maintenance" ? (
          <Maintenance />
        ) : activeMenu === "account" ? (
          <Account />
        ) : (
          <div className="dashboard-empty-state">
            <h2>Chọn menu để bắt đầu</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
