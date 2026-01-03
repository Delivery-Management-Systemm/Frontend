import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { FaBox, FaDollarSign, FaEye } from "react-icons/fa";
import { getTrips, getTripStats } from "../services/tripService";
import "./TripManagement.css";
import TripCostModal from "../components/TripCostModal";

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [payTrip, setPayTrip] = useState(null);
  const [orderTrip, setOrderTrip] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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
      completed: { text: "Hoàn thành", class: "status-completed" },
      "in-progress": { text: "Đang thực hiện", class: "status-in-progress" },
    };
    return badges[status] || badges.completed;
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
            ← Quay lại danh sách chuyến đi
          </button>

          <div className="trip-orders-header">
            <div className="trip-orders-title">
              <span className="trip-orders-icon">
                <FaBox />
              </span>
              <div>
                <h2>Quản lý đơn hàng - Chuyến {orderTrip.id}</h2>
                <p>
                  {orderTrip.route} | {orderTrip.date}
                </p>
              </div>
            </div>
          </div>

          <div className="trip-orders-stats">
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Tổng đơn hàng</div>
              <div className="trip-orders-stat-value">0</div>
            </div>
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Đang vận chuyển</div>
              <div className="trip-orders-stat-value">0</div>
            </div>
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Đã giao</div>
              <div className="trip-orders-stat-value">0</div>
            </div>
            <div className="trip-orders-stat">
              <div className="trip-orders-stat-label">Chờ xử lý</div>
              <div className="trip-orders-stat-value">0</div>
            </div>
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
                            onClick={() => setOrderTrip(trip)}
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
