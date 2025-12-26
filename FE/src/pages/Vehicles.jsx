import React, { useMemo, useState } from "react";
import { FaTruck, FaPlus, FaSearch, FaFilter, FaPen, FaTrash, FaEye } from "react-icons/fa";
import "./Vehicles.css";
import VehicleViewModal from "../components/VehicleViewModal";

// ====================== MOCK DATA =============================

const vehiclesMock = [
  {
    id: 1,
    plate: "29A-12345",
    typeKey: "small_truck",
    brand: "Hyundai",
    model: "Porter H150",
    payload: "1.5 tấn",
    km: "45,000 km",
    statusKey: "ready",
  },
  {
    id: 2,
    plate: "30B-67890",
    typeKey: "big_truck",
    brand: "Hino",
    model: "FC9JLSW",
    payload: "6 tấn",
    km: "78,000 km",
    statusKey: "in_use",
  },
  {
    id: 3,
    plate: "51C-11111",
    typeKey: "container",
    brand: "Dongfeng",
    model: "Hoàng Huy",
    payload: "40 feet",
    km: "120,000 km",
    statusKey: "on_trip",
  },
  {
    id: 4,
    plate: "29D-22222",
    typeKey: "bus",
    brand: "Thaco",
    model: "Universe",
    payload: "45 chỗ",
    km: "25,000 km",
    statusKey: "ready",
  },
  {
    id: 5,
    plate: "59E-33333",
    typeKey: "pickup",
    brand: "Ford",
    model: "Ranger XLS",
    payload: "1 tấn",
    km: "35,000 km",
    statusKey: "maintenance",
  },
];

const vehiclesUiMock = {
  header: {
    title: "Quản lý phương tiện",
    totalPrefix: "Tổng số:",
    totalSuffix: "xe",
    addButton: "Thêm xe mới",
  },
  filterCard: {
    title: "Bộ lọc",
    searchPlaceholder: "Tìm kiếm theo biển số, hãng, model...",
    typeAllLabel: "Tất cả loại xe",
    statusAllLabel: "Tất cả trạng thái",
  },
  table: {
    columns: {
      stt: "STT",
      plate: "BIỂN SỐ",
      type: "LOẠI XE",
      brandModel: "HÃNG/MODEL",
      payload: "TẢI TRỌNG",
      km: "KM ĐÃ ĐI",
      status: "TRẠNG THÁI",
      actions: "THAO TÁC",
    },
  },
  vehicleTypes: [
    { key: "all", label: "Tất cả loại xe" },
    { key: "small_truck", label: "Xe tải nhỏ" },
    { key: "big_truck", label: "Xe tải lớn" },
    { key: "container", label: "Xe container" },
    { key: "bus", label: "Xe khách" },
    { key: "pickup", label: "Xe bán tải" },
  ],
  statuses: [
    { key: "all", label: "Tất cả trạng thái" },
    { key: "ready", label: "Sẵn sàng" },
    { key: "in_use", label: "Đang sử dụng" },
    { key: "on_trip", label: "Đang công tác" },
    { key: "maintenance", label: "Bảo trì" },
  ],
};

// =============================================================

function vehiclesGetStatusBadgeClass(statusKey) {
  switch (statusKey) {
    case "ready":
      return "vehicles-badge vehicles-badge--ready";
    case "in_use":
      return "vehicles-badge vehicles-badge--inuse";
    case "on_trip":
      return "vehicles-badge vehicles-badge--trip";
    case "maintenance":
      return "vehicles-badge vehicles-badge--maint";
    default:
      return "vehicles-badge";
  }
}

export default function Vehicles() {
  const [vehicles] = useState(vehiclesMock);

  const [search, setSearch] = useState("");
  const [typeKey, setTypeKey] = useState("all");
  const [statusKey, setStatusKey] = useState("all");
  const [viewVehicle, setViewVehicle] = useState(null);

  const totalCount = vehicles.length;

  const typeLabelMap = useMemo(() => {
    const map = new Map();
    vehiclesUiMock.vehicleTypes.forEach((t) => map.set(t.key, t.label));
    return map;
  }, []);

  const statusLabelMap = useMemo(() => {
    const map = new Map();
    vehiclesUiMock.statuses.forEach((s) => map.set(s.key, s.label));
    return map;
  }, []);

  const filteredVehicles = useMemo(() => {
    const q = search.trim().toLowerCase();

    return vehicles.filter((v) => {
      const matchesSearch =
        q.length === 0
          ? true
          : [
              v.plate,
              v.brand,
              v.model,
              typeLabelMap.get(v.typeKey) || "",
              statusLabelMap.get(v.statusKey) || "",
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);

      const matchesType = typeKey === "all" ? true : v.typeKey === typeKey;
      const matchesStatus = statusKey === "all" ? true : v.statusKey === statusKey;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, search, typeKey, statusKey, typeLabelMap, statusLabelMap]);

  const handleAdd = () => {
    // TODO: sau này thay bằng mở modal / route create
    console.log("Add vehicle clicked");
  };

  const handleEdit = (vehicle) => {
    console.log("Edit", vehicle);
  };

  const handleDelete = (vehicle) => {
    console.log("Delete", vehicle);
  };

  return (
    <div className="vehicles-page">
      {/* ===================== HEADER CARD ===================== */}
      <div className="vehicles-card vehicles-headerCard">
        <div className="vehicles-headerLeft">
          <div className="vehicles-headerIcon">
            <FaTruck />
          </div>

          <div className="vehicles-headerText">
            <div className="vehicles-headerTitle">{vehiclesUiMock.header.title}</div>
            <div className="vehicles-headerSub">
              {vehiclesUiMock.header.totalPrefix} {totalCount} {vehiclesUiMock.header.totalSuffix}
            </div>
          </div>
        </div>

        <button className="vehicles-primaryBtn" onClick={handleAdd} type="button">
          <FaPlus className="vehicles-btnIcon" />
          {vehiclesUiMock.header.addButton}
        </button>
      </div>

      {/* ===================== FILTER CARD ===================== */}
      <div className="vehicles-card vehicles-filterCard">
        <div className="vehicles-filterTitleRow">
          <FaFilter className="vehicles-filterTitleIcon" />
          <div className="vehicles-filterTitle">{vehiclesUiMock.filterCard.title}</div>
        </div>

        <div className="vehicles-filterRow">
          {/* Search */}
          <div className="vehicles-inputWrap vehicles-inputWrap--search">
            <FaSearch className="vehicles-inputIcon" />
            <input
              className="vehicles-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={vehiclesUiMock.filterCard.searchPlaceholder}
              type="text"
            />
          </div>

          {/* Type select */}
          <div className="vehicles-inputWrap">
            <select
              className="vehicles-select"
              value={typeKey}
              onChange={(e) => setTypeKey(e.target.value)}
            >
              {vehiclesUiMock.vehicleTypes.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status select */}
          <div className="vehicles-inputWrap">
            <select
              className="vehicles-select"
              value={statusKey}
              onChange={(e) => setStatusKey(e.target.value)}
            >
              {vehiclesUiMock.statuses.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ===================== TABLE CARD ===================== */}
      <div className="vehicles-card vehicles-tableCard">
        <div className="vehicles-tableWrap">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th className="vehicles-th vehicles-th--stt">{vehiclesUiMock.table.columns.stt}</th>
                <th className="vehicles-th">{vehiclesUiMock.table.columns.plate}</th>
                <th className="vehicles-th">{vehiclesUiMock.table.columns.type}</th>
                <th className="vehicles-th">{vehiclesUiMock.table.columns.brandModel}</th>
                <th className="vehicles-th">{vehiclesUiMock.table.columns.payload}</th>
                <th className="vehicles-th">{vehiclesUiMock.table.columns.km}</th>
                <th className="vehicles-th">{vehiclesUiMock.table.columns.status}</th>
                <th className="vehicles-th vehicles-th--actions">{vehiclesUiMock.table.columns.actions}</th>
              </tr>
            </thead>

            <tbody>
              {filteredVehicles.map((v, idx) => (
                <tr className="vehicles-tr" key={v.id}>
                  <td className="vehicles-td vehicles-td--stt">{idx + 1}</td>
                  <td className="vehicles-td vehicles-td--plate">{v.plate}</td>

                  <td className="vehicles-td">{typeLabelMap.get(v.typeKey) || v.typeKey}</td>

                  <td className="vehicles-td">
                    <div className="vehicles-brand">{v.brand}</div>
                    <div className="vehicles-model">{v.model}</div>
                  </td>

                  <td className="vehicles-td">{v.payload}</td>
                  <td className="vehicles-td">{v.km}</td>

                  <td className="vehicles-td">
                    <span className={vehiclesGetStatusBadgeClass(v.statusKey)}>
                      {statusLabelMap.get(v.statusKey) || v.statusKey}
                    </span>
                  </td>

                  <td className="vehicles-td vehicles-td--actions">
                    <button
                      className="vehicles-iconBtn vehicles-iconBtn--edit"
                      type="button"
                      onClick={() => handleEdit(v)}
                      aria-label="edit"
                      title="Sửa"
                    >
                      <FaPen />
                    </button>
                    <button
                      className="vehicles-iconBtn vehicles-iconBtn--delete"
                      type="button"
                      onClick={() => handleDelete(v)}
                      aria-label="delete"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="vehicles-iconBtn vehicles-iconBtn--view"
                      type="button"
                      onClick={() => setViewVehicle(v)}
                      aria-label="view"
                      title="Xem"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredVehicles.length === 0 && (
                <tr>
                  <td className="vehicles-empty" colSpan={8}>
                    Không có dữ liệu phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
