import React, { useState } from "react";
import "./DriverAddModal.css";

export default function DriverAddModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    expiry: "",
    car: "Chưa gán",
    status: "working",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="driver-modal-overlay">
      <div className="driver-modal-container">

        <h2 className="driver-modal-title">Thêm tài xế mới</h2>

        <div className="driver-modal-grid">

          <div className="driver-modal-field">
            <label>Họ và tên</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="driver-modal-field">
            <label>Số điện thoại</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="0901234567"
            />
          </div>

          <div className="driver-modal-field">
            <label>Số GPLX</label>
            <input
              value={form.license}
              onChange={(e) => update("license", e.target.value)}
              placeholder="B2-123456"
            />
          </div>

          <div className="driver-modal-field">
            <label>Hạn GPLX</label>
            <input
              type="date"
              value={form.expiry}
              onChange={(e) => update("expiry", e.target.value)}
            />
          </div>

          <div className="driver-modal-field">
            <label>Gán xe</label>
            <select
              value={form.car}
              onChange={(e) => update("car", e.target.value)}
            >
              <option>Chưa gán</option>
              <option>29A-12345</option>
              <option>30B-98765</option>
            </select>
          </div>

          <div className="driver-modal-field">
            <label>Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="working">Đang làm việc</option>
              <option value="leave">Nghỉ phép</option>
            </select>
          </div>

        </div>

        <div className="driver-modal-actions">
          <button className="driver-modal-cancel" onClick={onClose}>
            Hủy
          </button>

          <button
            className="driver-modal-submit"
            onClick={() => onSubmit(form)}
          >
            Thêm tài xế
          </button>
        </div>

      </div>
    </div>
  );
}
