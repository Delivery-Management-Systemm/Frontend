import React from "react";
import { FaUser, FaEnvelope, FaPhone,FaLock } from 'react-icons/fa';
import "./Account.css";

const Account = () => {
  return (
    <div className="account-container">
      <h2 className="account-title">Quản lý tài khoản</h2>
      <p className="account-subtitle">Cập nhật thông tin cá nhân và cài đặt</p>

      <div className="account-grid">
        {/* ẢNH ĐẠI DIỆN */}
        <div className="account-card">
          <h3>Ảnh đại diện</h3>

          <div className="avatar-box">
            <div className="avatar-circle">👤</div>

            <label className="upload-btn">
              <span>📷 Thay đổi ảnh</span>
              <input type="file" hidden accept="image/*" />
            </label>

            <p className="avatar-note">JPG, PNG tối đa 2MB</p>
          </div>

          <hr className="divider" />

          <div className="info-block">
            <h4>Thông tin tài khoản</h4>
            <p>ID: <strong>#USER-001</strong></p>
            <p>Ngày tạo: <strong>15/01/2024</strong></p>
            <p>Lần đăng nhập cuối: <strong>01/12/2024</strong></p>
          </div>
        </div>

        {/* THÔNG TIN CÁ NHÂN */}
        <div className="account-card">
          <h3>Thông tin cá nhân</h3>

          <div className="form-grid">
            <label>
              Họ và tên
                <div className="input-wrapper">
                    <FaUser className="input-icon" /> {/* Icon */}
                    <input type="text" placeholder="Họ và tên" /> {/* Input */}
                </div>
            </label>

            <label>
              Email
              <div className="input-wrapper">
                    <FaEnvelope className="input-icon" /> {/* Icon */}
                    <input type="text" placeholder="Email" /> {/* Input */}
              </div>
            </label>

            <label>
              Số điện thoại
              <div className="input-wrapper">
                    <FaPhone className="input-icon" /> {/* Icon */}
                    <input type="text" placeholder="Số điện thoại" /> {/* Input */}
              </div>
            </label>

            <label>
              Chức vụ
             <div className="input-wrapper">
                    <input type="text" placeholder="" /> {/* Input */}
              </div>
            </label>

            <label className="full-width">
              Phòng ban
               <div className="input-wrapper">
                    <input type="text" placeholder="" /> {/* Input */}
              </div>
            </label>
          </div>

          <button className="save-btn">💾 Lưu thay đổi</button>
        </div>

        {/* ĐỔI MẬT KHẨU */}
        <div className="account-card full-width">
          <h3>Đổi mật khẩu</h3>

          <div className="form-grid">
            <label>
              Mật khẩu hiện tại
              <div className="input-wrapper">
                    <FaLock className="input-icon" /> {/* Icon */}
                    <input type="text" placeholder="Mật khẩu hiện tại" /> {/* Input */}
              </div>
            </label>

            <label>
              Mật khẩu mới
               <div className="input-wrapper">
                    <FaLock className="input-icon" /> {/* Icon */}
                    <input type="text" placeholder="Mật khẩu mới" /> {/* Input */}
              </div>
            </label>

            <label className="full-width">
              Xác nhận mật khẩu mới
              <div className="input-wrapper">
                    <FaLock className="input-icon" /> {/* Icon */}
                    <input type="text" placeholder="Xác nhận mật khẩu mới" /> {/* Input */}
              </div>
            </label>
          </div>

          <button className="save-btn">🔐 Đổi mật khẩu</button>
        </div>
        {/* CÀI ĐẶT THÔNG BÁO */}
        <div className="account-card full-width">
        <h3>Cài đặt thông báo</h3>

        <div className="notification-row">
            <div className="notification-info">
            <strong>Thông báo email</strong>
            <p>Nhận thông báo qua email</p>
            </div>
            <input type="checkbox" defaultChecked />
        </div>

        <div className="notification-row">
            <div className="notification-info">
            <strong>Cảnh báo bảo trì</strong>
            <p>Thông báo khi xe sắp đến hạn bảo trì</p>
            </div>
            <input type="checkbox" defaultChecked />
        </div>

        <div className="notification-row">
            <div className="notification-info">
            <strong>Cảnh báo Geofencing</strong>
            <p>Thông báo khi xe ra khỏi khu vực</p>
            </div>
            <input type="checkbox" defaultChecked />
        </div>

        <div className="notification-row">
            <div className="notification-info">
            <strong>Báo cáo hàng tuần</strong>
            <p>Nhận báo cáo tổng hợp hàng tuần</p>
            </div>
            <input type="checkbox" />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
