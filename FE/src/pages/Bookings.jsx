import React, { useState, useEffect } from "react";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Bookings.css";
import Pagination from "../components/Pagination";
import CustomSelect from "../components/CustomSelect";
import { API_CONFIG } from "../config/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stats state - tổng thể không phụ thuộc pagination
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
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
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  // Load bookings from API
  useEffect(() => {
    loadBookings();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  // Load stats once on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadBookings = async () => {
    try {
      setTableLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.append("pageNumber", pagination.currentPage);
      queryParams.append("pageSize", pagination.pageSize);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.dateFrom) queryParams.append("fromDate", filters.dateFrom);
      if (filters.dateTo) queryParams.append("toDate", filters.dateTo);

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
      const bookingsList = data.objects || data.items || data || [];
      setBookings(Array.isArray(bookingsList) ? bookingsList : []);
      setPagination((prev) => ({
        ...prev,
        totalItems: data.total || bookingsList.length || 0,
        totalPages: Math.ceil(
          (data.total || bookingsList.length || 0) / prev.pageSize
        ),
      }));

      setError(null);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      setBookings([]);
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
          completed: data.completed || 0,
        });
      }
    } catch (err) {
      console.error("Error loading stats:", err);
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
      // If it's a full datetime, extract time
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
      pending: "Chờ xác nhận",
      waiting: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      assigned: "Đã phân công",
      completed: "Hoàn thành",
      done: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status?.toLowerCase()] || status || "Không rõ";
  };

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "assigned", label: "Đã phân công" },
    { value: "completed", label: "Hoàn thành" },
  ];

  if (loading) {
    return (
      <div className="bookings-page">
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
    <div className="bookings-page">
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

      <div className="bookings-header-simple">
        <div>
          <div className="bookings-header-title">Lịch đặt trước</div>
          <div className="bookings-header-subtitle">
            Quản lý các chuyến đã được đặt lịch
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

      <div className="bookings-stats-row">
        <div className="booking-stat">
          <div className="booking-stat-label">Tổng số</div>
          <div className="booking-stat-value">{stats.total}</div>
        </div>
        <div className="booking-stat">
          <div className="booking-stat-label">Chờ xác nhận</div>
          <div className="booking-stat-value">{stats.pending}</div>
        </div>
        <div className="booking-stat">
          <div className="booking-stat-label">Đã xác nhận</div>
          <div className="booking-stat-value">{stats.confirmed}</div>
        </div>
        <div className="booking-stat">
          <div className="booking-stat-label">Hoàn thành</div>
          <div className="booking-stat-value">{stats.completed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bookings-filters">
        <CustomSelect
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          options={statusOptions}
          placeholder="Tất cả trạng thái"
        />

        <input
          type="date"
          className="bookings-date-input"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          placeholder="Từ ngày"
        />

        <input
          type="date"
          className="bookings-date-input"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          placeholder="Đến ngày"
        />
      </div>

      <div className="bookings-list">
        <div className="bookings-table-card">
          <div className="bookings-table-wrap">
            <table className="bookings-table">
              <thead>
                <tr>
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
                      colSpan="8"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div className="line-spinner"></div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      Không có lịch đặt trước nào
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.tripID} className="bookings-tr">
                      <td className="bookings-td">
                        <div className="booking-customer-name">
                          {booking.customerName || "-"}
                        </div>
                        <div className="booking-customer-id">
                          ID: {booking.tripID}
                        </div>
                      </td>
                      <td className="bookings-td">
                        <div>{booking.customerPhone || "-"}</div>
                        <div className="booking-email">
                          {booking.customerEmail || "-"}
                        </div>
                      </td>
                      <td className="bookings-td">
                        <div
                          className="booking-route"
                          title={`${booking.pickupLocation || ""} → ${
                            booking.dropoffLocation || ""
                          }`}
                        >
                          {booking.pickupLocation || "-"}
                          {booking.dropoffLocation && (
                            <>
                              {" → "}
                              {booking.dropoffLocation}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="bookings-td">
                        <div>{formatDate(booking.scheduledDate)}</div>
                        <div className="booking-time">
                          {formatTime(booking.scheduledTime)}
                        </div>
                      </td>
                      <td className="bookings-td">
                        <div className="booking-vehicle-type">
                          {booking.requestedVehicleType || "-"}
                        </div>
                        {booking.requestedCargo && (
                          <div className="booking-cargo">
                            {booking.requestedCargo}
                          </div>
                        )}
                      </td>
                      <td className="bookings-td">
                        {booking.assignedVehiclePlate ? (
                          <>
                            <div className="booking-assigned-plate">
                              {booking.assignedVehiclePlate}
                            </div>
                            {booking.assignedDriverName && (
                              <div className="booking-assigned-driver">
                                {booking.assignedDriverName}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="booking-not-assigned">
                            Chưa phân công
                          </div>
                        )}
                      </td>
                      <td className="bookings-td">
                        <span
                          className={`bookings-status-badge status-${(
                            booking.status || "unknown"
                          ).toLowerCase()}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="bookings-td bookings-td-actions">
                        <div className="bookings-actions">
                          <button
                            className="bookings-icon-btn bookings-icon-view"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          {booking.status?.toLowerCase() === "pending" && (
                            <>
                              <button
                                className="bookings-icon-btn bookings-icon-confirm"
                                title="Xác nhận"
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                className="bookings-icon-btn bookings-icon-reject"
                                title="Từ chối"
                              >
                                <FaTimesCircle />
                              </button>
                            </>
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
    </div>
  );
}
