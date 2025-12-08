import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiAlertTriangle } from "react-icons/fi";
import { MdBuild, MdCalendarToday } from "react-icons/md";
import {
  getMaintenanceRecords,
  getMaintenanceStats,
} from "../services/maintenanceService";
import "./Maintenance.css";
import "./TripManagement.css";

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recordsData, statsData] = await Promise.all([
      getMaintenanceRecords(),
      getMaintenanceStats(),
    ]);
    setRecords(recordsData);
    setStats(statsData);
    setLoading(false);
  };

  const filteredRecords = records.filter(
    (record) =>
      record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { text: "Đã lên lịch", class: "status-scheduled" },
      "in-progress": { text: "Đang thực hiện", class: "status-in-progress" },
      completed: { text: "Hoàn thành", class: "status-completed" },
      overdue: { text: "Quá hạn", class: "status-overdue" },
    };
    return badges[status] || badges["scheduled"];
  };

  const overdueRecords = records.filter((r) => r.status === "overdue");

  return (
    <div className="maintenance">
      <div className="page-header">
        <div>
          <h1>Quản lý bảo dưỡng</h1>
          <p className="page-subtitle">
            Lập lịch và theo dõi bảo dưỡng phương tiện
          </p>
        </div>
      </div>

      {overdueRecords.length > 0 && (
        <div className="alert-banner">
          <FiAlertTriangle className="alert-icon" />
          <div className="alert-content">
            <div className="alert-title">Cảnh báo bảo trì</div>
            <ul className="alert-items">
              {overdueRecords.map((record) => (
                <li key={record.id}>
                  Xe {record.vehicle} - {record.description} - Ngày{" "}
                  {record.scheduledDate}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <MdCalendarToday />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đã lên lịch</div>
            <div className="stat-value">{stats.scheduled}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <MdBuild />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đang thực hiện</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <MdBuild />
          </div>
          <div className="stat-content">
            <div className="stat-label">Hoàn thành tháng này</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-label">Quá hạn</div>
            <div className="stat-value">{stats.overdue}</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Tìm kiếm theo xe, loại, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary">
            <FiPlus /> Lên lịch bảo trì
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Xe</th>
                <th>Loại bảo trì</th>
                <th>Mô tả</th>
                <th>Lên lịch</th>
                <th>Hoàn thành</th>
                <th>Chi phí</th>
                <th>Km</th>
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
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    Không tìm thấy bản ghi
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const badge = getStatusBadge(record.status);
                  return (
                    <tr key={record.id}>
                      <td className="vehicle-cell">{record.vehicle}</td>
                      <td>
                        <div className="maintenance-type">
                          <MdBuild className="type-icon" />
                          {record.type}
                        </div>
                      </td>
                      <td>{record.description}</td>
                      <td>{record.scheduledDate}</td>
                      <td>{record.completedDate || "-"}</td>
                      <td>{record.cost}</td>
                      <td>{record.cost}</td>
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

export default Maintenance;
