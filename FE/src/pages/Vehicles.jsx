import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Vehicles.css";
import Pagination from "../components/Pagination";
import CustomSelect from "../components/CustomSelect";
import VehicleDetailModal from "../components/VehicleDetailModal";
import VehicleEditModal from "../components/VehicleEditModal";
import { getVehicles, deleteVehicle } from "../services/vehicleAPI";
import vehicleAPI from "../services/vehicleAPI";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  // Options state
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    vehicleStatus: "",
    vehicleType: "",
    fuelType: "",
    vehicleBrand: "",
  });

  // Load vehicles from API
  useEffect(() => {
    loadVehicles();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  // Load options on mount
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [statuses, types, fuelTypes, brands] = await Promise.all([
        vehicleAPI.getVehicleStatuses(),
        vehicleAPI.getVehicleTypes(),
        vehicleAPI.getFuelTypes(),
        vehicleAPI.getVehicleBrands(),
      ]);
      setStatusOptions([
        { value: "", label: "Tất cả trạng thái" },
        ...statuses,
      ]);
      setTypeOptions([{ value: "", label: "Tất cả loại xe" }, ...types]);
      setFuelTypeOptions([
        { value: "", label: "Tất cả nhiên liệu" },
        ...fuelTypes,
      ]);
      setBrandOptions([{ value: "", label: "Tất cả hãng" }, ...brands]);
    } catch (err) {
      console.error("Error loading options:", err);
    }
  };

  const loadVehicles = async () => {
    try {
      setTableLoading(true);

      const data = await getVehicles({
        pageNumber: pagination.currentPage,
        pageSize: pagination.pageSize,
        vehicleStatus: filters.vehicleStatus,
        vehicleType: filters.vehicleType,
        fuelType: filters.fuelType,
        vehicleBrand: filters.vehicleBrand,
      });

      const vehiclesList = data.objects || data.items || data || [];
      setVehicles(Array.isArray(vehiclesList) ? vehiclesList : []);
      setPagination((prev) => ({
        ...prev,
        totalItems: data.total || vehiclesList.length || 0,
        totalPages: Math.ceil(
          (data.total || vehiclesList.length || 0) / prev.pageSize
        ),
      }));

      setError(null);
    } catch (err) {
      console.error("Error loading vehicles:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      setVehicles([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) {
      return;
    }

    try {
      await deleteVehicle(vehicleId);
      await loadVehicles();
      toast.success("Xóa phương tiện thành công!");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      toast.error("Không thể xóa phương tiện. Vui lòng thử lại.");
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

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(
      (v) =>
        (v.vehicleStatus || "").toLowerCase() === "available" ||
        (v.vehicleStatus || "") === "Sẵn sàng"
    ).length,
    inUse: vehicles.filter(
      (v) =>
        (v.vehicleStatus || "").toLowerCase() === "in_use" ||
        (v.vehicleStatus || "") === "Đang dùng"
    ).length,
    maintenance: vehicles.filter(
      (v) =>
        (v.vehicleStatus || "").toLowerCase() === "maintenance" ||
        (v.vehicleStatus || "") === "Bảo trì"
    ).length,
  };

  if (loading) {
    return (
      <div className="vehicles-page">
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
    <div className="vehicles-page">
      <div className="vehicles-header-simple">
        <div>
          <div className="vehicles-header-title">Quản lý phương tiện</div>
          <div className="vehicles-header-subtitle">
            Quản lý xe và thiết bị vận chuyển
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

      <div className="vehicles-stats-row">
        <div className="vehicle-stat">
          <div className="vehicle-stat-label">Tổng số</div>
          <div className="vehicle-stat-value">{stats.total}</div>
        </div>
        <div className="vehicle-stat">
          <div className="vehicle-stat-label">Sẵn sàng</div>
          <div className="vehicle-stat-value">{stats.available}</div>
        </div>
        <div className="vehicle-stat">
          <div className="vehicle-stat-label">Đang dùng</div>
          <div className="vehicle-stat-value">{stats.inUse}</div>
        </div>
        <div className="vehicle-stat">
          <div className="vehicle-stat-label">Bảo trì</div>
          <div className="vehicle-stat-value">{stats.maintenance}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="vehicles-filters">
        <CustomSelect
          value={filters.vehicleStatus}
          onChange={(value) => handleFilterChange("vehicleStatus", value)}
          options={statusOptions}
          placeholder="Tất cả trạng thái"
        />

        <CustomSelect
          value={filters.vehicleType}
          onChange={(value) => handleFilterChange("vehicleType", value)}
          options={typeOptions}
          placeholder="Tất cả loại xe"
        />

        <CustomSelect
          value={filters.fuelType}
          onChange={(value) => handleFilterChange("fuelType", value)}
          options={fuelTypeOptions}
          placeholder="Tất cả nhiên liệu"
        />

        <CustomSelect
          value={filters.vehicleBrand}
          onChange={(value) => handleFilterChange("vehicleBrand", value)}
          options={brandOptions}
          placeholder="Tất cả hãng"
        />
      </div>

      <div className="vehicles-list">
        <div className="vehicles-table-card">
          <div className="vehicles-table-wrap">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Biển số</th>
                  <th>Loại xe</th>
                  <th>Model</th>
                  <th>Năm SX</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div className="line-spinner"></div>
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      Không có phương tiện nào
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleID} className="vehicles-tr">
                      <td className="vehicles-td">
                        <div className="vehicles-plate-text">
                          {vehicle.licensePlate}
                        </div>
                      </td>
                      <td className="vehicles-td">
                        <div
                          className="vehicles-type-text"
                          title={vehicle.vehicleType}
                        >
                          {vehicle.vehicleType?.length > 20
                            ? `${vehicle.vehicleType.substring(0, 20)}...`
                            : vehicle.vehicleType || "-"}
                        </div>
                      </td>
                      <td className="vehicles-td">
                        <div
                          className="vehicles-model-text"
                          title={vehicle.vehicleModel}
                        >
                          {vehicle.vehicleModel?.length > 25
                            ? `${vehicle.vehicleModel.substring(0, 25)}...`
                            : vehicle.vehicleModel || "-"}
                        </div>
                      </td>
                      <td className="vehicles-td">
                        <div className="vehicles-year-text">
                          {vehicle.manufacturedYear || "-"}
                        </div>
                      </td>
                      <td className="vehicles-td">
                        <span
                          className={`vehicles-status-badge status-${(
                            vehicle.vehicleStatus || "unknown"
                          )
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/đ/g, "d")
                            .replace(/\s+/g, "_")}`}
                        >
                          {(() => {
                            const status = vehicle.vehicleStatus || "";
                            if (status === "available" || status === "Sẵn sàng")
                              return "Sẵn sàng";
                            if (
                              status === "in_use" ||
                              status === "Đang dùng" ||
                              status === "on_trip" ||
                              status === "Đang chạy"
                            )
                              return "Đang dùng";
                            if (
                              status === "maintenance" ||
                              status === "Bảo trì"
                            )
                              return "Bảo trì";
                            return status || "Không rõ";
                          })()}
                        </span>
                      </td>
                      <td className="vehicles-td vehicles-td-actions">
                        <div className="vehicles-actions">
                          <button
                            className="vehicles-icon-btn vehicles-icon-view"
                            title="Xem chi tiết"
                            onClick={() =>
                              setSelectedVehicleId(vehicle.vehicleID)
                            }
                          >
                            <FaEye />
                          </button>
                          <button
                            className="vehicles-icon-btn vehicles-icon-edit"
                            title="Chỉnh sửa"
                            onClick={() =>
                              setEditingVehicleId(vehicle.vehicleID)
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="vehicles-icon-btn vehicles-icon-delete"
                            title="Xóa"
                            onClick={() =>
                              handleDeleteVehicle(vehicle.vehicleID)
                            }
                          >
                            <FaTrash />
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

      {selectedVehicleId && (
        <VehicleDetailModal
          vehicleId={selectedVehicleId}
          onClose={() => setSelectedVehicleId(null)}
        />
      )}

      {editingVehicleId && (
        <VehicleEditModal
          vehicleId={editingVehicleId}
          onClose={() => setEditingVehicleId(null)}
          onSave={async () => {
            setEditingVehicleId(null);
            await loadVehicles();
            toast.success("Cập nhật phương tiện thành công!");
          }}
        />
      )}

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
