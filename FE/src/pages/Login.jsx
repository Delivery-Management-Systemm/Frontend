import React, { useMemo, useState } from "react";
import "./Login.css";
import { loginWithMock, mockUsers } from "../services/authService";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const demoUsers = useMemo(
    () =>
      mockUsers.map((user) => ({
        label: user.role[0].toUpperCase() + user.role.slice(1),
        username: user.username,
        password: user.password,
      })),
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    const result = loginWithMock({ username, password });
    if (result.ok) {
      onLogin?.(result.user);
      return;
    }
    setError(result.message);
  };

  return (
    <div className="login-root">
      <div className="login-background" />
      <div className="login-overlay" />
      <div className="login-content">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon-circle" aria-hidden="true">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7.5C3 6.12 4.12 5 5.5 5h7c1.38 0 2.5 1.12 2.5 2.5V15H7.5C5.57 15 4 16.57 4 18.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M15 9h3.3c.46 0 .9.2 1.2.55l1.7 2.05c.52.62.8 1.4.8 2.2V15h-3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="7"
                  cy="18"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="19"
                  cy="18"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            <h1 className="login-title">Hệ Thống Quản Lý Đội Xe</h1>
            <p className="login-subtitle">Fleet Management System</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="username">
              Tên đăng nhập
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M5 19a7 7 0 0 1 14 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="login-input"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <label className="login-label" htmlFor="password">
              Mật khẩu
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10V8a5 5 0 1 1 10 0v2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error ? <p className="login-error">{error}</p> : null}

            <button type="submit" className="login-submit">
              Đăng nhập
            </button>

            <button type="button" className="login-register">
              <span className="login-register-icon" aria-hidden="true">
                +
              </span>
              Đăng ký tài khoản mới
            </button>
          </form>

          <div className="login-divider" />

          <div className="login-demo">
            <p className="login-demo-title">Tài khoản demo:</p>
            <div className="login-demo-list">
              {demoUsers.map((user) => (
                <div className="login-demo-item" key={user.username}>
                  <span className="login-demo-role">{user.label}:</span>
                  <span>
                    {user.username} / {user.password}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

