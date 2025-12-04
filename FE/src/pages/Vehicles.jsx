import React, { useState } from "react";
import {
    FaPlus,
    FaSearch,
    FaFilter,
    FaPen,
    FaTrash,
} from "react-icons/fa";

import "./Vehicles.css";
import VehicleAddModal from "../components/VehicleAddModal";


export default function Vehicles() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);

    // ========================= MOCK DATA ============================
    const vehicles = [
        {
            plate: "29A-12345",
            type: "Xe tải",
            model: "Hino 500",
            year: 2020,
            km: "45,000 km",
            status: "active",
            nextMaintenance: "15/01/2025",
        },
        {
            plate: "30B-98765",
            type: "Xe tải",
            model: "Isuzu QKR",
            year: 2021,
            km: "32,000 km",
            status: "active",
            nextMaintenance: "20/01/2025",
        },
        {
            plate: "29A-54321",
            type: "Xe con",
            model: "Toyota Hilux",
            year: 2019,
            km: "68,000 km",
            status: "maintenance",
            nextMaintenance: "05/12/2024",
        },
        {
            plate: "51F-11111",
            type: "Xe tải",
            model: "Hyundai Mighty",
            year: 2018,
            km: "89,000 km",
            status: "active",
            nextMaintenance: "10/01/2025",
        },
        {
            plate: "29C-22222",
            type: "Xe con",
            model: "Ford Ranger",
            year: 2022,
            km: "15,000 km",
            status: "inactive",
            nextMaintenance: "01/12/2024",
        },
    ];

    const filtered = vehicles.filter((v) => {
        const matchesSearch =
            v.plate.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all" ? true : v.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const total = vehicles.length;
    const active = vehicles.filter((v) => v.status === "active").length;
    const maintenance = vehicles.filter((v) => v.status === "maintenance").length;
    const inactive = vehicles.filter((v) => v.status === "inactive").length;

    // ========================= RENDER ===============================
    return (
        <div className="vehicles-container">

            <h1 className="vehicles-title">Quản lý phương tiện</h1>
            <p className="vehicles-subtitle">
                Quản lý thông tin và trạng thái các phương tiện
            </p>

            {/* ================== TOP STAT CARDS ===================== */}
            <div className="vehicles-stat-grid">

                <div className="vehicles-stat-card">
                    <span className="vehicles-stat-label">Tổng số xe</span>
                    <span className="vehicles-stat-value">{total}</span>
                </div>

                <div className="vehicles-stat-card">
                    <span className="vehicles-stat-label">Đang hoạt động</span>
                    <span className="vehicles-stat-value vehicles-green">{active}</span>
                </div>

                <div className="vehicles-stat-card">
                    <span className="vehicles-stat-label">Đang bảo trì</span>
                    <span className="vehicles-stat-value vehicles-orange">{maintenance}</span>
                </div>

                <div className="vehicles-stat-card">
                    <span className="vehicles-stat-label">Ngừng hoạt động</span>
                    <span className="vehicles-stat-value vehicles-red">{inactive}</span>
                </div>

            </div>

            {/* ================== SEARCH & FILTER ===================== */}
            <div className="vehicles-controls">

                {/* Search box */}
                <div className="vehicles-search-box">
                    <FaSearch className="vehicles-search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo biển số hoặc model..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filter dropdown */}
                <div className="vehicles-filter-box" onClick={() => setOpenFilter(!openFilter)}>
                    <FaFilter className="vehicles-filter-icon" />
                    <span>
                        {
                            filterStatus === "all" ? "Tất cả trạng thái" :
                                filterStatus === "active" ? "Đang hoạt động" :
                                    filterStatus === "maintenance" ? "Đang bảo trì" :
                                        "Ngừng hoạt động"
                        }
                    </span>

                    <div className="vehicles-filter-arrow" />

                    {openFilter && (
                        <div className="vehicles-filter-menu">
                            <div onClick={() => setFilterStatus("all")}>Tất cả trạng thái</div>
                            <div onClick={() => setFilterStatus("active")}>Đang hoạt động</div>
                            <div onClick={() => setFilterStatus("maintenance")}>Đang bảo trì</div>
                            <div onClick={() => setFilterStatus("inactive")}>Ngừng hoạt động</div>
                        </div>
                    )}
                </div>

                {/* Add vehicle button */}
                <button className="vehicles-add-btn" onClick={() => setShowAddVehicleModal(true)}>
                    <FaPlus /> Thêm xe mới
                </button>


            </div>

            {/* ================== VEHICLE TABLE ===================== */}
            <table className="vehicles-table">
                <thead>
                    <tr>
                        <th>Biển số</th>
                        <th>Loại xe</th>
                        <th>Model</th>
                        <th>Năm SX</th>
                        <th>Km đã chạy</th>
                        <th>Trạng thái</th>
                        <th>Bảo trì tiếp theo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((v, i) => (
                        <tr key={i}>
                            <td>{v.plate}</td>
                            <td>{v.type}</td>
                            <td>{v.model}</td>
                            <td>{v.year}</td>
                            <td>{v.km}</td>

                            <td>
                                <span
                                    className={
                                        "vehicles-status " +
                                        (v.status === "active"
                                            ? "vehicles-status-active"
                                            : v.status === "maintenance"
                                                ? "vehicles-status-maintenance"
                                                : "vehicles-status-inactive")
                                    }
                                >
                                    {v.status === "active" && "✔ Đang hoạt động"}
                                    {v.status === "maintenance" && "⚠ Đang bảo trì"}
                                    {v.status === "inactive" && "✖ Ngừng hoạt động"}
                                </span>
                            </td>

                            <td>{v.nextMaintenance}</td>

                            <td className="vehicles-actions">
                                <FaPen className="vehicles-edit" />
                                <FaTrash className="vehicles-delete" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddVehicleModal && (
                <VehicleAddModal
                    onClose={() => setShowAddVehicleModal(false)}
                    onSubmit={(data) => {
                        console.log("🚗 Xe mới:", data);
                        setShowAddVehicleModal(false);
                    }}
                />
            )}

        </div>
    );
}
