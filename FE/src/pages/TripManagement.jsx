import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { FaBox, FaCheckCircle, FaClock, FaDollarSign, FaEye, FaPhone } from "react-icons/fa";
import { getTrips, getTripStats } from "../services/tripAPI";
import { confirmOrderStep, getOrders } from "../services/ordersAPI";
import "./TripManagement.css";
import "./Orders.css";
import TripCostModal from "../components/TripCostModal";

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [payTrip, setPayTrip] = useState(null);
  const [orderTrip, setOrderTrip] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenOrders = (trip) => {
    setOrderTrip(trip);
    setLoadingOrders(true);
    getOrders()
      .then((data) => {
        setOrders(data || []);
      })
      .finally(() => {
        setLoadingOrders(false);
      });
  };

  const loadData = async () => {
    setLoading(true);
    const [tripsData, statsData] = await Promise.all([
      getTrips(),
      getTripStats(),
    ]);
    const normalized = (tripsData || []).map((t) => ({
      ...t,
      charges: t.charges || [],
    }));
    setTrips(normalized);
    setStats(statsData);
    setLoading(false);
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(
      (trip) =>
        trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.route.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trips, searchTerm]);

  const handleAddCharge = (tripId, charge) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const newCharges = [...(t.charges || []), charge];
        const existingTotal = (t.charges || []).reduce(
          (sum, c) => sum + (c.amountNumber || 0),
          0
        );
        const newTotal = existingTotal + (charge.amountNumber || 0);
        return {
          ...t,
          charges: newCharges,
          cost: `${newTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`,
        };
      })
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { text: "HoA�n thA�nh", class: "status-completed" },
      "in-progress": { text: "�?ang th���c hi���n", class: "status-in-progress" },
    };
    return badges[status] || badges.completed;
  };

  const orderStats = {
    waiting: orders.filter((o) => o.status === "waiting").length,
    in_transit: orders.filter((o) => o.status === "in_transit").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    gps_confirm: orders.filter((o) => o.steps.some((s) => s.key === "gps" && s.done)).length,
    phone_confirm: orders.filter((o) => o.steps.some((s) => s.key === "phone" && s.done)).length,
  };

  const handleConfirmOrderStep = async (orderId, stepKey) => {
    const updated = await confirmOrderStep(orderId, stepKey);
    if (!updated) return;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  return (
    <div className="trip-management">
      <div className="page-header">
        <div>
          <h1>Quản lý chuyến đi</h1>
          <p className="page-subtitle">
            Theo dõi và quản lý các chuyến đi
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng chuyến hôm nay</div>
            <div className="stat-value">{stats.todayTrips}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đang thực hiện</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Hoàn thành</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng quãng đường</div>
            <div className="stat-value">{stats.totalDistance}</div>
          </div>
        </div>
      </div>

      {orderTrip ? (
        <div className="content-card trip-orders-detail">
          <button
            type="button"
            className="trip-orders-back"
            onClick={() => setOrderTrip(null)}
          >
            {"<- Quay lai danh sach chuyen di"}
          </button>

          <div className="trip-orders-header">
            <div className="trip-orders-title">
              <span className="trip-orders-icon">
                <FaBox />
              </span>
              <div>
                <h2>Quan ly don hang - Chuyen {orderTrip.id}</h2>
                <p>
                  {orderTrip.route} | {orderTrip.date}
                </p>
              </div>
            </div>
          </div>

          <div className="trip-orders-stats">
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Tong don hang</div>
              <div className="trip-orders-stat-value">{orders.length}</div>
            </div>
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Dang van chuyen</div>
              <div className="trip-orders-stat-value">{orderStats.in_transit}</div>
            </div>
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Da giao</div>
              <div className="trip-orders-stat-value">{orderStats.delivered}</div>
            </div>
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Cho xu ly</div>
              <div className="trip-orders-stat-value">{orderStats.waiting}</div>
            </div>
          </div>

          <div className="orders-list">
            {loadingOrders ? (
              <div className="order-card">Dang tai...</div>
            ) : orders.length === 0 ? (
              <div className="order-card">Chua co don hang nao.</div>
            ) : (
              orders.map((o) => (
                <div className="order-card" key={o.id}>
                  <div className="order-card-top">
                    <div>
                      <div className="order-id">
                        {o.id}{" "}
                        <span className={`order-badge order-${o.status}`}>
                          {o.status === "in_transit"
                            ? "Dang van chuyen"
                            : o.status === "delivered"
                              ? "Da giao"
                              : "Dang cho"}
                        </span>
                      </div>
                      <div className="order-customer">{o.customer}</div>
                      <div className="order-contact">{o.contact}</div>
                    </div>
                    <div className="order-vehicle">
                      <div className="ov-label">Phuong tien / Tai xe</div>
                      <div className="ov-main">{o.vehicle}</div>
                      <div className="ov-sub">{o.driver}</div>
                    </div>
                  </div>

                  <div className="order-locations">
                    <div className="loc">
                      <MdLocationOn className="loc-icon" />
                      <div>
                        <div className="loc-title">Diem lay hang</div>
                        <div className="loc-text">{o.pickup}</div>
                      </div>
                    </div>
                    <div className="loc">
                      <MdLocationOn className="loc-icon loc-dest" />
                      <div>
                        <div className="loc-title">Diem giao hang</div>
                        <div className="loc-text">{o.dropoff}</div>
                      </div>
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

                          {idx < o.steps.length - 1 && (
                            <div className={`connector ${s.done ? "done" : ""}`} />
                          )}

                          <div className="step-label">{s.label}</div>
                          {s.time ? <div className="step-time">{s.time}</div> : null}

                          {s.key === "phone" && !s.done && (
                            <div className="step-action">
                              <button
                                className="btn btn-primary"
                                onClick={() => handleConfirmOrderStep(o.id, s.key)}
                              >
                                Xac nhan
                              </button>
                            </div>
                          )}

                          {s.key === "delivered" && !s.done && (
                            <div className="step-action">
                              <button
                                className="btn-complete"
                                onClick={() => handleConfirmOrderStep(o.id, s.key)}
                              >
                                Hoan thanh
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {!orderTrip ? (
        <div className="content-card">
          <div className="card-header">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Tìm kiếm theo xe, tài xế, lộ trình, địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-primary">
              <FiPlus /> Tạo chuyến đi
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>MÃ CHUYẾN</th>
                  <th>XE / TÀI XẾ</th>
                  <th>LỘ TRÌNH</th>
                  <th>THỜI GIAN</th>
                  <th>KHOẢNG CÁCH</th>
                  <th>CHI PHÍ PS</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">
                      Đang tải...
                    </td>
                  </tr>
                ) : filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-cell">
                      Không tìm thấy chuyến đi
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => {
                    const badge = getStatusBadge(trip.status);
                    return (
                      <tr key={trip.id}>
                        <td className="trip-code">{trip.id}</td>
                        <td>
                          <div className="trip-vehicle">
                            {trip.multiday ? (
                              <span className="multiday-badge">Nhiều ngày</span>
                            ) : null}
                            <div className="vehicle-main">{trip.vehicle}</div>
                            <div className="vehicle-sub">{trip.driver}</div>
                          </div>
                        </td>
                        <td className="route-cell">
                          <MdLocationOn className="route-icon" />
                          <div>{trip.route}</div>
                        </td>
                        <td>
                          {trip.date}
                          {trip.time ? ` • ${trip.time}` : ""}
                        </td>
                        <td>{trip.distance || "0 km"}</td>
                        <td className="cost-cell">{trip.cost || "0đ"}</td>
                        <td>
                          <span className={`status-badge ${badge.class}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            title="Xem"
                            onClick={() => {}}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="action-btn action-btn--pay"
                            title="Chi phí"
                            onClick={() => setPayTrip(trip)}
                          >
                            <FaDollarSign />
                          </button>
                          <button
                            className="action-btn action-btn--box"
                            title="Đơn hàng"
                            onClick={() => handleOpenOrders(trip)}
                          >
                            <FaBox />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {payTrip ? (
        <TripCostModal
          trip={payTrip}
          onClose={() => setPayTrip(null)}
          onAddCharge={handleAddCharge}
        />
      ) : null}
    </div>
  );
};

export default TripManagement;






