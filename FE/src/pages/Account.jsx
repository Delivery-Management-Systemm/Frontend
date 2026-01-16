import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import "./Account.css";

const Account = ({ currentUser, onUpdateUser }) => {
  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });

  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [otpState, setOtpState] = useState({
    pendingEmail: "",
    code: "",
    isOpen: false,
    error: "",
  });

  const updateProfile = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const updatePassword = (field, value) =>
    setPassword((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setProfile({
      fullName: currentUser.fullName || currentUser.username || "",
      age: currentUser.age || "",
      gender: currentUser.gender || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      role: currentUser.role || "",
      department: currentUser.department || "",
    });
  }, [currentUser]);

  const handleSaveProfile = () => {
    if (!onUpdateUser) {
      return;
    }

    if (currentUser?.email && profile.email !== currentUser.email) {
      setOtpState({
        pendingEmail: profile.email,
        code: "",
        isOpen: true,
        error: "",
      });
      return;
    }

    onUpdateUser({ ...profile });
  };

  const handleVerifyOtp = () => {
    const expectedOtp = "123456";
    if (otpState.code.trim() !== expectedOtp) {
      setOtpState((prev) => ({ ...prev, error: "Ma OTP khong dung." }));
      return;
    }

    if (onUpdateUser) {
      onUpdateUser({ ...profile, email: otpState.pendingEmail });
    }

    setOtpState({
      pendingEmail: "",
      code: "",
      isOpen: false,
      error: "",
    });
  };

  const handleCancelOtp = () => {
    setProfile((prev) => ({
      ...prev,
      email: currentUser?.email || "",
    }));
    setOtpState({
      pendingEmail: "",
      code: "",
      isOpen: false,
      error: "",
    });
  };
  return (
    <div className="account-container">
      <h2 className="account-title">Quản lý tài khoản</h2>
      <p className="account-subtitle">
        Cập nhật thông tin cá nhân và cài đặt
      </p>

      <div className="account-grid">
        <div className="account-card">
          <h3>Ảnh đại diện</h3>

          <div className="avatar-box">
            <div className="avatar-circle">👤</div>

            <label className="upload-btn">
              <span>Thay đổi ảnh</span>
              <input type="file" hidden accept="image/*" />
            </label>

            <p className="avatar-note">JPG, PNG tối đa 2MB</p>
          </div>

          <hr className="divider" />

          <div className="info-block">
            <h4>Thông tin tài khoản</h4>
            <p>
              ID: <strong>#{currentUser?.id || "USER-001"}</strong>
            </p>
            <p>
              Ngày tạo: <strong>15/01/2024</strong>
            </p>
            <p>
              Lần đăng nhập cuối: <strong>01/12/2024</strong>
            </p>
          </div>
        </div>

        <div className="account-card">
          <h3>Thông tin cá nhân</h3>

          <div className="form-grid">
            <label>
              Họ và tên
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={profile.fullName}
                  onChange={(e) => updateProfile("fullName", e.target.value)}
                />
              </div>
            </label>

            <label>
              Email
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                />
              </div>
            </label>

            <label>
              Số điện thoại
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={profile.phone}
                  onChange={(e) => updateProfile("phone", e.target.value)}
                />
              </div>
            </label>

            <label>
              Tuổi
              <div className="input-wrapper">
                <input
                  type="number"
                  min="0"
                  placeholder="Tuổi"
                  value={profile.age}
                  onChange={(e) => updateProfile("age", e.target.value)}
                />
              </div>
            </label>

            <label>
              Giới tính
              <div className="input-wrapper">
                <select
                  value={profile.gender}
                  onChange={(e) => updateProfile("gender", e.target.value)}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </label>

            <label>
              Chức vụ
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Chức vụ"
                  value={profile.role}
                  onChange={(e) => updateProfile("role", e.target.value)}
                />
              </div>
            </label>

            <label className="full-width">
              Phòng ban
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Phòng ban"
                  value={profile.department}
                  onChange={(e) => updateProfile("department", e.target.value)}
                />
              </div>
            </label>
          </div>

          <button className="save-btn" type="button" onClick={handleSaveProfile}>
            Lưu thay đổi
          </button>
        </div>

        <div className="account-card full-width">
          <h3>Đổi mật khẩu</h3>

          <div className="form-grid">
            <label>
              Mật khẩu hiện tại
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={password.current}
                  onChange={(e) => updatePassword("current", e.target.value)}
                />
              </div>
            </label>

            <label>
              Mật khẩu mới
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={password.next}
                  onChange={(e) => updatePassword("next", e.target.value)}
                />
              </div>
            </label>

            <label className="full-width">
              Xác nhận mật khẩu mới
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={password.confirm}
                  onChange={(e) => updatePassword("confirm", e.target.value)}
                />
              </div>
            </label>
          </div>

          <button className="save-btn" type="button">
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {otpState.isOpen && (
        <div className="account-otp-overlay">
          <div className="account-otp-card">
            <h3>Xac nhan OTP</h3>
            <p className="account-otp-subtitle">
              Ma OTP da duoc gui toi email moi. Nhap OTP de luu thay doi.
            </p>
            <div className="input-wrapper">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Nhap ma OTP"
                value={otpState.code}
                onChange={(e) =>
                  setOtpState((prev) => ({
                    ...prev,
                    code: e.target.value,
                    error: "",
                  }))
                }
              />
            </div>
            {otpState.error && (
              <p className="account-otp-error">{otpState.error}</p>
            )}
            <div className="account-otp-actions">
              <button
                className="account-otp-cancel"
                type="button"
                onClick={handleCancelOtp}
              >
                Huy
              </button>
              <button
                className="account-otp-confirm"
                type="button"
                onClick={handleVerifyOtp}
              >
                Xac nhan
              </button>
            </div>
            <p className="account-otp-hint">OTP demo: 123456</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;



