import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { getTrips, getTripStats } from "../services/tripService";
import "./TripManagement.css";

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [tripsData, statsData] = await Promise.all([
      getTrips(),
      getTripStats(),
    ]);
    setTrips(tripsData);
    setStats(statsData);
    setLoading(false);
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      completed: { text: "Hoàn thành", class: "status-completed" },
      "in-progress": { text: "Đang thực hiện", class: "status-in-progress" },
    };
    return badges[status] || badges["completed"];
  };

  return (
    <div className="trip-management">
      <div className="page-header">
        <div>
          <h1>Quản lý chuyến đi</h1>
          <p className="page-subtitle">Theo dõi và quản lý các chuyến đi</p>
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
                <th>Ngày</th>
                <th>Xe</th>
                <th>Tài xế</th>
                <th>Lộ trình</th>
                <th>Thời gian</th>
                <th>Quãng đường</th>
                <th>Nhiên liệu</th>
                <th>Trạng thái</th>
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
                      <td>{trip.date}</td>
                      <td className="vehicle-cell">{trip.vehicle}</td>
                      <td>{trip.driver}</td>
                      <td className="route-cell">
                        <MdLocationOn className="route-icon" />
                        {trip.route}
                      </td>
                      <td>{trip.time}</td>
                      <td>{trip.distance}</td>
                      <td>{trip.fuel}</td>
                      <td>
                        <span className={`status-badge ${badge.class}`}>
                          {badge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TripManagement;
