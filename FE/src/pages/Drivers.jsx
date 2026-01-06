import React, { useMemo, useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrash,
  FaEye,
  FaFilter,
  FaStar,
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

import DriverAddModal from "../components/DriverAddModal";
import DriverViewModal from "../components/DriverViewModal";
import { getDrivers } from "../services/driverAPI";
import "./Drivers.css";

// ========================= CONFIG =========================

const driversConfig = {
  page: {
    title: "Quản lý tài xế",
    subtitlePrefix: "Tổng số:",
    addBtn: "Thêm tài xế",
    filtersTitle: "Bộ lọc",
    searchPlaceholder: "Tìm kiếm tên, SĐT, GPLX...",
  },
  statuses: {
    all: "Tất cả trạng thái",
    driving: { label: "Đang lái" },
    ready: { label: "Sẵn sàng" },
    duty: { label: "Đang công tác" },
    leave: { label: "Nghỉ phép" },
    available: { label: "Có sẵn" },
    on_trip: { label: "Đang chạy" },
  },
  licenseTypes: {
    all: "Tất cả loại bằng",
    B2: "B2",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    FC: "FC",
    FE: "FE",
    FD: "FD",
  },
};

// ============================== HELPERS ==============================

function driversGetInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts[parts.length - 1]?.[0] || "";
  return (first + last).toUpperCase() || "D";
}

function driversGetShiftPillClass(shift) {
  // removed - shift UI deleted
}

function driversGetStatusPillClass(status) {
  if (status === "driving") return "drivers-pill-status-driving";
  if (status === "ready") return "drivers-pill-status-ready";
  if (status === "duty") return "drivers-pill-status-duty";
  return "drivers-pill-status-leave";
}

// ====================================================================

export default function Drivers() {
  const [driversData, setDriversData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driversSearch, setDriversSearch] = useState("");
  const [driversFilterStatus, setDriversFilterStatus] = useState("all");
  const [driversFilterLicense, setDriversFilterLicense] = useState("all");
  const [driversShowAddModal, setDriversShowAddModal] = useState(false);
  const [driversViewDriver, setDriversViewDriver] = useState(null);

  // Fetch drivers data on component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDrivers();

        // Map backend data to frontend format
        const mappedData = data.map(driver => ({
          id: driver.driverID,
          name: driver.name,
          phone: driver.phone,
          email: driver.email || "",
          licenses: driver.licenses || [],
          vehicle: driver.assignedVehicle && driver.assignedVehicle !== "Đang rảnh"
            ? { plate: driver.assignedVehicle, desc: "Đang chạy" }
            : null,
          expYears: driver.experienceYears || 0,
          rating: driver.rating || 0,
          status: mapDriverStatus(driver.status),
          statusSub: null,
        }));

        setDriversData(mappedData);
      } catch (err) {
        console.error('Error loading drivers:', err);
        setError('Không thể tải dữ liệu tài xế. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Map backend status to frontend status
  const mapDriverStatus = (backendStatus) => {
    switch (backendStatus?.toLowerCase()) {
      case 'on_trip':
        return 'driving';
      case 'available':
        return 'ready';
      case 'active':
        return 'ready';
      default:
        return backendStatus?.toLowerCase() || 'ready';
    }
  };

  const driversFiltered = useMemo(() => {
    const q = driversSearch.trim().toLowerCase();

    return driversData.filter((d) => {
      const driversMatchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.licenses.some((x) => String(x).toLowerCase().includes(q));
      const driversMatchesStatus =
        driversFilterStatus === "all" ? true : d.status === driversFilterStatus;

      const driversMatchesLicense =
        driversFilterLicense === "all"
          ? true
          : d.licenses.includes(driversFilterLicense);

      return (
        driversMatchesSearch &&
        driversMatchesStatus &&
        driversMatchesLicense
      );
    });
  }, [driversSearch, driversFilterStatus, driversFilterLicense, driversData]);

  const driversTotal = driversData.length;

  // Show loading state
  if (loading) {
    return (
      <div className="drivers-page">
        <div className="drivers-loading">
          <FaSpinner className="drivers-spinner" />
          <div>Đang tải dữ liệu tài xế...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="drivers-page">
        <div className="drivers-error">
          <FaExclamationTriangle />
          <div>{error}</div>
          <button
            type="button"
            className="drivers-primary-btn"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="drivers-page">

      {/* ================= HEADER CARD ================= */}
      <div className="drivers-card drivers-header">
        <div className="drivers-header-left">
          <div className="drivers-header-icon">
            <FaUsers />
          </div>

          <div>
            <div className="drivers-header-title">{driversConfig.page.title}</div>
            <div className="drivers-header-sub">
              {driversConfig.page.subtitlePrefix} {driversTotal} tài xế
            </div>
          </div>
        </div>

        <button
          type="button"
          className="drivers-primary-btn"
          onClick={() => setDriversShowAddModal(true)}
        >
          <FaPlus />
          {driversConfig.page.addBtn}
        </button>
      </div>

      {/* ================= FILTERS CARD ================= */}
      <div className="drivers-card drivers-filters">
        <div className="drivers-filters-title">
          <FaFilter />
          {driversConfig.page.filtersTitle}
        </div>

        <div className="drivers-filters-row">
          {/* Search */}
          <div className="drivers-input-wrap">
            <FaSearch className="drivers-input-icon" />
            <input
              className="drivers-input"
              value={driversSearch}
              onChange={(e) => setDriversSearch(e.target.value)}
              placeholder={driversConfig.page.searchPlaceholder}
            />
          </div>

          {/* Status */}
          <select
            className="drivers-select"
            value={driversFilterStatus}
            onChange={(e) => setDriversFilterStatus(e.target.value)}
          >
            <option value="all">{driversConfig.statuses.all}</option>
            {Object.entries(driversConfig.statuses)
              .filter(([k]) => k !== "all")
              .map(([key, v]) => (
                <option key={key} value={key}>
                  {v.label}
                </option>
              ))}
          </select>

          {/* License type */}
          <select
            className="drivers-select"
            value={driversFilterLicense}
            onChange={(e) => setDriversFilterLicense(e.target.value)}
          >
            {Object.entries(driversConfig.licenseTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="drivers-card drivers-table-card">
        <div className="drivers-table-wrap">
          <table className="drivers-table">
            <thead>
              <tr>
                <th className="drivers-th drivers-col-driver">TÀI XẾ</th>
                <th className="drivers-th">LIÊN HỆ</th>
                <th className="drivers-th">LOẠI BẰNG LÁI</th>
                <th className="drivers-th">PHƯƠNG TIỆN HIỆN TẠI</th>
                <th className="drivers-th">KINH NGHIỆM</th>
                <th className="drivers-th">ĐÁNH GIÁ</th>
                <th className="drivers-th">TRẠNG THÁI</th>
                <th className="drivers-th drivers-col-actions">THAO TÁC</th>
              </tr>
            </thead>

            <tbody>
              {driversFiltered.length === 0 ? (
                <tr>
                  <td className="drivers-empty" colSpan={8}>
                    Không có dữ liệu phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                driversFiltered.map((d) => (
                  <tr className="drivers-tr" key={d.id}>
                    {/* Driver */}
                    <td className="drivers-td drivers-col-driver">
                      <div className="drivers-driver-cell">
                        <div className="drivers-avatar">
                          {driversGetInitials(d.name)}
                        </div>
                        <div>
                          <div className="drivers-driver-name">{d.name}</div>
                          <div className="drivers-driver-id">ID: {d.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="drivers-td">
                      <div className="drivers-contact-phone">{d.phone}</div>
                      <div className="drivers-contact-email">{d.email}</div>
                    </td>

                    {/* Licenses */}
                    <td className="drivers-td">
                      <div className="drivers-license-chips">
                        {d.licenses.map((x) => (
                          <span key={x} className="drivers-chip">
                            {x}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="drivers-td">
                      {d.vehicle && d.vehicle.plate ? (
                        <div>
                          <div className="drivers-vehicle-plate">
                            {d.vehicle.plate}
                          </div>
                          {d.vehicle.desc ? (
                            <div className="drivers-vehicle-sub">
                              {d.vehicle.desc}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="drivers-vehicle-sub">Chưa có xe</div>
                      )}
                    </td>

                    {/* Experience */}
                    <td className="drivers-td">{d.expYears} năm</td>

                    {/* Rating */}
                    <td className="drivers-td">
                      <span className="drivers-rating">
                        <FaStar className="drivers-star" />
                        {d.rating}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="drivers-td">
                      <div className="drivers-status-stack">
                        <span
                          className={
                            "drivers-pill " + driversGetStatusPillClass(d.status)
                          }
                        >
                          {driversConfig.statuses[d.status]?.label || d.status}
                        </span>

                        {d.statusSub ? (
                          <div className="drivers-status-sub">{d.statusSub}</div>
                        ) : null}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="drivers-td drivers-td-actions">
                      <div className="drivers-actions">
                        <button
                          type="button"
                          className="drivers-icon-btn drivers-icon-edit"
                          aria-label="Sửa"
                          onClick={() => {}}
                        >
                          <FaPen />
                        </button>

                        <button
                          type="button"
                          className="drivers-icon-btn drivers-icon-del"
                          aria-label="Xóa"
                          onClick={() => {}}
                        >
                          <FaTrash />
                        </button>
 
                        <button
                          type="button"
                          className="drivers-icon-btn drivers-icon-view"
                          aria-label="Xem"
                          onClick={() => setDriversViewDriver(d)}
                        >
                          <FaEye />
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

      {driversShowAddModal && (
        <DriverAddModal
          onClose={() => setDriversShowAddModal(false)}
          onSubmit={(data) => {
            console.log("👤 Tài xế mới:", data);
            setDriversShowAddModal(false);
          }}
        />
      )}
      {driversViewDriver && (
        <DriverViewModal
          driver={driversViewDriver}
          onClose={() => setDriversViewDriver(null)}
        />
      )}
    </div>
  );
}







