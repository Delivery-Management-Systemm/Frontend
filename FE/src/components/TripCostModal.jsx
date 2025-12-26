import React, { useState } from "react";
import "./TripCostModal.css";

function formatVnd(n) {
  if (!n && n !== 0) return "0đ";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
}

export default function TripCostModal({ trip, onClose, onAddCharge }) {
  const [type, setType] = useState("Phạt nguội");
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");

  if (!trip) return null;

  const existing = trip.charges || [];

  const handleAdd = () => {
    const amtNum = Number(amount) || 0;
    const newCharge = {
      id: `c${Date.now()}`,
      type,
      amount: formatVnd(amtNum),
      amountNumber: amtNum,
      desc,
      date: new Date().toLocaleDateString(),
    };
    onAddCharge(trip.id, newCharge);
    // reset form
    setType("Phạt nguội");
    setAmount(0);
    setDesc("");
    onClose();
  };

  return (
    <div className="trip-cost-overlay">
      <div className="trip-cost-container">
        <div className="trip-cost-header">
          <h3>Chi phí phát sinh - {trip.id}</h3>
        </div>

        <div className="trip-cost-body">
          <div className="trip-cost-section">
            <div className="section-title">Chi phí hiện có</div>
            <div className="existing-list">
              {existing.length === 0 ? (
                <div className="empty">Chưa có chi phí</div>
              ) : (
                existing.map((c) => (
                  <div key={c.id} className="existing-item">
                    <div className="existing-left">
                      <div className="existing-type">{c.type}</div>
                      <div className="existing-desc">{c.desc}</div>
                      <div className="existing-date">{c.date}</div>
                    </div>
                    <div className="existing-amount">{c.amount}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="trip-cost-section">
            <div className="section-title">Thêm chi phí mới</div>
            <label>Loại chi phí</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Phạt nguội</option>
              <option>Phí cơm</option>
              <option>Bảo trì phụ tùng</option>
            </select>

            <label>Số tiền (VND)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label>Mô tả</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Mô tả chi tiết"
            />
          </div>
        </div>

        <div className="trip-cost-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            Thêm chi phí
          </button>
        </div>
      </div>
    </div>
  );
}


