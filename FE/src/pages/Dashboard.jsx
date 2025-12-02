import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
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
          <button className="dashboard-nav-item is-active">
            <span className="dashboard-nav-icon">🏠</span>
            <span className="dashboard-nav-label">Trang chủ</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">🚛</span>
            <span className="dashboard-nav-label">Quản lý phương tiện</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">👨‍✈️</span>
            <span className="dashboard-nav-label">Quản lý tài xế</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">🧭</span>
            <span className="dashboard-nav-label">Quản lý chuyến đi</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">⛽</span>
            <span className="dashboard-nav-label">Quản lý nhiên liệu</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">🛠️</span>
            <span className="dashboard-nav-label">Bảo dưỡng</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">📡</span>
            <span className="dashboard-nav-label">GPS / Tracking</span>
          </button>
          <button className="dashboard-nav-item">
            <span className="dashboard-nav-icon">📊</span>
            <span className="dashboard-nav-label">Báo cáo &amp; Thống kê</span>
          </button>
          <button className="dashboard-nav-item">
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

      <main className="dashboard-main">{/* right side intentionally empty */}</main>
    </div>
  );
};

export default Dashboard;


