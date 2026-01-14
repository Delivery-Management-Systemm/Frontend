import { useState } from "react";
import { FaPlus, FaRoute, FaUserCog } from "react-icons/fa";
import "./DriverAssignment.css";
import { mockRequests, mockTrips } from "../services/driverAssignmentMock";

function formatDatetime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

function AssignmentModal({ trips, selectedTripId, onChangeTrip, onClose }) {
  return (
    <div className="da-modal-overlay">
      <div className="da-modal">
        <div className="da-modal-header">
          <h3>Phan cong chuyen di</h3>
        </div>
        <div className="da-modal-body">
          <label>Chon chuyen di</label>
          <select
            className="da-select"
            value={selectedTripId}
            onChange={(e) => onChangeTrip(e.target.value)}
          >
            <option value="">-- Chon chuyen di --</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                #{trip.id} - {trip.customer} ({trip.from} {'->'} {trip.to})
              </option>
            ))}
          </select>
        </div>
        <div className="da-modal-footer">
          <button className="da-btn-ghost" type="button" onClick={onClose}>
            Huy
          </button>
          <button className="da-btn-primary" type="button" onClick={onClose}>
            Xac nhan phan cong
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestModal({ onClose }) {
  return (
    <div className="da-modal-overlay">
      <div className="da-modal">
        <div className="da-modal-header">
          <h3>Tao yeu cau phan cong tai xe</h3>
        </div>
        <div className="da-modal-body">
          <label>Chon xe</label>
          <select className="da-select">
            <option>-- Chon phuong tien --</option>
            <option>29A-12345 - Xe tai nho</option>
            <option>30B-67890 - Xe tai lon</option>
          </select>

          <label>Tai xe moi</label>
          <select className="da-select">
            <option>-- Chon tai xe --</option>
            <option>Le Thi Mai</option>
            <option>Nguyen Thi Hoa</option>
          </select>

          <label>Lo xe</label>
          <select className="da-select">
            <option>-- Khong chon --</option>
            <option>Nguyen Van Duc</option>
            <option>Tran Van Kien</option>
          </select>

          <label>Ly do thay doi</label>
          <textarea className="da-textarea" rows={4} placeholder="Nhap ly do thay doi tai xe" />
        </div>
        <div className="da-modal-footer">
          <button className="da-btn-ghost" type="button" onClick={onClose}>
            Huy
          </button>
          <button className="da-btn-primary" type="button" onClick={onClose}>
            Tao yeu cau
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DriverAssignment() {
  const [requests] = useState(mockRequests);
  const [trips] = useState(mockTrips);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState("");

  const openAssignModal = (tripId) => {
    setSelectedTripId(tripId || "");
    setShowAssignModal(true);
  };

  return (
    <div className="da-page">
      <header className="da-header">
        <div className="da-header-left">
          <div className="da-header-icon">
            <FaUserCog />
          </div>
          <div>
            <h1>Phan cong tai xe</h1>
            <p className="da-sub">Quan ly chuyen di va phan cong tai xe</p>
          </div>
        </div>
        <div className="da-header-actions">
          <button
            className="da-btn da-btn--assign"
            type="button"
            onClick={() => openAssignModal("")}
          >
            <span className="da-btn-icon"><FaRoute /></span>
            Phan cong chuyen di
          </button>
          <button
            className="da-btn da-btn--request"
            type="button"
            onClick={() => setShowRequestModal(true)}
          >
            <span className="da-btn-icon"><FaPlus /></span>
            Yeu cau phan cong
          </button>
        </div>
      </header>

      <section className="da-stats">
        <div className="stat-card">
          <div className="stat-label">Cho duyet</div>
          <div className="stat-num">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Da duyet</div>
          <div className="stat-num stat-num-green">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tu choi</div>
          <div className="stat-num stat-num-red">0</div>
        </div>
      </section>

      <section className="da-section">
        <div className="da-section-title">
          <span className="da-section-icon"><FaRoute /></span>
          Chuyen di cho phan cong ({trips.length})
        </div>

        <div className="da-trip-list">
          {trips.map((trip) => (
            <article key={trip.id} className="da-trip-card">
              <div className="da-trip-header">
                <div className="da-trip-id">
                  #{trip.id}
                  <span className={`da-trip-badge ${trip.status}`}>
                    {trip.status === "pending" ? "Cho xac nhan" : "Da xac nhan"}
                  </span>
                </div>
                <button
                  className="da-trip-action"
                  type="button"
                  onClick={() => openAssignModal(trip.id)}
                >
                  Phan cong
                </button>
              </div>

              <div className="da-trip-grid">
                <div>
                  <div className="da-label">Khach hang</div>
                  <div className="da-value">{trip.customer}</div>
                  <div className="da-subvalue">{trip.phone}</div>
                </div>
                <div>
                  <div className="da-label">Lo trinh</div>
                  <div className="da-value">{trip.from}</div>
                  <div className="da-subvalue">{'->'} {trip.to}</div>
                </div>
                <div>
                  <div className="da-label">Loai xe yeu cau</div>
                  <div className="da-value">{trip.vehicleType}</div>
                  <div className="da-subvalue">{trip.vehicleNote}</div>
                </div>
                <div>
                  <div className="da-label">Thoi gian</div>
                  <div className="da-value">{trip.date}</div>
                  <div className="da-subvalue">{trip.time}</div>
                </div>
              </div>

              {trip.note ? (
                <div className="da-trip-note">Ghi chu: {trip.note}</div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="da-list">
        {requests.map((r) => (
          <article key={r.id} className="da-card">
            <div className="da-card-head">
              <h3 className="req-title">Yeu cau #{r.id}</h3>
              <span className={`req-badge ${r.status}`}>
                {r.status === "pending"
                  ? "Cho duyet"
                  : r.status === "approved"
                    ? "Da duyet"
                    : "Tu choi"}
              </span>
            </div>

            <div className="da-row">
              <div className="da-col">
                <div className="label">Phuong tien</div>
                <div className="vehicle">{r.vehicle}</div>

                <div className="driver-box current">
                  <div className="small-label">Tai xe hien tai</div>
                  <div className="driver-name">{r.currentDriver || "Chua co"}</div>
                </div>
              </div>

              <div className="da-col">
                <div className="label">Nguoi yeu cau</div>
                <div className="requester">{r.requester}</div>

                <div className="driver-box new">
                  <div className="small-label">Tai xe moi</div>
                  <div className="driver-name">{r.newDriver}</div>
                </div>
              </div>
            </div>

            <div className="reason">
              <div className="small-label">Ly do</div>
              <div className="reason-text">{r.reason}</div>
            </div>

            <div className="da-card-foot">
              <div className="timestamps">
                <div>Yeu cau luc: {formatDatetime(r.requestedAt)}</div>
                {r.processedAt && (
                  <div>Xu ly luc: {formatDatetime(r.processedAt)}</div>
                )}
              </div>

              {r.status === "pending" && (
                <div className="actions">
                  <button className="btn-approve" onClick={() => alert(`Duyet ${r.id}`)}>
                    Duyet
                  </button>
                  <button className="btn-reject" onClick={() => alert(`Tu choi ${r.id}`)}>
                    Tu choi
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      {showAssignModal ? (
        <AssignmentModal
          trips={trips}
          selectedTripId={selectedTripId}
          onChangeTrip={setSelectedTripId}
          onClose={() => setShowAssignModal(false)}
        />
      ) : null}

      {showRequestModal ? (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      ) : null}
    </div>
  );
}

