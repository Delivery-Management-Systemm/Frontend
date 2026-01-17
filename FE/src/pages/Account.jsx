import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import userAPI from "../services/userAPI";
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
    purpose: "",
  });
  const [saveState, setSaveState] = useState({
    isSaving: false,
    error: "",
    success: "",
  });
  const [passwordState, setPasswordState] = useState({
    isSaving: false,
    error: "",
    success: "",
  });
  const [pendingPassword, setPendingPassword] = useState("");

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

  const syncProfileFromUser = (user) => {
    if (!user) {
      return;
    }

    setProfile((prev) => ({
      ...prev,
      fullName: user.fullName ?? prev.fullName,
      email: user.email ?? prev.email,
      phone: user.phone ?? prev.phone,
      role: user.role ?? prev.role,
      department: user.department ?? prev.department,
    }));
  };

  const handleSaveProfile = async () => {
    if (!onUpdateUser) {
      return;
    }

    const nextEmail = profile.email?.trim() || "";
    const currentEmail = currentUser?.email?.trim() || "";

    if (nextEmail && nextEmail !== currentEmail) {
      setSaveState({ isSaving: true, error: "", success: "" });
      try {
        await userAPI.sendOtp(nextEmail, "email-change");
        setOtpState({
          pendingEmail: nextEmail,
          code: "",
          isOpen: true,
          error: "",
          purpose: "email-change",
        });
        setSaveState({ isSaving: false, error: "", success: "" });
      } catch (error) {
        setSaveState({
          isSaving: false,
          error: error?.message || "Không thể gửi OTP.",
          success: "",
        });
      }
      return;
    }

    setSaveState({ isSaving: true, error: "", success: "" });
    try {
      const updatedUser = await onUpdateUser({ ...profile });
      syncProfileFromUser(updatedUser);
      setSaveState({ isSaving: false, error: "", success: "Đã lưu thay đổi." });
    } catch (error) {
      setSaveState({
        isSaving: false,
        error: error?.message || "Lưu thay đổi thất bại.",
        success: "",
      });
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedOtp = otpState.code.trim();
    if (!trimmedOtp) {
      setOtpState((prev) => ({ ...prev, error: "Vui lòng nhập mã OTP." }));
      return;
    }

    try {
      await userAPI.verifyOtp(
        otpState.pendingEmail,
        trimmedOtp,
        otpState.purpose
      );

      if (otpState.purpose === "email-change") {
        if (!onUpdateUser) {
          return;
        }

        setSaveState({ isSaving: true, error: "", success: "" });
        const updatedUser = await onUpdateUser({
          ...profile,
          email: otpState.pendingEmail,
        });
        syncProfileFromUser(updatedUser);
        setSaveState({
          isSaving: false,
          error: "",
          success: "Đã cập nhật email.",
        });
      }

      if (otpState.purpose === "password") {
        if (!pendingPassword) {
          setOtpState((prev) => ({
            ...prev,
            error: "Vui lòng nhập mật khẩu mới.",
          }));
          return;
        }

        setPasswordState({ isSaving: true, error: "", success: "" });
        await userAPI.changePassword(otpState.pendingEmail, pendingPassword);
        setPasswordState({
          isSaving: false,
          error: "",
          success: "Đã đổi mật khẩu.",
        });
        setPassword({ current: "", next: "", confirm: "" });
        setPendingPassword("");
      }

      setOtpState({
        pendingEmail: "",
        code: "",
        isOpen: false,
        error: "",
        purpose: "",
      });
    } catch (error) {
      const message = error?.message || "Xác nhận OTP thất bại.";
      setOtpState((prev) => ({ ...prev, error: message }));
      if (otpState.purpose === "email-change") {
        setSaveState({ isSaving: false, error: message, success: "" });
      }
      if (otpState.purpose === "password") {
        setPasswordState({ isSaving: false, error: message, success: "" });
      }
    }
  };

  const handleCancelOtp = () => {
    if (otpState.purpose === "email-change") {
      setProfile((prev) => ({
        ...prev,
        email: currentUser?.email || "",
      }));
    }

    setOtpState({
      pendingEmail: "",
      code: "",
      isOpen: false,
      error: "",
      purpose: "",
    });
  };

  const handleChangePassword = async () => {
    setPasswordState({ isSaving: false, error: "", success: "" });

    if (!currentUser?.email) {
      setPasswordState({
        isSaving: false,
        error: "Vui lòng cập nhật email trước khi đổi mật khẩu.",
        success: "",
      });
      return;
    }

    if (!password.current || !password.next || !password.confirm) {
      setPasswordState({
        isSaving: false,
        error: "Vui lòng nhập đầy đủ thông tin mật khẩu.",
        success: "",
      });
      return;
    }

    if (password.next !== password.confirm) {
      setPasswordState({
        isSaving: false,
        error: "Mật khẩu mới không khớp.",
        success: "",
      });
      return;
    }

    if (password.current === password.next) {
      setPasswordState({
        isSaving: false,
        error: "Mật khẩu mới phải khác mật khẩu hiện tại.",
        success: "",
      });
      return;
    }

    setPasswordState({ isSaving: true, error: "", success: "" });
    try {
      await userAPI.sendOtp(currentUser.email, "password");
      setPendingPassword(password.next);
      setOtpState({
        pendingEmail: currentUser.email,
        code: "",
        isOpen: true,
        error: "",
        purpose: "password",
      });
      setPasswordState({ isSaving: false, error: "", success: "" });
    } catch (error) {
      setPasswordState({
        isSaving: false,
        error: error?.message || "Không thể gửi OTP.",
        success: "",
      });
    }
  };

  const otpSubtitle =
    otpState.purpose === "password"
      ? `Mã OTP đã được gửi tới email ${otpState.pendingEmail}. Nhập mã để đổi mật khẩu.`
      : "Mã OTP đã được gửi tới email mới. Nhập OTP để lưu thay đổi.";

  return (
    <div className="account-container">
      <h2 className="account-title">Quản lý tài khoản</h2>
      <p className="account-subtitle">Cập nhật thông tin cá nhân và cài đặt</p>

      <div className="account-grid">
        <div className="account-card">
          <h3>Ảnh đại diện</h3>

          <div className="avatar-box">
            <div className="avatar-circle">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Avatar"
                  className="avatar-img"
                />
              ) : (
                <img
                  src="/default_avt.jpg"
                  alt="Default Avatar"
                  className="avatar-img"
                />
              )}
            </div>

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
              ID:{" "}
              <strong>
                #
                {currentUser?.id ??
                  currentUser?.userID ??
                  currentUser?.UserID ??
                  "USER-001"}
              </strong>
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

          <button
            className="save-btn"
            type="button"
            onClick={handleSaveProfile}
            disabled={saveState.isSaving}
          >
            Lưu thay đổi
          </button>
          {saveState.error && (
            <p className="account-save-error">{saveState.error}</p>
          )}
          {saveState.success && (
            <p className="account-save-success">{saveState.success}</p>
          )}
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

          <button
            className="save-btn"
            type="button"
            onClick={handleChangePassword}
            disabled={passwordState.isSaving}
          >
            Đổi mật khẩu
          </button>
          {passwordState.error && (
            <p className="account-save-error">{passwordState.error}</p>
          )}
          {passwordState.success && (
            <p className="account-save-success">{passwordState.success}</p>
          )}
        </div>
      </div>

      {otpState.isOpen && (
        <div className="account-otp-overlay">
          <div className="account-otp-card">
            <h3>Xác nhận OTP</h3>
            <p className="account-otp-subtitle">{otpSubtitle}</p>
            <div className="input-wrapper">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Nhập mã OTP"
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
                Hủy
              </button>
              <button
                className="account-otp-confirm"
                type="button"
                onClick={handleVerifyOtp}
                disabled={saveState.isSaving || passwordState.isSaving}
              >
                Xác nhận
              </button>
            </div>
            <p className="account-otp-hint">
              Mã OTP có hiệu lực trong 10 phút.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
