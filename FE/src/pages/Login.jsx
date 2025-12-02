import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-root">
      <div className="login-background" />
      <div className="login-overlay" />

      <div className="login-content">
        <div className="login-card">
          <div className="login-icon-circle">
            <span className="login-icon-truck">🚚</span>
          </div>
          <h1 className="login-title">Fleet Management System</h1>
          <p className="login-subtitle">Hệ thống quản lý đội xe</p>

          <form className="login-form">
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">@</span>
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="youremail@example.com"
              />
            </div>

            <label className="login-label" htmlFor="password">
              Mật khẩu
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">🔒</span>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="••••••••"
              />
            </div>

            <div className="login-row login-remember-row">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="login-link-button">
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="login-submit">
              Đăng nhập
            </button>
          </form>
        </div>

        <button className="login-help-button">?</button>
      </div>
    </div>
  );
};

export default Login;


