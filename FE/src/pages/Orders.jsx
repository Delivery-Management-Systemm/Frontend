import React, { useState } from "react";
import { FaBox, FaMapMarkerAlt, FaTruck, FaCheckCircle, FaPhone, FaClock } from "react-icons/fa";
import "./Orders.css";

const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: "Công ty TNHH ABC",
    contact: "0241234567",
    pickup: "Kho ABC, Q. Long Biên, Hà Nội",
    dropoff: "Cửa hàng XYZ, Q.1, TP.HCM",
    vehicle: "30B-67890",
    driver: "Phạm Văn Đức",
    status: "in_transit",
    steps: [
      { key: "gps", label: "Xác nhận GPS", done: true, time: "08:15:00 16/12/2024" },
      { key: "phone", label: "Xác nhận SĐT", done: false },
      { key: "delivered", label: "Đã giao hàng", done: false },
    ],
    cost: "800,000đ",
  },
  {
    id: "ORD-2024-002",
    customer: "Trần Văn Bình",
    contact: "0912345678",
    pickup: "Nhà hàng Sông Hồng, Hà Nội",
    dropoff: "Khách sạn Mường Thanh, Hải Phòng",
    vehicle: "59E-33333",
    driver: "Nguyễn Thị Hoa",
    status: "delivered",
    steps: [
      { key: "gps", label: "Xác nhận GPS", done: true, time: "07:30:00 14/12/2024" },
      { key: "phone", label: "Xác nhận SĐT", done: true, time: "07:45:00 14/12/2024" },
      { key: "delivered", label: "Đã giao hàng", done: true, time: "10:30:00 14/12/2024" },
    ],
    cost: "0đ",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);

  const stats = {
    waiting: orders.filter((o) => o.status === "waiting").length,
    in_transit: orders.filter((o) => o.status === "in_transit").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    gps_confirm: orders.filter((o) => o.steps.some((s) => s.key === "gps" && s.done)).length,
    phone_confirm: orders.filter((o) => o.steps.some((s) => s.key === "phone" && s.done)).length,
  };

  function formatNow() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour12: false });
    const date = now.toLocaleDateString("en-GB");
    return `${time} ${date}`;
  }

  const handleConfirmStep = (orderId, stepKey) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newSteps = o.steps.map((s) =>
          s.key === stepKey ? { ...s, done: true, time: s.time || formatNow() } : s
        );
        const newStatus = stepKey === "delivered" ? "delivered" : o.status;
        return { ...o, steps: newSteps, status: newStatus };
      })
    );
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="orders-left">
          <div className="orders-icon"><FaBox /></div>
          <div>
            <div className="orders-title">Quản lý đơn hàng</div>
            <div className="orders-sub">Hệ thống xác nhận 3 bước</div>
          </div>
        </div>
        <button className="orders-add">Tạo đơn mới</button>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-label">Đang chờ</div>
          <div className="stat-value">{stats.waiting}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đang vận chuyển</div>
          <div className="stat-value">{stats.in_transit}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đã giao</div>
          <div className="stat-value">{stats.delivered}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Chờ xác nhận GPS</div>
          <div className="stat-value">{mockOrders.length - stats.gps_confirm}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Chờ xác nhận SĐT</div>
          <div className="stat-value">{mockOrders.length - stats.phone_confirm}</div>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-card-top">
              <div>
                <div className="order-id">{o.id} <span className={`order-badge order-${o.status}`}>{o.status === "in_transit" ? "Đang vận chuyển" : o.status === "delivered" ? "Đã giao" : "Đang chờ"}</span></div>
                <div className="order-customer">{o.customer}</div>
                <div className="order-contact">{o.contact}</div>
              </div>
              <div className="order-vehicle">
                <div className="ov-label">Phương tiện / Tài xế</div>
                <div className="ov-main">{o.vehicle}</div>
                <div className="ov-sub">{o.driver}</div>
                <button className="order-detail">Chi tiết</button>
              </div>
            </div>

            <div className="order-locations">
              <div className="loc">
                <FaMapMarkerAlt className="loc-icon" /> <div><div className="loc-title">Điểm lấy hàng</div><div className="loc-text">{o.pickup}</div></div>
              </div>
              <div className="loc">
                <FaMapMarkerAlt className="loc-icon loc-dest" /> <div><div className="loc-title">Điểm giao hàng</div><div className="loc-text">{o.dropoff}</div></div>
              </div>
            </div>

            <div className="order-steps">
              <div className="steps-track">
                {o.steps.map((s, idx) => (
                  <div className={`step ${s.key === "delivered" ? "deliver-step" : ""}`} key={s.key}>
                    <div
                      className={`step-node ${s.done ? "done" : ""} ${
                        s.key === "delivered" && !s.done ? "pending-delivered" : ""
                      } ${s.key === "delivered" && s.done ? "done-delivered" : ""}`}
                    >
                      {s.done ? <FaCheckCircle /> : s.key === "phone" ? <FaPhone /> : <FaClock />}
                    </div>

                    {/* connector to next step */}
                    {idx < o.steps.length - 1 && (
                      <div className={`connector ${s.done ? "done" : ""}`} />
                    )}

                    <div className="step-label">{s.label}</div>
                    {s.time ? <div className="step-time">{s.time}</div> : null}

                    {/* show confirm button for phone step when not done */}
                    {s.key === "phone" && !s.done && (
                      <div className="step-action">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleConfirmStep(o.id, s.key)}
                        >
                          Xác nhận
                        </button>
                      </div>
                    )}

                    {/* show complete button for delivered step when not done */}
                    {s.key === "delivered" && !s.done && (
                      <div className="step-action">
                        <button
                          className="btn-complete"
                          onClick={() => handleConfirmStep(o.id, s.key)}
                        >
                          Hoàn thành
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


