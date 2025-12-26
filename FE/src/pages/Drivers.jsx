import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrash,
  FaEye,
  FaFilter,
  FaStar,
  FaUsers,
} from "react-icons/fa";

import DriverAddModal from "../components/DriverAddModal";
import DriverViewModal from "../components/DriverViewModal";
import "./Drivers.css";

// ========================= MOCK CONFIG + DATA =========================

const driversMockConfig = {
  page: {
    title: "Quản lý tài xế",
    subtitlePrefix: "Tổng số:",
    addBtn: "Thêm tài xế",
    filtersTitle: "Bộ lọc",
    searchPlaceholder: "Tìm kiếm tên, SĐT, GPLX...",
  },
  shifts: {
    all: "Tất cả ca làm việc",
    morning: "Sáng",
    afternoon: "Chiều",
    night: "Tối",
    long: "Ca dài",
  },
  statuses: {
    all: "Tất cả trạng thái",
    driving: { label: "Đang lái" },
    ready: { label: "Sẵn sàng" },
    duty: { label: "Đang công tác" },
    leave: { label: "Nghỉ phép" },
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

const driversMockData = [
  {
    id: "d1",
    name: "Phạm Văn Đức",
    phone: "0911111111",
    email: "phamduc@fms.vn",
    licenses: ["C", "D"],
    shift: "morning",
    expYears: 8,
    rating: 4.5,
    status: "driving",
    statusSub: null,
  },
  {
    id: "d2",
    name: "Nguyễn Thị Hoa",
    phone: "0922222222",
    email: "nguyenhoa@fms.vn",
    licenses: ["B2", "C"],
    shift: "afternoon",
    expYears: 5,
    rating: 4.8,
    status: "ready",
    statusSub: null,
  },
  {
    id: "d3",
    name: "Trần Văn Kiên",
    phone: "0933333333",
    email: "trankien@fms.vn",
    licenses: ["E", "FE"],
    shift: "long",
    expYears: 12,
    rating: 4.9,
    status: "duty",
    statusSub: "Về: 20/12/2024",
  },
  {
    id: "d4",
    name: "Lê Thị Mai",
    phone: "0944444444",
    email: "lemai@fms.vn",
    licenses: ["B2", "C"],
    shift: "night",
    expYears: 6,
    rating: 4.6,
    status: "ready",
    statusSub: null,
  },
  {
    id: "d5",
    name: "Hoàng Văn Nam",
    phone: "0955555555",
    email: "hoangnam@fms.vn",
    licenses: ["D", "FD"],
    shift: "morning",
    expYears: 10,
    rating: 4.7,
    status: "leave",
    statusSub: null,
  },
];

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
  if (shift === "morning") return "drivers-pill-shift-morning";
  if (shift === "afternoon") return "drivers-pill-shift-afternoon";
  if (shift === "night") return "drivers-pill-shift-night";
  return "drivers-pill-shift-long";
}

function driversGetStatusPillClass(status) {
  if (status === "driving") return "drivers-pill-status-driving";
  if (status === "ready") return "drivers-pill-status-ready";
  if (status === "duty") return "drivers-pill-status-duty";
  return "drivers-pill-status-leave";
}

// ====================================================================

export default function Drivers() {
  const [driversSearch, setDriversSearch] = useState("");
  const [driversFilterShift, setDriversFilterShift] = useState("all");
  const [driversFilterStatus, setDriversFilterStatus] = useState("all");
  const [driversFilterLicense, setDriversFilterLicense] = useState("all");
  const [driversShowAddModal, setDriversShowAddModal] = useState(false);
  const [driversViewDriver, setDriversViewDriver] = useState(null);

  const driversFiltered = useMemo(() => {
    const q = driversSearch.trim().toLowerCase();

    return driversMockData.filter((d) => {
      const driversMatchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.licenses.some((x) => String(x).toLowerCase().includes(q));

      const driversMatchesShift =
        driversFilterShift === "all" ? true : d.shift === driversFilterShift;

      const driversMatchesStatus =
        driversFilterStatus === "all" ? true : d.status === driversFilterStatus;

      const driversMatchesLicense =
        driversFilterLicense === "all"
          ? true
          : d.licenses.includes(driversFilterLicense);

      return (
        driversMatchesSearch &&
        driversMatchesShift &&
        driversMatchesStatus &&
        driversMatchesLicense
      );
    });
  }, [driversSearch, driversFilterShift, driversFilterStatus, driversFilterLicense]);

  const driversTotal = driversMockData.length;

  return (
    <div className="drivers-page">
      {/* ================= HEADER CARD ================= */}
      <div className="drivers-card drivers-header">
        <div className="drivers-header-left">
          <div className="drivers-header-icon">
            <FaUsers />
          </div>

          <div>
            <div className="drivers-header-title">{driversMockConfig.page.title}</div>
            <div className="drivers-header-sub">
              {driversMockConfig.page.subtitlePrefix} {driversTotal} tài xế
            </div>
          </div>
        </div>

        <button
          type="button"
          className="drivers-primary-btn"
          onClick={() => setDriversShowAddModal(true)}
        >
          <FaPlus />
          {driversMockConfig.page.addBtn}
        </button>
      </div>

      {/* ================= FILTERS CARD ================= */}
      <div className="drivers-card drivers-filters">
        <div className="drivers-filters-title">
          <FaFilter />
          {driversMockConfig.page.filtersTitle}
        </div>

        <div className="drivers-filters-row">
          {/* Search */}
          <div className="drivers-input-wrap">
            <FaSearch className="drivers-input-icon" />
            <input
              className="drivers-input"
              value={driversSearch}
              onChange={(e) => setDriversSearch(e.target.value)}
              placeholder={driversMockConfig.page.searchPlaceholder}
            />
          </div>

          {/* Shift */}
          <select
            className="drivers-select"
            value={driversFilterShift}
            onChange={(e) => setDriversFilterShift(e.target.value)}
          >
            {Object.entries(driversMockConfig.shifts).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            className="drivers-select"
            value={driversFilterStatus}
            onChange={(e) => setDriversFilterStatus(e.target.value)}
          >
            <option value="all">{driversMockConfig.statuses.all}</option>
            {Object.entries(driversMockConfig.statuses)
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
            {Object.entries(driversMockConfig.licenseTypes).map(([key, label]) => (
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
                <th className="drivers-th">CA LÀM VIỆC</th>
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

                    {/* Shift */}
                    <td className="drivers-td">
                      <span
                        className={
                          "drivers-pill " + driversGetShiftPillClass(d.shift)
                        }
                      >
                        {driversMockConfig.shifts[d.shift]}
                      </span>
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
                          {driversMockConfig.statuses[d.status].label}
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
