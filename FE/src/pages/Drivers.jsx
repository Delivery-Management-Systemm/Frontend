import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Drivers.css";
import Pagination from "../components/Pagination";
import CustomSelect from "../components/CustomSelect";
import DriverDetailModal from "../components/DriverDetailModal";
import DriverEditModal from "../components/DriverEditModal";
import DriverAddModal from "../components/DriverAddModal";
import ConfirmModal from "../components/ConfirmModal";
import { getDrivers, deleteDriver, createDriver } from "../services/driverAPI";
import driverAPI from "../services/driverAPI";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [deletingDriverId, setDeletingDriverId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("Xác nhận");

  // Options state
  const [statusOptions, setStatusOptions] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    driverStatus: "",
  });

  // Load drivers from API
  useEffect(() => {
    loadDrivers();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  // Load options on mount
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const statuses = await driverAPI.getDriverStatuses();
      setStatusOptions([
        { value: "", label: "Tất cả trạng thái" },
        ...statuses,
      ]);
    } catch (err) {
      console.error("Error loading options:", err);
    }
  };

  const loadDrivers = async () => {
    try {
      setTableLoading(true);

      const data = await getDrivers({
        pageNumber: pagination.currentPage,
        pageSize: pagination.pageSize,
        driverStatus: filters.driverStatus,
      });

      const driversList = data.objects || data.items || data || [];
      // normalize to array
      let normalized = Array.isArray(driversList) ? driversList : [];

      // If "All statuses" (no driverStatus filter) is selected, sort by ID ascending
      if (!filters.driverStatus) {
        normalized = normalized.slice().sort((a, b) => {
          const aId = Number(a.driverID ?? a.id ?? 0) || 0;
          const bId = Number(b.driverID ?? b.id ?? 0) || 0;
          return aId - bId;
        });
      }

      setDrivers(normalized);
      const totalCount = data.total ?? normalized.length ?? 0;
      setPagination((prev) => ({
        ...prev,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / prev.pageSize),
      }));

      setError(null);
    } catch (err) {
      console.error("Error loading drivers:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      setDrivers([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const handleCreateDriver = async (driverData) => {
    try {
      // Map license types to LicenseClassID (simplified mapping)
      const licenseMap = {
        "Bằng B1": 1,
        "Bằng B": 2,
        "Bằng C1": 3,
        "Bằng C": 4,
        "Bằng D1": 5,
        "Bằng D2": 6,
        "Bằng D": 7,
        "Bằng BE": 8,
        "Bằng C1E": 9,
        "Bằng CE": 10,
        "Bằng D1E": 11,
        "Bằng D2E": 12,
        "Bằng DE": 13,
      };

      // Map form data to API format
      const apiData = {
        fullName: driverData.name || "-",
        phone: driverData.phone || "-",
        // If email is empty, generate a dummy email based on phone number
        email:
          driverData.email && driverData.email.trim()
            ? driverData.email.trim()
            : `driver${driverData.phone.replace(/\D/g, "")}@fms.local`,
        birthPlace: "-",
        experienceYears: Number(driverData.expYears) || 0,
        licenses: driverData.licenseTypes.map((licenseType) => ({
          licenseClassID: licenseMap[licenseType] || 1,
          expiryDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 5)
          ).toISOString(), // Default 5 years from now
        })),
        driverStatus:
          driverData.status === "Sẵn sàng"
            ? "available"
            : driverData.status === "Đang lái"
            ? "on_trip"
            : "offline",
        password: "Driver@123", // Default password
      };

      await createDriver(apiData);
      await loadDrivers(); // Reload to get updated data
      setShowAddModal(false);
      toast.success("Thêm tài xế thành công!");
    } catch (err) {
      console.error("Error creating driver:", err);
      toast.error("Không thể thêm tài xế. Vui lòng thử lại.");
    }
  };

  const handleDeleteDriver = async (driverId) => {
    try {
      setDeletingDriverId(driverId);
      await deleteDriver(driverId);
      // Optimistically remove from current list without full reload
      setDrivers((prev) => prev.filter((d) => d.driverID !== driverId));
      setPagination((prev) => ({
        ...prev,
        totalItems: Math.max(0, prev.totalItems - 1),
      }));
      toast.success("Xóa tài xế thành công!");
    } catch (err) {
      console.error("Error deleting driver:", err);
      toast.error("Không thể xóa tài xế. Vui lòng thử lại.");
    } finally {
      setDeletingDriverId(null);
    }
  };

  const promptDeleteDriver = (driverId) => {
    setConfirmTarget(driverId);
    setConfirmTitle("Xóa tài xế");
    setConfirmMessage("Bạn có chắc chắn muốn xóa tài xế này?");
    setConfirmOpen(true);
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

  const stats = {
    total: drivers.length,
    available: drivers.filter(
      (d) => (d.status || d.driverStatus) === "available"
    ).length,
    onTrip: drivers.filter((d) => (d.status || d.driverStatus) === "on_trip")
      .length,
    offline: drivers.filter((d) => (d.status || d.driverStatus) === "offline")
      .length,
  };

  if (loading) {
    return (
      <div className="drivers-page">
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
    <div className="drivers-page">
      <div className="drivers-header-simple">
        <div>
          <div className="drivers-header-title">Quản lý tài xế</div>
          <div className="drivers-header-subtitle">
            Quản lý thông tin và lịch trình tài xế
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

      <div className="drivers-stats-row">
        <div className="driver-stat">
          <div className="driver-stat-label">Tổng số</div>
          <div className="driver-stat-value">{stats.total}</div>
        </div>
        <div className="driver-stat">
          <div className="driver-stat-label">Sẵn sàng</div>
          <div className="driver-stat-value">{stats.available}</div>
        </div>
        <div className="driver-stat">
          <div className="driver-stat-label">Đang chạy</div>
          <div className="driver-stat-value">{stats.onTrip}</div>
        </div>
        <div className="driver-stat">
          <div className="driver-stat-label">Nghỉ</div>
          <div className="driver-stat-value">{stats.offline}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="drivers-filters">
        <CustomSelect
          value={filters.driverStatus}
          onChange={(value) => handleFilterChange("driverStatus", value)}
          options={statusOptions}
          placeholder="Tất cả trạng thái"
        />

        <button
          className="drivers-new-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Thêm tài xế
        </button>
      </div>

      <div className="drivers-list">
        <div className="drivers-table-card">
          <div className="drivers-table-wrap">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Tài xế</th>
                  <th>Liên hệ</th>
                  <th>Bằng lái</th>
                  <th>Kinh nghiệm</th>
                  <th>Đánh giá</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div className="line-spinner"></div>
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      Không có tài xế nào
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.driverID} className="drivers-tr">
                      <td className="drivers-td">
                        <div className="drivers-name-cell">
                          <div className="drivers-avatar">
                            {(driver.name &&
                              driver.name.charAt(0).toUpperCase()) ||
                              "D"}
                          </div>
                          <div>
                            <div
                              className="drivers-name-text"
                              title={driver.name || "-"}
                            >
                              {driver.name && driver.name.length > 25
                                ? `${driver.name.substring(0, 25)}...`
                                : driver.name || "-"}
                            </div>
                            <div className="drivers-id-text">
                              ID: {driver.driverID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="drivers-td">
                        <div className="drivers-phone-text">
                          {driver.phone || "-"}
                        </div>
                        <div
                          className="drivers-email-text"
                          title={driver.email || "-"}
                        >
                          {driver.email && driver.email.length > 20
                            ? `${driver.email.substring(0, 20)}...`
                            : driver.email || "-"}
                        </div>
                      </td>
                      <td className="drivers-td">
                        <div className="drivers-licenses-text">
                          {driver.licenses && driver.licenses.length > 0
                            ? driver.licenses.join(", ")
                            : "-"}
                        </div>
                      </td>
                      <td className="drivers-td">
                        <div className="drivers-exp-text">
                          {driver.experienceYears || 0} năm
                        </div>
                      </td>
                      <td className="drivers-td">
                        <div className="drivers-rating-text">
                          ⭐ {driver.rating ? driver.rating.toFixed(1) : "0.0"}
                        </div>
                      </td>
                      <td className="drivers-td">
                        <span
                          className={`drivers-status-badge status-${(
                            driver.status ||
                            driver.driverStatus ||
                            "unknown"
                          )
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/đ/g, "d")
                            .replace(/\s+/g, "_")}`}
                        >
                          {(driver.status || driver.driverStatus) ===
                            "available" ||
                          (driver.status || driver.driverStatus) === "Sẵn sàng"
                            ? "Sẵn sàng"
                            : (driver.status || driver.driverStatus) ===
                                "on_trip" ||
                              (driver.status || driver.driverStatus) ===
                                "Đang chạy"
                            ? "Đang chạy"
                            : (driver.status || driver.driverStatus) ===
                                "offline" ||
                              (driver.status || driver.driverStatus) === "Nghỉ"
                            ? "Nghỉ"
                            : driver.status ||
                              driver.driverStatus ||
                              "Không rõ"}
                        </span>
                      </td>
                      <td className="drivers-td drivers-td-actions">
                        <div className="drivers-actions">
                          <button
                            className="drivers-icon-btn drivers-icon-view"
                            title="Xem chi tiết"
                            onClick={() => setSelectedDriverId(driver.driverID)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="drivers-icon-btn drivers-icon-edit"
                            title="Chỉnh sửa"
                            onClick={() => setEditingDriverId(driver.driverID)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="drivers-icon-btn drivers-icon-delete"
                            title="Xóa"
                            onClick={() => promptDeleteDriver(driver.driverID)}
                            disabled={deletingDriverId === driver.driverID}
                          >
                            {deletingDriverId === driver.driverID ? (
                              "..."
                            ) : (
                              <FaTrash />
                            )}
                          </button>
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

      {selectedDriverId && (
        <DriverDetailModal
          driverId={selectedDriverId}
          onClose={() => setSelectedDriverId(null)}
        />
      )}

      {editingDriverId && (
        <DriverEditModal
          driverId={editingDriverId}
          onClose={() => setEditingDriverId(null)}
          onSave={async () => {
            setEditingDriverId(null);
            await loadDrivers();
            toast.success("Cập nhật tài xế thành công!");
          }}
        />
      )}

      {showAddModal && (
        <DriverAddModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateDriver}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={() => {
          if (confirmTarget) {
            handleDeleteDriver(confirmTarget);
          }
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
      />

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
    </div>
  );
}
