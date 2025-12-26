import { useState } from "react";
import "./DriverAssignment.css";

const mockRequests = [
  {
    id: "ar1",
    vehicle: "29A-12345 - Xe tải nhỏ",
    requester: "Trần Thị Bình",
    currentDriver: null,
    newDriver: "Lê Thị Mai",
    reason: "Tài xế hiện tại đang nghỉ phép",
    requestedAt: "2024-12-14T09:00:00",
    processedAt: null,
    status: "pending",
  },
  {
    id: "ar2",
    vehicle: "29D-22222 - Xe khách",
    requester: "Nguyễn Văn An",
    currentDriver: "Nguyễn Thị Hoa",
    newDriver: "Lê Thị Mai",
    reason: "Chuyển đổi ca làm việc",
    requestedAt: "2024-12-10T15:30:00",
    processedAt: "2024-12-10T16:00:00",
    status: "approved",
  },
];

function formatDatetime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function DriverAssignment() {
  const [requests] = useState(mockRequests);

  return (
    <div className="da-page">
      <header className="da-header">
        <div className="da-header-left">
          <h1>Phân công tài xế</h1>
          <p className="da-sub">Quản lý yêu cầu thay đổi tài xế</p>
        </div>
        <div>
          <button className="btn-primary">+ Yêu cầu phân công</button>
        </div>
      </header>

      <section className="da-stats">
        <div className="stat-card">
          <div className="stat-label">Chờ duyệt</div>
          <div className="stat-num">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đã duyệt</div>
          <div className="stat-num">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Từ chối</div>
          <div className="stat-num">0</div>
        </div>
      </section>

      <section className="da-list">
        {requests.map((r) => (
          <article key={r.id} className="da-card">
            <div className="da-card-head">
              <h3 className="req-title">Yêu cầu #{r.id}</h3>
              <span className={`req-badge ${r.status}`}>
                {r.status === "pending" ? "Chờ duyệt" : r.status === "approved" ? "Đã duyệt" : "Từ chối"}
              </span>
            </div>

            <div className="da-row">
              <div className="da-col">
                <div className="label">Phương tiện</div>
                <div className="vehicle">{r.vehicle}</div>

                <div className="driver-box current">
                  <div className="small-label">Tài xế hiện tại</div>
                  <div className="driver-name">{r.currentDriver || "Chưa có"}</div>
                </div>
              </div>

              <div className="da-col">
                <div className="label">Người yêu cầu</div>
                <div className="requester">{r.requester}</div>

                <div className="driver-box new">
                  <div className="small-label">Tài xế mới</div>
                  <div className="driver-name">{r.newDriver}</div>
                </div>
              </div>
            </div>

            <div className="reason">
              <div className="small-label">Lý do</div>
              <div className="reason-text">{r.reason}</div>
            </div>

            <div className="da-card-foot">
              <div className="timestamps">
                <div>Yêu cầu lúc: {formatDatetime(r.requestedAt)}</div>
                {r.processedAt && <div>Xử lý lúc: {formatDatetime(r.processedAt)}</div>}
              </div>

              {r.status === "pending" && (
                <div className="actions">
                  <button className="btn-approve" onClick={() => alert(`Duyệt ${r.id}`)}>
                    Duyệt
                  </button>
                  <button className="btn-reject" onClick={() => alert(`Từ chối ${r.id}`)}>
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}


