import React, { useState } from "react";
import { FaExclamationTriangle, FaMapMarkerAlt, FaPhone, FaUser, FaTruck } from "react-icons/fa";
import "./Emergency.css";

const initialReports = [
  {
    id: "e1",
    title: "Hỏng xe",
    level: "high",
    status: "processing",
    desc: "Xe bị nổ lốp trên đường cao tốc, cần hỗ trợ khẩn cấp",
    location: "Km 45, Quốc lộ 5, Hưng Yên",
    contact: "0911111111",
    reporter: "Phạm Văn Đức",
    vehicle: "30B-67890 - Xe tải lớn",
    driver: "Phạm Văn Đức",
    reportedAt: "10:30:00 15/12/2024",
    respondedAt: "10:35:00 15/12/2024",
    resolvedAt: null,
  },
  {
    id: "e2",
    title: "Tai nạn",
    level: "critical",
    status: "resolved",
    desc: "Va chạm nhẹ với xe máy, cần báo cáo và làm thủ tục bảo hiểm",
    location: "Km 120, Quốc lộ 1A, Nghệ An",
    contact: "0933333333",
    reporter: "Trần Văn Kiên",
    vehicle: "51C-11111 - Xe container",
    driver: "Trần Văn Kiên",
    reportedAt: "15:20:00 14/12/2024",
    respondedAt: "15:25:00 14/12/2024",
    resolvedAt: "17:00:00 14/12/2024",
  },
];

export default function Emergency() {
  const [reports, setReports] = useState(initialReports);

  const stats = {
    newReports: reports.filter((r) => !r.respondedAt).length,
    processing: reports.filter((r) => r.status === "processing").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    critical: reports.filter((r) => r.level === "critical").length,
  };

  return (
    <div className="emergency-page">
      <div className="emergency-header-card">
        <div className="emergency-header-left">
          <div className="emergency-header-icon"><FaExclamationTriangle /></div>
          <div>
            <div className="emergency-header-title">Báo cáo khẩn cấp</div>
            <div className="emergency-header-sub">Hệ thống xử lý sự cố khẩn cấp</div>
          </div>
        </div>

        <button className="emergency-new-btn">+ Báo cáo mới</button>
      </div>

      <div className="emergency-stats-row">
        <div className="em-stat"> <div className="em-stat-label">Báo cáo mới</div> <div className="em-stat-value">{stats.newReports}</div> </div>
        <div className="em-stat"> <div className="em-stat-label">Đang xử lý</div> <div className="em-stat-value">{stats.processing}</div> </div>
        <div className="em-stat"> <div className="em-stat-label">Đã giải quyết</div> <div className="em-stat-value">{stats.resolved}</div> </div>
        <div className="em-stat"> <div className="em-stat-label">Khẩn cấp</div> <div className="em-stat-value">{stats.critical}</div> </div>
      </div>

      <div className="emergency-list">
        {reports.map((r) => (
          <div key={r.id} className={`em-card ${r.level === "critical" ? "em-critical" : "em-high"}`}>
            <div className="em-row">
              <div className="em-left">
                <div className="em-title-row">
                  <div className="em-icon-wrap"><FaExclamationTriangle /></div>
                  <div className="em-title-block">
                    <div className="em-title">{r.title}</div>
                    <div className="em-badges">
                      <span className="badge badge-level">{r.level === "critical" ? "Khẩn cấp" : "Cao"}</span>
                      <span className={`badge badge-status`}>{r.status === "resolved" ? "Đã giải quyết" : r.status === "processing" ? "Đang xử lý" : "Mới"}</span>
                    </div>
                  </div>
                </div>

                <div className="em-desc">{r.desc}</div>

                <div className="em-meta">
                  <div className="meta-item"><FaMapMarkerAlt /> <div><div className="meta-label">Vị trí</div><div className="meta-text">{r.location}</div></div></div>
                  <div className="meta-item"><FaPhone /> <div><div className="meta-label">Liên hệ</div><div className="meta-text">{r.contact}</div></div></div>
                  <div className="meta-item"><FaUser /> <div><div className="meta-label">Người báo cáo</div><div className="meta-text">{r.reporter}</div></div></div>
                </div>

                <div className="em-vehicle">
                  <div className="ev-label">Phương tiện liên quan</div>
                  <div className="ev-box"><FaTruck /> <div className="ev-text">{r.vehicle}<div className="ev-sub">Tài xế: {r.driver}</div></div></div>
                </div>

                <div className="em-times">
                  <div>🕒 Báo cáo: {r.reportedAt}</div>
                  <div>↩️ Phản hồi: {r.respondedAt || "-"}</div>
                  <div className="resolved">✅ Giải quyết: {r.resolvedAt || "-"}</div>
                </div>
              </div>

              <div className="em-right">
                {r.status === "resolved" ? (
                  <button className="btn-resolved">Đã giải quyết</button>
                ) : (
                  <button className="btn-close">Đóng báo cáo</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


