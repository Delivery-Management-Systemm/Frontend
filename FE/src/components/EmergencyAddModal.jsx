import React, { useState } from "react";
import "./EmergencyAddModal.css";

export default function EmergencyAddModal({ onClose, onSave, vehicles = [] }) {
  const [form, setForm] = useState({
    title: "Hỏng xe",
    level: "high",
    vehicle: "",
    location: "",
    contact: "",
    desc: "",
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.level || !form.location.trim() || !form.contact.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const now = new Date();
    const report = {
      id: "e" + Date.now(),
      title: form.title,
      level: form.level,
      status: "new",
      desc: form.desc,
      location: form.location,
      contact: form.contact,
      reporter: "Người dùng",
      vehicle: form.vehicle ? form.vehicle : "",
      driver: "",
      reportedAt: now.toLocaleTimeString() + " " + now.toLocaleDateString(),
      respondedAt: null,
      resolvedAt: null,
    };

    if (onSave) onSave(report);
  };

  return (
    <div className="em-add-overlay">
      <div className="em-add-container">
        <h3 className="em-add-title">Tạo báo cáo khẩn cấp</h3>
        <form className="em-add-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <div>
              <label>Loại sự cố</label>
              <select className="input" value={form.title} onChange={(e) => update("title", e.target.value)}>
                <option>Hỏng xe</option>
                <option>Tai nạn</option>
                <option>Sự cố khác</option>
              </select>
            </div>
            <div>
              <label>Mức độ ưu tiên</label>
              <select className="input" value={form.level} onChange={(e) => update("level", e.target.value)}>
                <option value="high">Cao</option>
                <option value="critical">Khẩn cấp</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label>Phương tiện (nếu có)</label>
            <select className="input" value={form.vehicle} onChange={(e) => update("vehicle", e.target.value)}>
              <option value="">-- Chọn xe --</option>
              {vehicles.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label>Vị trí</label>
            <input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Nhập vị trí chi tiết" />
          </div>

          <div className="mt-3">
            <label>Số điện thoại liên hệ</label>
            <input className="input" value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="0901234567" />
          </div>

          <div className="mt-3">
            <label>Mô tả chi tiết</label>
            <textarea className="input" rows={5} value={form.desc} onChange={(e) => update("desc", e.target.value)} placeholder="Mô tả tình huống khẩn cấp" />
          </div>

          <div className="mt-4 actions em-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-danger">
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


