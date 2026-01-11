import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiAlertTriangle } from "react-icons/fi";
import { MdBuild, MdCalendarToday } from "react-icons/md";
import {
  getMaintenanceRecords,
  getMaintenanceStats,
} from "../services/maintenanceAPI";
import "./Maintenance.css";
import "./TripManagement.css";
import MaintenanceAddModal from "../components/MaintenanceAddModal";

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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
    <div className="maintenance-page">
      <div className="maintenance-header">
        <div className="maintenance-header-left">
          <div className="maintenance-header-icon">
            <MdBuild />
          </div>
          <div>
            <div className="maintenance-header-title">Bảo trì & Sửa chữa</div>
            <div className="maintenance-header-sub">Quản lý bảo dưỡng và hóa đơn</div>
          </div>
        </div>
        <button className="maintenance-add" onClick={() => setShowAddModal(true)}>
          <FiPlus /> Tạo hóa đơn mới
        </button>
      </div>

      <div className="maintenance-stats">
        <div className="stat-card">
          <div className="stat-label">Tổng hóa đơn</div>
          <div className="stat-value">{stats.totalInvoices || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng chi phí</div>
          <div className="stat-value">{stats.totalCost || "0đ"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Dịch vụ khả dụng</div>
          <div className="stat-value">{stats.availableServices || 0}</div>
        </div>
      </div>

      <div className="maintenance-content">
        <div className="maintenance-left">
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

          <div className="maintenance-list">
            {loading ? (
              <div className="loading-cell">Đang tải...</div>
            ) : filteredRecords.length === 0 ? (
              <div className="empty-cell">Không tìm thấy bản ghi</div>
            ) : (
              filteredRecords.map((record) => {
                const badge = getStatusBadge(record.status);
                return (
                  <div className="maintenance-card" key={record.id}>
                    <div className="maintenance-card-top">
                      <div>
                        <div className="inv-id">INV-{record.id}</div>
                        <div className="inv-meta">Xe {record.vehicle} • {record.type}</div>
                      </div>
                      <div>
                        <div className={`status-badge ${badge.class}`}>{badge.text}</div>
                      </div>
                    </div>

                    <div className="maintenance-card-body">
                      <div className="mc-row">
                        <div>
                          <div className="mc-label">Xưởng</div>
                          <div className="mc-value">{record.workshop || "Garage"}</div>
                        </div>
                        <div>
                          <div className="mc-label">Ngày</div>
                          <div className="mc-value">{record.scheduledDate}</div>
                        </div>
                        <div>
                          <div className="mc-label">Kỹ thuật viên</div>
                          <div className="mc-value">{record.technician || "-"}</div>
                        </div>
                      </div>

                      <div className="service-lines">
                        <div className="service-line">
                          <div className="service-name">Thay dầu động cơ</div>
                          <div className="service-cost">500,000đ</div>
                        </div>
                        <div className="service-line">
                          <div className="service-name">Kiểm tra tổng quát</div>
                          <div className="service-cost">300,000đ</div>
                        </div>
                      </div>

                      <div className="maintenance-total">
                        <div>Tổng cộng</div>
                        <div className="total-amount">800,000đ</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {showAddModal && (
            <MaintenanceAddModal
              onClose={() => setShowAddModal(false)}
              onSave={(rec) => {
                setRecords((prev) => [rec, ...prev]);
                setShowAddModal(false);
              }}
              vehicles={records.map((r) => r.vehicle).filter(Boolean)}
            />
          )}
        </div>

        <aside className="maintenance-right">
          <div className="service-list">
            <div className="service-item">
              <div className="service-title">Thay dầu động cơ</div>
              <div className="service-sub">Bảo dưỡng</div>
              <div className="service-price">500,000đ</div>
            </div>
            <div className="service-item">
              <div className="service-title">Thay phanh</div>
              <div className="service-sub">Sửa chữa</div>
              <div className="service-price">1,200,000đ</div>
            </div>
            <div className="service-item">
              <div className="service-title">Kiểm tra tổng quát</div>
              <div className="service-sub">Kiểm tra</div>
              <div className="service-price">300,000đ</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Maintenance;
