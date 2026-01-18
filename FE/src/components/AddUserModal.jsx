import React, { useState } from "react";
import "./AddUserModal.css";

const roleOptions = [
  { value: "staff", label: "Nhân viên" },
  { value: "driver", label: "Tài xế" },
  { value: "admin", label: "Quản trị viên" },
];

const licenseOptions = [
  { value: 1, label: "A1" },
  { value: 2, label: "A2" },
  { value: 3, label: "B1" },
  { value: 4, label: "B2" },
  { value: 5, label: "C" },
  { value: 6, label: "D" },
  { value: 7, label: "E" },
  { value: 8, label: "F" },
];

export default function AddUserModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    role: "staff",
    licenseClassId: "",
    licenseId: "",
    licenseExpiry: "",
  });
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isDriver = form.role === "driver";

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.username.trim() ||
      !form.password.trim() ||
      !form.fullName.trim() ||
      !form.email.trim()
    ) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    if (isDriver) {
      if (!form.licenseClassId || !form.licenseId.trim() || !form.licenseExpiry) {
        setError("Vui lòng nhập đầy đủ thông tin bằng lái.");
        return;
      }
    }

    if (onSave) {
      onSave({
        username: form.username.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        driverLicense: isDriver
          ? {
              licenseClassId: Number(form.licenseClassId),
              licenseId: form.licenseId.trim(),
              licenseExpiry: form.licenseExpiry,
            }
          : null,
      });
    }
  };

  return (
    <div className="user-add-overlay">
      <div className="user-add-container">
        <div className="user-add-header">
          <h3>Thêm tài khoản mới</h3>
          <button
            type="button"
            className="user-add-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <form className="user-add-form" onSubmit={handleSubmit}>
          <div className="user-add-grid two">
            <div>
              <label>
                Username <span className="required">*</span>
              </label>
              <input
                className="input"
                value={form.username}
                onChange={(event) => update("username", event.target.value)}
                placeholder="admin"
              />
            </div>
            <div>
              <label>
                Mật khẩu <span className="required">*</span>
              </label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="user-add-grid mt-3">
            <div>
              <label>
                Họ và tên <span className="required">*</span>
              </label>
              <input
                className="input"
                value={form.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          <div className="user-add-grid two mt-3">
            <div>
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label>Số điện thoại</label>
              <input
                className="input"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="0123456789"
              />
            </div>
          </div>

          <div className="user-add-grid mt-3">
            <div>
              <label>
                Vai trò <span className="required">*</span>
              </label>
              <select
                className="input"
                value={form.role}
                onChange={(event) => update("role", event.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isDriver && (
            <div className="user-add-driver">
              <div className="user-add-grid two mt-3">
                <div>
                  <label>
                    Hạng bằng <span className="required">*</span>
                  </label>
                  <select
                    className="input"
                    value={form.licenseClassId}
                    onChange={(event) =>
                      update("licenseClassId", event.target.value)
                    }
                  >
                    <option value="">-- Chọn hạng bằng --</option>
                    {licenseOptions.map((license) => (
                      <option key={license.value} value={license.value}>
                        {license.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>
                    Mã bằng <span className="required">*</span>
                  </label>
                  <input
                    className="input"
                    value={form.licenseId}
                    onChange={(event) => update("licenseId", event.target.value)}
                    placeholder="GPLX-123456"
                  />
                </div>
              </div>
              <div className="user-add-grid mt-3">
                <div>
                  <label>
                    Ngày hết hạn <span className="required">*</span>
                  </label>
                  <input
                    className="input"
                    type="date"
                    value={form.licenseExpiry}
                    onChange={(event) =>
                      update("licenseExpiry", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {error && <div className="user-add-error">{error}</div>}

          <div className="user-add-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Thêm tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
