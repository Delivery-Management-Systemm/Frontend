import React, { useState } from "react";
import { FaCalendarAlt, FaSearch, FaPlus, FaEye, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./Bookings.css";
import AddBookingModal from "../components/AddBookingModal";

const mockBookings = [
  {
    id: "c1",
    customer: "Công ty TNHH ABC",
    contact: "0241234567",
    email: "abc@company.com",
    route: "Khu CN Thăng Long, Hà Nội → Khu CN VSIP, Hải Phòng",
    date: "20/12/2024",
    time: "08:00",
    vehicleType: "Xe tải lớn",
    vehicleNote: "Máy móc công nghiệp - 5 tấn",
    assigned: null,
    status: "pending",
  },
  {
    id: "c2",
    customer: "Nguyễn Văn Tuấn",
    contact: "0987654321",
    email: "tuan@email.com",
    route: "Sân bay Nội Bài → Khách sạn Hilton, Hà Nội",
    date: "16/12/2024",
    time: "14:30",
    vehicleType: "Xe khách",
    vehicleNote: "35 người",
    assigned: "29D-22222",
    assignedDriver: "Lê Thị Mai",
    status: "confirmed",
  },
  {
    id: "c3",
    customer: "Công ty XYZ",
    contact: "0909876543",
    email: "xyz@company.com",
    route: "Cảng Cát Lái, TP.HCM → Kho hàng, Bình Dương",
    date: "18/12/2024",
    time: "06:00",
    vehicleType: "Xe container",
    vehicleNote: "Container 40 feet - Hàng điện tử",
    assigned: "51C-11111",
    assignedDriver: "Trần Văn Kiên",
    status: "assigned",
  },
];

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState(mockBookings);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = bookings.filter((b) =>
    [b.customer, b.contact, b.email, b.route, b.vehicleType]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = {
    pending: mockBookings.filter((b) => b.status === "pending").length,
    confirmed: mockBookings.filter((b) => b.status === "confirmed").length,
    assigned: mockBookings.filter((b) => b.status === "assigned").length,
    done: mockBookings.filter((b) => b.status === "done").length,
  };

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div className="bookings-header-left">
          <div className="bookings-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <div className="bookings-title">Lịch đặt trước</div>
            <div className="bookings-sub">Quản lý các chuyến đã được đặt lịch</div>
          </div>
        </div>

        <button className="bookings-add" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Đặt lịch mới
        </button>
      </div>

      <div className="bookings-stats">
        <div className="stat-card">
          <div className="stat-label">Chờ xác nhận</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đã xác nhận</div>
          <div className="stat-value">{stats.confirmed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đã phân công</div>
          <div className="stat-value">{stats.assigned}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hoàn thành</div>
          <div className="stat-value">{stats.done}</div>
        </div>
      </div>

      <div className="bookings-card">
        <div className="bookings-table-header">
          <div className="search-box">
            <FaSearch />
            <input
              placeholder="Tìm kiếm khách hàng, SĐT, tuyến..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>KHÁCH HÀNG</th>
                <th>LIÊN HỆ</th>
                <th>LỘ TRÌNH</th>
                <th>THỜI GIAN</th>
                <th>LOẠI XE</th>
                <th>PHÂN CÔNG</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="td-customer">
                    <div className="cust-name">{b.customer}</div>
                    <div className="cust-id">ID: {b.id}</div>
                  </td>
                  <td className="td-contact">
                    <div>{b.contact}</div>
                    <div className="cust-email">{b.email}</div>
                  </td>
                  <td className="td-route">
                    <div className="route-text">{b.route}</div>
                  </td>
                  <td className="td-time">
                    <div>{b.date}</div>
                    <div>{b.time}</div>
                  </td>
                  <td className="td-type">
                    <div className="type-title">{b.vehicleType}</div>
                    <div className="type-note">{b.vehicleNote}</div>
                  </td>
                  <td className="td-assign">
                    {b.assigned ? (
                      <>
                        <div className="assign-plate">{b.assigned}</div>
                        <div className="assign-driver">{b.assignedDriver}</div>
                      </>
                    ) : (
                      <div className="assign-none">Chưa phân công</div>
                    )}
                  </td>
                  <td className="td-status">
                    <span className={`badge badge-${b.status}`}>{b.status === "pending" ? "Chờ xác nhận" : b.status === "confirmed" ? "Đã xác nhận" : b.status === "assigned" ? "Đã phân công" : "Hoàn thành"}</span>
                  </td>
                  <td className="td-actions">
                    <button className="btn-icon btn-icon--view" title="Xem">
                      <FaEye />
                    </button>
                    {b.status === "pending" && (
                      <>
                        <button className="btn-icon btn-icon--confirm" title="Xác nhận">
                          <FaCheckCircle />
                        </button>
                        <button className="btn-icon btn-icon--reject" title="Từ chối">
                          <FaTimesCircle />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddModal && (
        <AddBookingModal
          onClose={() => setShowAddModal(false)}
          onSave={(booking) => {
            setBookings((prev) => [booking, ...prev]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}


