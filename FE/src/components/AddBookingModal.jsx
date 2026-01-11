import React, { useState } from "react";
import "./AddBookingModal.css";

export default function AddBookingModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    customer: "",
    contact: "",
    email: "",
    pickup: "",
    delivery: "",
    date: "",
    time: "",
    vehicleType: "Xe tải lớn",
    vehicleNote: "",
    notes: "",
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple validation
    if (!form.customer.trim() || !form.contact.trim() || !form.pickup.trim() || !form.delivery.trim() || !form.date) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    const booking = {
      id: "c" + Date.now(),
      customer: form.customer,
      contact: form.contact,
      email: form.email,
      route: `${form.pickup} → ${form.delivery}`,
      startLocation: form.pickup,
      endLocation: form.delivery,
      date: form.date,
      time: form.time,
      vehicleType: form.vehicleType,
      vehicleNote: form.vehicleNote,
      notes: form.notes,
      assigned: null,
      assignedDriver: null,
      status: "pending",
    };
    if (onSave) onSave(booking);
  };

  return (
    <div className="addbooking-overlay">
      <div className="addbooking-container">
        <h3 className="addbooking-title">Đặt lịch mới</h3>
        <form className="addbooking-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <div>
              <label>Tên khách hàng</label>
              <input className="input" value={form.customer} onChange={(e) => update("customer", e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label>Số điện thoại</label>
              <input className="input" value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="0901234567" />
            </div>
          </div>

          <div className="mt-3">
            <label>Email</label>
            <input className="input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" />
          </div>

          <h4 className="section-title">Thông tin chuyến đi</h4>
          <div>
            <label>Điểm đón</label>
            <input className="input" value={form.pickup} onChange={(e) => update("pickup", e.target.value)} placeholder="Địa chỉ đón khách" />
          </div>
          <div className="mt-3">
            <label>Điểm trả</label>
            <input className="input" value={form.delivery} onChange={(e) => update("delivery", e.target.value)} placeholder="Địa chỉ trả khách" />
          </div>

          <div className="grid two mt-3">
            <div>
              <label>Ngày đặt lịch</label>
              <input className="input" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
            </div>
            <div>
              <label>Giờ đặt lịch</label>
              <input className="input" type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
            </div>
          </div>

          <div className="grid two mt-3">
            <div>
              <label>Loại phương tiện</label>
              <select className="input" value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value)}>
                <option>Xe tải nhỏ</option>
                <option>Xe tải lớn</option>
                <option>Xe container</option>
                <option>Xe khách</option>
              </select>
            </div>
            <div>
              <label>Số hành khách</label>
              <input className="input" type="number" min="0" placeholder="0" />
            </div>
          </div>

          <div className="mt-3">
            <label>Hàng hóa</label>
            <input className="input" value={form.vehicleNote} onChange={(e) => update("vehicleNote", e.target.value)} placeholder="Mô tả hàng hóa cần vận chuyển" />
          </div>

          <div className="mt-3">
            <label>Ghi chú</label>
            <textarea className="input" rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Ghi chú thêm về chuyến đi" />
          </div>

          <div className="mt-4 actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary">Đặt lịch</button>
          </div>
        </form>
      </div>
    </div>
  );
}


