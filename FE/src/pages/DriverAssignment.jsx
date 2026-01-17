import React, { useState, useEffect } from "react";
import { FaUserCog, FaRoute, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DriverAssignment.css";
import Pagination from "../components/Pagination";
import CustomSelect from "../components/CustomSelect";
import { API_CONFIG } from "../config/api";

export default function DriverAssignment() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);

  // Assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    assigned: 0,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: "pending",
  });

  useEffect(() => {
    loadTrips();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadTrips = async () => {
    try {
      setTableLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.append("pageNumber", pagination.currentPage);
      queryParams.append("pageSize", pagination.pageSize);
      if (filters.status) queryParams.append("status", filters.status);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Trip/booked?${queryParams}`,
        {
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tripsList = data.objects || data.items || data || [];
      setTrips(Array.isArray(tripsList) ? tripsList : []);
      setPagination((prev) => ({
        ...prev,
        totalItems: data.total || tripsList.length || 0,
        totalPages: Math.ceil(
          (data.total || tripsList.length || 0) / prev.pageSize
        ),
      }));

      setError(null);
    } catch (err) {
      console.error("Error loading trips:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      setTrips([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/Trip/booked/stats`, {
        headers: API_CONFIG.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          total: data.total || 0,
          pending: data.pending || 0,
          confirmed: data.confirmed || 0,
          assigned: data.assigned || 0,
        });
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const openAssignModal = async (trip) => {
    setSelectedTrip(trip);
    setSelectedVehicleId("");
    setSelectedDriverId("");
    setAvailableVehicles([]);
    setAvailableDrivers([]);
    setShowAssignModal(true);

    // Load available vehicles
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Assignment/${trip.tripID}/available-vehicles`,
        {
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (response.ok) {
        const vehicles = await response.json();
        setAvailableVehicles(vehicles || []);
      }
    } catch (err) {
      console.error("Error loading vehicles:", err);
      toast.error("Không thể tải danh sách xe");
    }
  };

  const handleVehicleChange = async (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setSelectedDriverId("");
    setAvailableDrivers([]);

    if (!vehicleId) return;

    // Load available drivers for selected vehicle
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Assignment/vehicles/${vehicleId}/available-drivers`,
        {
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (response.ok) {
        const drivers = await response.json();
        setAvailableDrivers(drivers || []);
      }
    } catch (err) {
      console.error("Error loading drivers:", err);
      toast.error("Không thể tải danh sách tài xế");
    }
  };

  const handleAssign = async () => {
    if (!selectedVehicleId || !selectedDriverId) {
      toast.error("Vui lòng chọn xe và tài xế");
      return;
    }

    setAssignLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Assignment/${selectedTrip.tripID}/assign?vehicleId=${selectedVehicleId}&driverId=${selectedDriverId}`,
        {
          method: "POST",
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Phân công thành công!");
      setShowAssignModal(false);
      await loadTrips();
      await loadStats();
    } catch (err) {
      console.error("Error assigning:", err);
      toast.error("Không thể phân công. Vui lòng thử lại.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: 1,
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    try {
      if (timeString.includes("T")) {
        const date = new Date(timeString);
        return date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Chờ phân công",
      waiting: "Chờ phân công",
      confirmed: "Đã xác nhận",
      assigned: "Đã phân công",
    };
    return statusMap[status?.toLowerCase()] || status || "Không rõ";
  };

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ phân công" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "assigned", label: "Đã phân công" },
  ];

  if (loading) {
    return (
      <div className="assignment-page">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div className="line-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="assignment-header-simple">
        <div>
          <div className="assignment-header-title">Phân công tài xế</div>
          <div className="assignment-header-subtitle">
            Quản lý chuyến đi và phân công tài xế
          </div>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            background: "#fee",
            color: "#c33",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #fcc",
          }}
        >
          {error}
        </div>
      )}

      <div className="assignment-stats-row">
        <div className="assignment-stat">
          <div className="assignment-stat-label">Tổng số</div>
          <div className="assignment-stat-value">{stats.total}</div>
        </div>
        <div className="assignment-stat">
          <div className="assignment-stat-label">Chờ phân công</div>
          <div className="assignment-stat-value">{stats.pending}</div>
        </div>
        <div className="assignment-stat">
          <div className="assignment-stat-label">Đã xác nhận</div>
          <div className="assignment-stat-value">{stats.confirmed}</div>
        </div>
        <div className="assignment-stat">
          <div className="assignment-stat-label">Đã phân công</div>
          <div className="assignment-stat-value">{stats.assigned}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="assignment-filters">
        <CustomSelect
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          options={statusOptions}
          placeholder="Tất cả trạng thái"
        />
      </div>

      <div className="assignment-list">
        <div className="assignment-table-card">
          <div className="assignment-table-wrap">
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Lộ trình</th>
                  <th>Thời gian</th>
                  <th>Loại xe</th>
                  <th>Phân công</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div className="line-spinner"></div>
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      Không có chuyến đi nào
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.tripID} className="assignment-tr">
                      <td className="assignment-td">
                        <div className="assignment-trip-id">#{trip.tripID}</div>
                      </td>
                      <td className="assignment-td">
                        <div className="assignment-customer-name">
                          {trip.customerName || "-"}
                        </div>
                      </td>
                      <td className="assignment-td">
                        <div>{trip.customerPhone || "-"}</div>
                        <div className="assignment-email">
                          {trip.customerEmail || "-"}
                        </div>
                      </td>
                      <td className="assignment-td">
                        <div
                          className="assignment-route"
                          title={`${trip.pickupLocation || ""} → ${
                            trip.dropoffLocation || ""
                          }`}
                        >
                          {trip.pickupLocation || "-"}
                          {trip.dropoffLocation && (
                            <>
                              {" → "}
                              {trip.dropoffLocation}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="assignment-td">
                        <div>{formatDate(trip.scheduledDate)}</div>
                        <div className="assignment-time">
                          {formatTime(trip.scheduledTime)}
                        </div>
                      </td>
                      <td className="assignment-td">
                        <div className="assignment-vehicle-type">
                          {trip.requestedVehicleType || "-"}
                        </div>
                      </td>
                      <td className="assignment-td">
                        {trip.assignedVehiclePlate ? (
                          <>
                            <div className="assignment-assigned-plate">
                              {trip.assignedVehiclePlate}
                            </div>
                            {trip.assignedDriverName && (
                              <div className="assignment-assigned-driver">
                                {trip.assignedDriverName}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="assignment-not-assigned">
                            Chưa phân công
                          </div>
                        )}
                      </td>
                      <td className="assignment-td">
                        <span
                          className={`assignment-status-badge status-${(
                            trip.status || "unknown"
                          ).toLowerCase()}`}
                        >
                          {getStatusLabel(trip.status)}
                        </span>
                      </td>
                      <td className="assignment-td assignment-td-actions">
                        <div className="assignment-actions">
                          {!trip.assignedVehiclePlate && (
                            <button
                              className="assignment-btn-assign"
                              onClick={() => openAssignModal(trip)}
                            >
                              <FaRoute /> Phân công
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedTrip && (
        <div
          className="assignment-modal-backdrop"
          onClick={() => setShowAssignModal(false)}
        >
          <div
            className="assignment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="assignment-modal-header">
              <h3>Phân công chuyến đi #{selectedTrip.tripID}</h3>
              <button
                className="assignment-modal-close"
                onClick={() => setShowAssignModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="assignment-modal-body">
              <div className="assignment-modal-info">
                <div className="assignment-modal-info-row">
                  <span className="assignment-modal-label">Khách hàng:</span>
                  <span className="assignment-modal-value">
                    {selectedTrip.customerName}
                  </span>
                </div>
                <div className="assignment-modal-info-row">
                  <span className="assignment-modal-label">Lộ trình:</span>
                  <span className="assignment-modal-value">
                    {selectedTrip.pickupLocation} →{" "}
                    {selectedTrip.dropoffLocation}
                  </span>
                </div>
                <div className="assignment-modal-info-row">
                  <span className="assignment-modal-label">Loại xe:</span>
                  <span className="assignment-modal-value">
                    {selectedTrip.requestedVehicleType}
                  </span>
                </div>
              </div>

              <div className="assignment-modal-field">
                <label>
                  Chọn xe <span className="assignment-required">*</span>
                </label>
                <select
                  className="assignment-modal-select"
                  value={selectedVehicleId}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                >
                  <option value="">-- Chọn phương tiện --</option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                      {vehicle.licensePlate} - {vehicle.brand} {vehicle.model} (
                      {vehicle.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="assignment-modal-field">
                <label>
                  Chọn tài xế <span className="assignment-required">*</span>
                </label>
                <select
                  className="assignment-modal-select"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  disabled={!selectedVehicleId}
                >
                  <option value="">-- Chọn tài xế --</option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.driverId} value={driver.driverId}>
                      {driver.fullName} - Bằng: {driver.licenses}
                    </option>
                  ))}
                </select>
                {!selectedVehicleId && (
                  <div className="assignment-modal-hint">
                    Vui lòng chọn xe trước
                  </div>
                )}
              </div>
            </div>

            <div className="assignment-modal-footer">
              <button
                className="assignment-modal-btn-cancel"
                onClick={() => setShowAssignModal(false)}
                disabled={assignLoading}
              >
                Hủy
              </button>
              <button
                className="assignment-modal-btn-confirm"
                onClick={handleAssign}
                disabled={
                  assignLoading || !selectedVehicleId || !selectedDriverId
                }
              >
                {assignLoading ? "Đang xử lý..." : "Xác nhận phân công"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
