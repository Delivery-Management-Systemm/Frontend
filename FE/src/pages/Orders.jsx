import React, { useEffect, useState } from "react";
import { FaBox, FaMapMarkerAlt, FaTruck, FaCheckCircle, FaPhone, FaClock } from "react-icons/fa";
import "./Orders.css";
import { confirmOrderStep, getOrders } from "../services/ordersAPI";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    let active = true;
    getOrders().then((data) => {
      if (active) setOrders(data || []);
    });
    return () => {
      active = false;
    };
  }, []);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
  const visibleOrders = selectedOrder ? [selectedOrder] : orders;

  const stats = {
    waiting: visibleOrders.filter((o) => o.status === "waiting").length,
    in_transit: visibleOrders.filter((o) => o.status === "in_transit").length,
    delivered: visibleOrders.filter((o) => o.status === "delivered").length,
    gps_confirm: visibleOrders.filter((o) => o.steps.some((s) => s.key === "gps" && s.done)).length,
    phone_confirm: visibleOrders.filter((o) => o.steps.some((s) => s.key === "phone" && s.done)).length,
  };

  const handleConfirmStep = async (orderId, stepKey) => {
    const updated = await confirmOrderStep(orderId, stepKey);
    if (!updated) return;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
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


      {selectedOrder && (
        <div className="orders-detail-head">
          <button
            type="button"
            className="orders-back"
            onClick={() => setSelectedOrderId(null)}
          >
            Quay lai danh sach don hang
          </button>
          <div className="orders-detail-title">
            <span className="orders-detail-icon">
              <FaBox />
            </span>
            <div>
              <h2>Quan ly don hang - {selectedOrder.id}</h2>
              <p>
                {selectedOrder.pickup} {" -> "} {selectedOrder.dropoff}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="orders-stats">
        {selectedOrder ? (
          <>
            <div className="stat-card">
              <div className="stat-label">Tong don hang</div>
              <div className="stat-value">{visibleOrders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Dang van chuyen</div>
              <div className="stat-value">{stats.in_transit}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Da giao</div>
              <div className="stat-value">{stats.delivered}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cho xu ly</div>
              <div className="stat-value">{stats.waiting}</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-label">Dang cho</div>
              <div className="stat-value">{stats.waiting}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Dang van chuyen</div>
              <div className="stat-value">{stats.in_transit}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Da giao</div>
              <div className="stat-value">{stats.delivered}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cho xac nhan GPS</div>
              <div className="stat-value">{visibleOrders.length - stats.gps_confirm}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cho xac nhan SDT</div>
              <div className="stat-value">{visibleOrders.length - stats.phone_confirm}</div>
            </div>
          </>
        )}
      </div>

      <div className="orders-list">
        {visibleOrders.map((o) => (
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
                <button className="order-detail" type="button" onClick={() => setSelectedOrderId(o.id)}>Chi tiết</button>
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










