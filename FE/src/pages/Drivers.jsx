import React, { useState } from "react";
import {
    FaPlus,
    FaSearch,
    FaPen,
    FaTrash,
    FaStar,
    FaExclamationTriangle,
} from "react-icons/fa";
import DriverAddModal from "../components/DriverAddModal";

import "./Drivers.css";

export default function Drivers() {
    const [search, setSearch] = useState("");
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);

    // ================= MOCK DATA ==================
    const drivers = [
        {
            name: "Nguyễn Văn A",
            phone: "0901234567",
            license: "B2-123456",
            expiry: "15/05/2026",
            car: "29A-12345",
            trips: 145,
            rating: 4.8,
            status: "working",
        },
        {
            name: "Trần Văn B",
            phone: "0902345678",
            license: "C-234567",
            expiry: "20/08/2025",
            car: "30B-98765",
            trips: 189,
            rating: 4.9,
            status: "working",
        },
        {
            name: "Lê Thị C",
            phone: "0903456789",
            license: "B2-345678",
            expiry: "10/12/2027",
            car: "Chưa gán",
            trips: 132,
            rating: 4.7,
            status: "working",
        },
        {
            name: "Phạm Văn D",
            phone: "0904567890",
            license: "C-456789",
            expiry: "05/03/2026", // sắp hết hạn
            car: "Chưa gán",
            trips: 98,
            rating: 4.6,
            status: "leave",
        },
    ];

    const totalDrivers = drivers.length;
    const workingDrivers = drivers.filter((d) => d.status === "working").length;
    const assignedDrivers = drivers.filter((d) => d.car !== "Chưa gán").length;

    const expiringSoon = drivers.filter((d) => {
        const [day, month, year] = d.expiry.split("/").map(Number);
        const expiryDate = new Date(year, month - 1, day);
        const limit = new Date();
        limit.setMonth(limit.getMonth() + 3);

        return expiryDate < limit;
    }).length;

    // Filter search
    const filtered = drivers.filter((d) => {
        return (
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.phone.includes(search) ||
            d.license.includes(search)
        );
    });

    // ===============================================
    return (
        <div className="drivers-container">

            <h1 className="drivers-title">Quản lý tài xế</h1>
            <p className="drivers-subtitle">Quản lý thông tin và hồ sơ tài xế</p>

            {/* ================= TOP STAT CARDS ================= */}
            <div className="drivers-stat-grid">

                <div className="drivers-stat-card">
                    <span className="drivers-stat-label">Tổng số tài xế</span>
                    <span className="drivers-stat-value">{totalDrivers}</span>
                </div>

                <div className="drivers-stat-card">
                    <span className="drivers-stat-label">Đang làm việc</span>
                    <span className="drivers-stat-value drivers-green">{workingDrivers}</span>
                </div>

                <div className="drivers-stat-card">
                    <span className="drivers-stat-label">Đang có xe</span>
                    <span className="drivers-stat-value drivers-blue">{assignedDrivers}</span>
                </div>

                <div className="drivers-stat-card">
                    <span className="drivers-stat-label">GPLX sắp hết hạn</span>
                    <span className="drivers-stat-value drivers-red">{expiringSoon}</span>
                </div>

            </div>

            {/* ================= SEARCH BAR + ADD BUTTON ================= */}
            <div className="drivers-controls">

                <div className="drivers-search-box">
                    <FaSearch className="drivers-search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, SĐT hoặc GPLX..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button className="drivers-add-btn" onClick={() => setShowAddDriverModal(true)}>
                    <FaPlus /> Thêm tài xế
                </button>


            </div>

            {/* ================= TABLE ================= */}
            <table className="drivers-table">
                <thead>
                    <tr>
                        <th>Tài xế</th>
                        <th>Số điện thoại</th>
                        <th>GPLX</th>
                        <th>Hạn GPLX</th>
                        <th>Xe được gán</th>
                        <th>Số chuyến</th>
                        <th>Đánh giá</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((d, i) => (
                        <tr key={i}>

                            {/* DRIVER NAME + AVATAR */}
                            <td className="drivers-avatar-cell">
                                <div className="drivers-avatar">👤</div>
                                <span>{d.name}</span>
                            </td>

                            <td>{d.phone}</td>
                            <td>{d.license}</td>

                            {/* EXPIRY DATE + ALERT */}
                            <td>
                                <span
                                    className={
                                        new Date(...d.expiry.split("/").reverse()) <
                                            new Date(new Date().setMonth(new Date().getMonth() + 3))
                                            ? "drivers-expiry-alert"
                                            : ""
                                    }
                                >
                                    {d.expiry}
                                </span>
                            </td>

                            <td>{d.car}</td>
                            <td>{d.trips}</td>

                            {/* RATING WITH STAR */}
                            <td className="drivers-rating">
                                <FaStar className="drivers-star" /> {d.rating}
                            </td>

                            {/* STATUS BADGE */}
                            <td>
                                <span
                                    className={
                                        "drivers-status " +
                                        (d.status === "working"
                                            ? "drivers-status-working"
                                            : "drivers-status-leave")
                                    }
                                >
                                    {d.status === "working" && "✔ Đang làm việc"}
                                    {d.status === "leave" && "Nghỉ phép"}
                                </span>
                            </td>

                            {/* ACTION ICONS */}
                            <td className="drivers-actions">
                                <FaPen className="drivers-edit" />
                                <FaTrash className="drivers-delete" />
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddDriverModal && (
                <DriverAddModal
                    onClose={() => setShowAddDriverModal(false)}
                    onSubmit={(data) => {
                        console.log("👤 Tài xế mới:", data);
                        setShowAddDriverModal(false);
                    }}
                />
            )}

        </div>
    );
}
