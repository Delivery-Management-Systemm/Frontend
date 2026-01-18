import React, { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaClock, FaUser, FaCar } from "react-icons/fa";
import "./BookingDetailModal.css";
import { API_CONFIG } from "../config/api";
import { toast } from "react-toastify";

export default function BookingDetailModal({ bookingId, onClose }) {
  const provinces = [
    "Hà Nội",
    "Hà Giang",
    "Cao Bằng",
    "Bắc Kạn",
    "Tuyên Quang",
    "Lào Cai",
    "Điện Biên",
    "Lai Châu",
    "Sơn La",
    "Yên Bái",
    "Hòa Bình",
    "Thái Nguyên",
    "Lạng Sơn",
    "Bắc Giang",
    "Phú Thọ",
    "Vĩnh Phúc",
    "Bắc Ninh",
    "Hải Dương",
    "Quảng Ninh",
    "Hải Phòng",
    "Hưng Yên",
    "Thái Bình",
    "Nam Định",
    "Ninh Bình",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Quảng Bình",
    "Quảng Trị",
    "Thừa Thiên Huế",
    "Đà Nẵng",
    "Quảng Nam",
    "Quảng Ngãi",
    "Bình Định",
    "Phú Yên",
    "Khánh Hòa",
    "Ninh Thuận",
    "Bình Thuận",
    "Kon Tum",
    "Gia Lai",
    "Đắk Lắk",
    "Đắk Nông",
    "Lâm Đồng",
    "Bình Phước",
    "Tây Ninh",
    "Bình Dương",
    "Đồng Nai",
    "Bà Rịa - Vũng Tàu",
    "Hồ Chí Minh",
    "Long An",
    "Tiền Giang",
    "Bến Tre",
    "Trà Vinh",
    "Vĩnh Long",
    "Đồng Tháp",
    "An Giang",
    "Kiên Giang",
    "Cần Thơ",
    "Hậu Giang",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cà Mau"
  ];
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // create mode fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [requestedVehicleType, setRequestedVehicleType] = useState("");
  const [requestedPassengers, setRequestedPassengers] = useState("");
  const [requestedCargo, setRequestedCargo] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalDistanceKm, setTotalDistanceKm] = useState("");
  const [totalFuelConsumed, setTotalFuelConsumed] = useState("");
  const [tripStatus, setTripStatus] = useState("planned");
  const [estimatedDurationMin, setEstimatedDurationMin] = useState("");
  const [actualDurationMin, setActualDurationMin] = useState("");
  const [routeGeometryJson, setRouteGeometryJson] = useState("");
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // single-page create form

  useEffect(() => {
    if (bookingId && bookingId !== "new") {
      loadBookingDetails();
    } else {
      // reset create form
      setBooking(null);
      setLoading(false);
      setError(null);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setStartLocation("");
      setEndLocation("");
      setScheduledStartTime("");
      setRequestedVehicleType("");
      setRequestedPassengers("");
      setRequestedCargo("");
      setNotes("");
    }
  }, [bookingId]);

  // no vehicle select on create; VehicleID will be saved as null

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Trip/booked?pageNumber=1&pageSize=9999`,
        {
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải thông tin đặt trước");
      }

      const data = await response.json();
      const bookingsList = data.objects || data.items || data || [];
      const foundBooking = bookingsList.find((b) => b.tripID === bookingId);

      if (!foundBooking) {
        throw new Error("Không tìm thấy thông tin đặt trước");
      }

      setBooking(foundBooking);
      setError(null);
    } catch (err) {
      console.error("Error loading booking details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!customerName || !customerPhone || !startLocation || !endLocation || !scheduledStartTime) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }
    setSubmitting(true);
    try {
      // normalize scheduledStartTime to ISO string
      let scheduledIso = null;
      try {
        const dt = new Date(scheduledStartTime);
        if (!isNaN(dt)) scheduledIso = dt.toISOString();
      } catch {}
      if (!scheduledIso) {
        setError("Ngày & giờ đặt không hợp lệ. Vui lòng nhập định dạng hợp lệ.");
        setSubmitting(false);
        return;
      }

      // sanitize email: only send if valid, otherwise null
      const emailTrim = (customerEmail || "").trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);
      const payload = {
        customerName,
        customerPhone,
        customerEmail: emailValid ? emailTrim : null,
        startLocation,
        endLocation,
        scheduledStartTime: scheduledIso,
        requestedVehicleType: requestedVehicleType || null,
        requestedPassengers: requestedPassengers ? Number(requestedPassengers) : null,
        requestedCargo: requestedCargo || null,
        notes: notes || null,
        // VehicleID intentionally null for new bookings (user requested)
        VehicleID: null,
        startTime: startTime || null,
        endTime: endTime || null,
        totalDistanceKm: totalDistanceKm ? Number(totalDistanceKm) : null,
        totalFuelConsumed: totalFuelConsumed ? Number(totalFuelConsumed) : null,
        tripStatus: "planned", // ensure saved as planned
        estimatedDurationMin: estimatedDurationMin ? Number(estimatedDurationMin) : null,
        actualDurationMin: actualDurationMin ? Number(actualDurationMin) : null,
        routeGeometryJson: routeGeometryJson || null,
        estimatedDistanceKm: estimatedDistanceKm ? Number(estimatedDistanceKm) : null,
      };
      const resp = await fetch(`${API_CONFIG.BASE_URL}/Trip/booked`, {
        method: "POST",
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Không thể tạo lịch");
      }
      const created = await resp.json();
      setError(null);
      toast.success("Tạo lịch thành công!");
      // close modal; parent `onClose` should refresh the bookings list
      onClose();
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(err.message || "Lỗi khi tạo lịch");
    } finally {
      setSubmitting(false);
    }
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
    return timeString;
  };

  return (
    <div className="booking-detail-modal-overlay" onClick={onClose}>
      <div className="booking-detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="booking-detail-modal-header">
          <h2 className="booking-detail-modal-title">
            {bookingId === "new" ? "Đặt lịch mới" : `Chi tiết đặt trước #${bookingId}`}
          </h2>
          <button className="booking-detail-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="booking-detail-modal-body">
          {bookingId === "new" ? (
            <div className="booking-detail-grid">
                  <div className="booking-detail-item">
                    <label>Khách hàng</label>
                    <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Tên khách hàng" />
                  </div>

                  <div className="booking-detail-item">
                    <label>Số điện thoại</label>
                    <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Số điện thoại" />
                  </div>

                  <div className="booking-detail-item">
                    <label>Email</label>
                    <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@example.com" />
                  </div>

                  <div className="booking-detail-item">
                    <label>Điểm đón</label>
                    <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)}>
                      <option value="">-- Chọn tỉnh/thành --</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-detail-item">
                    <label>Điểm trả</label>
                    <select value={endLocation} onChange={(e) => setEndLocation(e.target.value)}>
                      <option value="">-- Chọn tỉnh/thành --</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-detail-item">
                    <label>Ngày & giờ đặt</label>
                    <input value={scheduledStartTime} onChange={(e) => setScheduledStartTime(e.target.value)} placeholder="YYYY-MM-DDTHH:MM:SS" />
                  </div>

                  <div className="booking-detail-item">
                    <label>Loại xe yêu cầu</label>
                    <input value={requestedVehicleType} onChange={(e) => setRequestedVehicleType(e.target.value)} />
                  </div>

                  <div className="booking-detail-item">
                    <label>Số hành khách</label>
                    <input type="number" value={requestedPassengers} onChange={(e) => setRequestedPassengers(e.target.value)} />
                  </div>

                  <div className="booking-detail-item booking-detail-item--full">
                    <label>Hàng hóa</label>
                    <input value={requestedCargo} onChange={(e) => setRequestedCargo(e.target.value)} />
                  </div>
                  <div className="booking-detail-item booking-detail-item--full">
                    <label>Ghi chú</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                </div>
          ) : loading ? (
            <div className="booking-detail-loading">
              <div className="line-spinner"></div>
              <p>Đang tải thông tin...</p>
            </div>
          ) : error ? (
            <div className="booking-detail-error">{error}</div>
          ) : booking ? (
            <>
              <div className="booking-detail-section">
                <h3>
                  <FaUser /> Thông tin khách hàng
                </h3>
                <div className="booking-detail-grid">
                  <div className="booking-detail-item">
                    <label>Tên khách hàng:</label>
                    <span>{booking.customerName || "-"}</span>
                  </div>
                  <div className="booking-detail-item">
                    <label>Số điện thoại:</label>
                    <span>{booking.customerPhone || "-"}</span>
                  </div>
                  <div className="booking-detail-item">
                    <label>Email:</label>
                    <span>{booking.customerEmail || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>
                  <FaMapMarkerAlt /> Lộ trình
                </h3>
                <div className="booking-route">
                  <div className="booking-route-item">
                    <div className="route-marker pickup">Đ</div>
                    <div>
                      <div className="route-label">Điểm đón</div>
                      <div className="route-address">
                        {booking.pickupLocation || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="route-line"></div>
                  <div className="booking-route-item">
                    <div className="route-marker dropoff">Đ</div>
                    <div>
                      <div className="route-label">Điểm trả</div>
                      <div className="route-address">
                        {booking.dropoffLocation || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>
                  <FaClock /> Thời gian & Yêu cầu
                </h3>
                <div className="booking-detail-grid">
                  <div className="booking-detail-item">
                    <label>Ngày đặt lịch:</label>
                    <span>{formatDate(booking.scheduledDate)}</span>
                  </div>
                  <div className="booking-detail-item">
                    <label>Giờ đặt lịch:</label>
                    <span>{formatTime(booking.scheduledTime)}</span>
                  </div>
                  <div className="booking-detail-item">
                    <label>Loại xe yêu cầu:</label>
                    <span>{booking.requestedVehicleType || "-"}</span>
                  </div>
                  <div className="booking-detail-item">
                    <label>Số hành khách:</label>
                    <span>{booking.passengers || "-"}</span>
                  </div>
                  {booking.requestedCargo && (
                    <div className="booking-detail-item booking-detail-item--full">
                      <label>Hàng hóa:</label>
                      <span>{booking.requestedCargo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>
                  <FaCar /> Phân công
                </h3>
                {booking.assignedVehiclePlate ? (
                  <div className="booking-detail-grid">
                    <div className="booking-detail-item">
                      <label>Phương tiện:</label>
                      <span className="assigned-vehicle">
                        {booking.assignedVehiclePlate}
                      </span>
                    </div>
                    <div className="booking-detail-item">
                      <label>Tài xế:</label>
                      <span className="assigned-driver">
                        {booking.assignedDriverName || "-"}
                      </span>
                    </div>
                    <div className="booking-detail-item booking-detail-item--full">
                      <label>Trạng thái:</label>
                      <span className="status-badge status-assigned">
                        Đã phân công
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="booking-not-assigned-box">
                    <span className="status-badge status-not-assigned">
                      Chưa phân công
                    </span>
                    <p className="not-assigned-note">
                      Chuyến đi chưa được phân công phương tiện và tài xế
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="booking-detail-error">Không tìm thấy thông tin</div>
          )}
        </div>

        <div className="booking-detail-modal-footer">
          {bookingId === "new" ? (
            <>
              <button
                className="booking-ghost"
                onClick={() => {
                  onClose();
                }}
                disabled={submitting}
              >
                Hủy
              </button>
              <button className="booking-primary" onClick={handleCreate} disabled={submitting}>
                Tạo lịch
              </button>
            </>
          ) : (
            <button className="booking-ghost" onClick={onClose}>
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
