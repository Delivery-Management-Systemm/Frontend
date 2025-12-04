import React, { useState } from "react";
import "./VehicleAddModal.css";

export default function VehicleAddModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    plate: "",
    type: "Xe tải",
    model: "",
    year: 2024,
    km: 0,
    status: "active",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="vehicle-modal-overlay">
      <div className="vehicle-modal-container">

        <h2 className="vehicle-modal-title">Thêm phương tiện mới</h2>

        <div className="vehicle-modal-grid">

          <div className="vehicle-modal-field">
            <label>Biển số xe</label>
            <input
              type="text"
              value={form.plate}
              onChange={(e) => update("plate", e.target.value)}
              placeholder="29A-12345"
            />
          </div>

          <div className="vehicle-modal-field">
            <label>Loại xe</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option>Xe tải</option>
              <option>Xe con</option>
              <option>Xe khách</option>
            </select>
          </div>

          <div className="vehicle-modal-field">
            <label>Model</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder="Hino 500"
            />
          </div>

          <div className="vehicle-modal-field">
            <label>Năm sản xuất</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
            />
          </div>

          <div className="vehicle-modal-field">
            <label>Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="active">Đang hoạt động</option>
              <option value="maintenance">Đang bảo trì</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          <div className="vehicle-modal-field">
            <label>Km đã chạy</label>
            <input
              type="number"
              value={form.km}
              onChange={(e) => update("km", e.target.value)}
            />
          </div>

        </div>

        <div className="vehicle-modal-actions">
          <button className="vehicle-modal-cancel" onClick={onClose}>
            Hủy
          </button>

          <button
            className="vehicle-modal-submit"
            onClick={() => onSubmit(form)}
          >
            Thêm phương tiện
          </button>
        </div>

      </div>
    </div>
  );
}
