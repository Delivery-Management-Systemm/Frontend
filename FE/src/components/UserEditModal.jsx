import React, { useState, useEffect } from "react";
import "./UserEditModal.css";

export default function UserEditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const userData = {
      FullName: form.fullName,
      Email: form.email,
      Phone: form.phone,
      Role: form.role,
      Department: form.department,
    };

    if (onSave) onSave(userData);
  };

  return (
    <div className="user-edit-overlay">
      <div className="user-edit-container">
        <h3 className="user-edit-title">Chỉnh sửa tài khoản</h3>
        <form className="user-edit-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <div>
              <label>Họ và tên *</label>
              <input
                className="input"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label>Email *</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid two mt-3">
            <div>
              <label>Số điện thoại</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="0901234567"
              />
            </div>
            <div>
              <label>Vai trò</label>
              <select
                className="input"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="admin">Quản trị viên</option>
                <option value="staff">Nhân viên</option>
                <option value="driver">Tài xế</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label>Phòng ban</label>
            <input
              className="input"
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
              placeholder="Nhập phòng ban"
            />
          </div>

          <div className="mt-4 actions user-edit-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
