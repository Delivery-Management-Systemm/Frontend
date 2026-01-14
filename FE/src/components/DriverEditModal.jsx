import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./DriverEditModal.css";
import { getDriverDetails, updateDriver } from "../services/driverAPI";

export default function DriverEditModal({ driverId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    driverStatus: "",
    experienceYears: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDriverDetails();
  }, [driverId]);

  const loadDriverDetails = async () => {
    try {
      setLoading(true);
      const data = await getDriverDetails(driverId);
      setFormData({
        name: data.fullName || data.FullName || "",
        phone: data.phone || data.Phone || "",
        email: data.email || data.Email || "",
        driverStatus: data.driverStatus || data.DriverStatus || "",
        experienceYears: data.experienceYears || data.ExperienceYears || "",
        notes: data.notes || data.Notes || "",
      });
      setError(null);
    } catch (err) {
      console.error("Error loading driver details:", err);
      setError("Không thể tải thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateDriver(driverId, formData);
      onSave();
    } catch (err) {
      console.error("Error updating driver:", err);
      setError("Không thể cập nhật. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="de-modal-overlay" onClick={onClose}>
      <div className="de-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="de-modal-header">
          <h2>Chỉnh sửa tài xế</h2>
          <button className="de-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="de-modal-body">
            {loading ? (
              <div className="de-loading">
                <div className="line-spinner"></div>
              </div>
            ) : error ? (
              <div className="de-error">{error}</div>
            ) : (
              <>
                <div className="de-form-row">
                  <div className="de-form-group">
                    <label>Họ tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="de-form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="de-form-row">
                  <div className="de-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="de-form-group">
                    <label>Trạng thái *</label>
                    <select
                      name="driverStatus"
                      value={formData.driverStatus}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="available">Sẵn sàng</option>
                      <option value="on_trip">Đang chạy</option>
                      <option value="offline">Nghỉ</option>
                    </select>
                  </div>
                </div>

                <div className="de-form-row">
                  <div className="de-form-group">
                    <label>Kinh nghiệm (năm)</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="de-form-group">
                  <label>Ghi chú</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </>
            )}
          </div>

          <div className="de-modal-footer">
            <button type="button" className="de-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="de-btn-submit"
              disabled={saving || loading}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
