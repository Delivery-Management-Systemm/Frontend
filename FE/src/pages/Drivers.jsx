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
  FaHistory,
} from "react-icons/fa";

import DriverAddModal from "../components/DriverAddModal";
import DriverViewModal from "../components/DriverViewModal";
import DriverHistory from "./DriverHistory";
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
    // removed shift options (work shift UI deleted)
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
    vehicle: { plate: "30B-67890", desc: "Xe tải lớn" },
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
    vehicle: null,
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
    vehicle: { plate: "51C-11111", desc: "Xe container" },
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
    vehicle: null,
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
    vehicle: null,
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
  const [driversSearch, setDriversSearch] = useState("");
  const [driversFilterStatus, setDriversFilterStatus] = useState("all");
  const [driversFilterLicense, setDriversFilterLicense] = useState("all");
  const [driversShowAddModal, setDriversShowAddModal] = useState(false);
  const [driversViewDriver, setDriversViewDriver] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list | detail | history
  const [historyDriver, setHistoryDriver] = useState(null);

  const driversFiltered = useMemo(() => {
    const q = driversSearch.trim().toLowerCase();

    return driversMockData.filter((d) => {
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
  }, [driversSearch, driversFilterStatus, driversFilterLicense]);

  const driversTotal = driversMockData.length;

  // Mock driver history data keyed by driver id (simplified)
  const mockDriverHistory = {
    d1: [
      { date: "15/12/2024", vehicle: "30B-67890", route: "Hà Nội - Hải Phòng", distance: "120 km", duration: "9h 0m", rating: 4.5 },
      { date: "10/12/2024", vehicle: "30B-67890", route: "Hà Nội - Thanh Hóa", distance: "320 km", duration: "12h 0m", rating: 4.8 },
    ],
    d2: [
      { date: "01/12/2024", vehicle: "29A-12345", route: "Hà Nội - Bắc Ninh", distance: "45 km", duration: "1h 15m", rating: 4.6 },
    ],
  };

  const openDriverHistory = (driver) => {
    setHistoryDriver(driver);
    setViewMode("history");
  };

  const closeHistory = () => {
    setHistoryDriver(null);
    setViewMode("list");
  };

  return (
    <div className="drivers-page">
      {viewMode === "history" && historyDriver ? (
        <div className="drivers-history-page">
          <div className="drivers-history-header">
            <div className="drivers-history-left">
              <div className="drivers-avatar drivers-history-avatar">
                {driversGetInitials(historyDriver.name)}
              </div>
              <div>
                <div className="drivers-history-name">{historyDriver.name}</div>
                <div className="drivers-history-contact">
                  <div>{historyDriver.phone}</div>
                  <div className="drivers-history-email">{historyDriver.email}</div>
                </div>
                <div className="drivers-history-licenses">
                  {historyDriver.licenses.map((l) => (
                    <span key={l} className="drivers-chip drivers-chip--small">{l}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="drivers-history-actions">
              <div className="drivers-history-rating">
                <FaStar className="drivers-star" /> {historyDriver.rating}
              </div>
              <button className="drivers-primary-btn drivers-history-back" onClick={closeHistory}>
                Quay lại
              </button>
            </div>
          </div>

          <div className="drivers-history-overview">
            {/* compute overview from mock data */}
            {(() => {
              const rows = mockDriverHistory[historyDriver.id] || [];
              const totalTrips = rows.length;
              const totalKm = rows.reduce((acc, r) => {
                const n = Number((r.distance || "0").toString().replace(/[^\d]/g, ""));
                return acc + (isNaN(n) ? 0 : n);
              }, 0);
              const totalHours = rows.reduce((acc, r) => {
                const m = (r.duration || "").match(/(\d+)h\s*(\d+)?m?/);
                if (!m) return acc;
                const h = Number(m[1] || 0);
                const min = Number(m[2] || 0);
                return acc + h + min / 60;
              }, 0);
              const avgRating = rows.length ? (rows.reduce((s, r) => s + (r.rating || 0), 0) / rows.length).toFixed(1) : "-";

              return (
                <>
                  <div className="drivers-overview-item">
                    <div className="drivers-overview-value">{totalTrips}</div>
                    <div className="drivers-overview-label">Tổng chuyến</div>
                  </div>
                  <div className="drivers-overview-item">
                    <div className="drivers-overview-value">{totalKm.toLocaleString()} km</div>
                    <div className="drivers-overview-label">Tổng km</div>
                  </div>
                  <div className="drivers-overview-item">
                    <div className="drivers-overview-value">{Math.round(totalHours)} giờ</div>
                    <div className="drivers-overview-label">Tổng giờ lái</div>
                  </div>
                  <div className="drivers-overview-item">
                    <div className="drivers-overview-value">{avgRating}</div>
                    <div className="drivers-overview-label">Đánh giá TB</div>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="drivers-history-table-wrap">
            <table className="drivers-history-table">
              <thead>
                <tr>
                  <th>NGÀY</th>
                  <th>XE</th>
                  <th>LỘ TRÌNH</th>
                  <th>KHOẢNG CÁCH</th>
                  <th>THỜI GIAN</th>
                  <th>ĐÁNH GIÁ</th>
                </tr>
              </thead>
              <tbody>
                {(mockDriverHistory[historyDriver.id] || []).map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.vehicle}</td>
                    <td>{r.route}</td>
                    <td className="drivers-right">{r.distance}</td>
                    <td className="drivers-right">{r.duration}</td>
                    <td className="drivers-right">
                      <FaStar className="drivers-star" /> {r.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

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

          {/* Shift filter removed */}

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

                        <button
                          type="button"
                          className="drivers-icon-btn drivers-icon-history"
                          aria-label="Lịch sử"
                          onClick={() => openDriverHistory(d)}
                        >
                          <FaHistory />
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
