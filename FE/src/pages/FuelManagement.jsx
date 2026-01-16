// src/pages/FuelManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaChartLine, FaDollarSign, FaGasPump, FaPlus, FaSearch, FaTint, FaTimes } from "react-icons/fa";
import "./FuelManagement.css";
import ConfirmModal from "../components/ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ensureSeedVehicles, getVehicles, setFuelRecords, makeId } from "../services/fuelStorage";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "cost-desc", label: "Tổng tiền cao" },
  { value: "cost-asc", label: "Tổng tiền thấp" },
];

export default function FuelManagement() {
  const [vehicles, setVehiclesState] = useState([]);
  const [records, setRecords] = useState([]);
  const [drivers, setDrivers] = useState([]);
 
  // helper to try multiple backend bases and return parsed JSON
  async function tryFetchEndpoints(path, options) {
    const bases = ["http://localhost:5064", "", "http://localhost:5000", "https://localhost:5064", "https://localhost:5001"];
    const attempts = [];
    for (const base of bases) {
      const url = base + path;
      try {
        const res = await fetch(url, options);
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        if (!res.ok) {
          // try to extract error body
          let bodyText = "";
          try {
            if (ct.includes("application/json")) {
              const json = await res.json();
              bodyText = JSON.stringify(json);
            } else {
              bodyText = await res.text();
            }
          } catch { /* ignore */ }
          const msg = `HTTP ${res.status} ${bodyText ? "- " + bodyText : ""}`;
          attempts.push({ url, ok: false, reason: msg });
          console.warn("Fetch non-ok:", url, res.status, bodyText);
          continue;
        }

        if (ct.includes("application/json")) {
          const json = await res.json();
          return json;
        } else if (res.status === 204) {
          return null;
        } else {
          const text = await res.text().catch(() => "");
          attempts.push({ url, ok: true, reason: `non-json content-type: ${ct} body: ${text}` });
          console.warn("Fetch non-json response, skipping:", url, ct);
          continue;
        }
      } catch (err) {
        const reason = err?.message || String(err);
        attempts.push({ url, ok: false, reason });
        console.warn("Fetch error:", url, reason);
        continue;
      }
    }
    const details = attempts.map(a => `${a.url} -> ${a.reason}`).join("; ");
    throw new Error(`All endpoints failed for ${path}. Attempts: ${details}`);
  }

  const [query, setQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    date: new Date().toISOString().slice(0, 10),
    odometer: "",
    liters: "",
    unitPrice: "",
    station: "",
    note: "",
  });
  const [formError, setFormError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);

  useEffect(() => {
    async function tryFetchEndpoints(path, options) {
      const bases = [
        "",
        "https://localhost:5064",
        "http://localhost:5064",
        "https://localhost:5001",
        "http://localhost:5000",
      ];
      for (const base of bases) {
        const url = base + path;
        try {
          const res = await fetch(url, options);
          if (res.ok) {
            return await res.json();
          } else {
            // non-ok response, log and continue
            console.warn("Fetch non-ok:", url, res.status);
          }
        } catch (err) {
          console.warn("Fetch error:", url, err.message);
        }
      }
      throw new Error("All endpoints failed for " + path);
    }

    async function loadData() {
      // vehicles: try backend then fallback to seeded
      try {
        const vdata = await tryFetchEndpoints("/api/vehicle?pageNumber=1&pageSize=50");
        const items = Array.isArray(vdata?.objects) ? vdata.objects : [];
        const mapped = items.map((v) => ({
          id: v.vehicleID,
          name: v.vehicleModel ?? v.vehicleType ?? `Xe ${v.vehicleID}`,
          plate: v.licensePlate,
        }));
        if (mapped.length > 0) setVehiclesState(mapped);
        else setVehiclesState(ensureSeedVehicles());
      } catch (err) {
        console.error("Failed to load vehicles:", err.message);
        setVehiclesState(ensureSeedVehicles());
      }

      // drivers: try backend
      try {
        const ddata = await tryFetchEndpoints("/api/driver?pageNumber=1&pageSize=50");
        const ditems = Array.isArray(ddata?.objects) ? ddata.objects : [];
        const dmapped = ditems.map((d) => ({
          id: d.driverID ?? d.DriverID,
          name: d.name ?? d.Name ?? d.fullName ?? d.FullName,
        }));
        if (dmapped.length > 0) setDrivers(dmapped);
      } catch (err) {
        console.warn("Failed to load drivers:", err.message);
      }

      // fuel records
      try {
        const fdata = await tryFetchEndpoints("/api/fuelrecord?pageNumber=1&pageSize=50");
        const items = Array.isArray(fdata?.objects) ? fdata.objects : [];
        const mapped = items.map((fr) => ({
          id: fr.fuelRecordID,
          date: (fr.fuelTime || "").slice(0, 10),
          vehicleId: fr.vehicleID,
          vehiclePlate: fr.vehiclePlate, // convenience if available
          liters: fr.fuelAmount,
          unitPrice: fr.fuelAmount ? Math.round((fr.fuelCost / fr.fuelAmount) * 100) / 100 : 0,
          cost: fr.fuelCost,
          odometer: fr.currentKm,
          station: fr.reFuelLocation,
          note: fr.note ?? "",
          createdAt: fr.fuelTime,
          updatedAt: fr.fuelTime,
        }));
        setRecords(mapped);
      } catch (err) {
        console.error("Failed to load fuel records:", err.message);
        setRecords([]);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const vs = getVehicles();
    if (Array.isArray(vs) && vs.length) setVehiclesState(vs);
  }, []);

  function persist(next) {
    setRecords(next);
    setFuelRecords(next);
  }

  function resetForm() {
    setForm({
      vehicleId: vehicles[0]?.id ?? "",
      date: new Date().toISOString().slice(0, 10),
      odometer: "",
      liters: "",
      unitPrice: "",
      station: "",
      note: "",
    });
    setFormError("");
  }

  function openModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleCreate(e) {
    e.preventDefault();
    setFormError("");

    const liters = Number(form.liters);
    const unitPrice = Number(form.unitPrice);
    const odometer = form.odometer ? Number(form.odometer) : null;

    if (!form.vehicleId) return setFormError("Vui lòng chọn phương tiện.");
    if (!form.date) return setFormError("Vui lòng chọn ngày đổ xăng.");
    if (!Number.isFinite(liters) || liters <= 0) return setFormError("Số lít phải > 0.");
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) return setFormError("Đơn giá phải > 0.");
    if (!Number.isFinite(odometer) || odometer <= 0) return setFormError("Số km phải > 0.");
    if (!form.station.trim()) return setFormError("Vui lòng nhập trạm xăng.");

    const cost = Math.round(liters * unitPrice);

    (async () => {
      try {
        // try get vehicle detail to find assigned driver
        let driverId = null;
        try {
          const vdetail = await tryFetchEndpoints(`/api/vehicle/${form.vehicleId}`);
          if (vdetail) {
            driverId = vdetail.assignedDriverId ?? vdetail.AssignedDriverId ?? vdetail.assignedDriverID ?? vdetail.AssignedDriverID ?? vdetail.driverID ?? vdetail.DriverID ?? vdetail.VehicleID ?? null;
            // prefer DriverID-like fields
            if (vdetail.assignedDriverId) driverId = vdetail.assignedDriverId;
            else if (vdetail.AssignedDriverId) driverId = vdetail.AssignedDriverId;
            else if (vdetail.assignedDriverID) driverId = vdetail.assignedDriverID;
            else if (vdetail.AssignedDriverID) driverId = vdetail.AssignedDriverID;
            else if (vdetail.driverID) driverId = vdetail.driverID;
            else if (vdetail.DriverID) driverId = vdetail.DriverID;
            else if (vdetail.DriverId) driverId = vdetail.DriverId;
          }
        } catch (err) {
          // ignore
        }
        // if no driver found, auto-pick first available driver from drivers list
        if (!driverId && Array.isArray(drivers) && drivers.length > 0) {
          driverId = drivers[0].id;
        }
        const payload = {
          VehicleID: Number(form.vehicleId),
          DriverID: driverId ? Number(driverId) : undefined,
          TripID: null,
          FuelTime: new Date(form.date).toISOString(),
          ReFuelLocation: form.station.trim(),
          FuelAmount: liters,
          FuelCost: cost,
          CurrentKm: odometer
        };

        const created = await tryFetchEndpoints("/api/fuelrecord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!created) throw new Error("Create failed");
        const mapped = {
          id: created.fuelRecordID,
          date: (created.fuelTime || "").slice(0,10),
          vehicleId: created.vehicleID,
          vehiclePlate: created.vehiclePlate ?? null,
          liters: created.fuelAmount,
          unitPrice: created.fuelAmount ? Math.round((created.fuelCost / created.fuelAmount) * 100) / 100 : 0,
          cost: created.fuelCost,
          odometer: created.currentKm,
          station: created.reFuelLocation,
          note: created.note ?? "",
          createdAt: created.fuelTime,
          updatedAt: created.fuelTime,
        };
        persist([mapped, ...records]);
        setIsModalOpen(false);
        toast.success("Tạo phiếu thành công");
      } catch (err) {
        setFormError(err.message || "Failed to create fuel record");
        toast.error(err.message || "Failed to create fuel record");
      }
    })();
  }

  function handleDelete(id) {
    console.log("[FuelManagement] handleDelete called for id=", id);
    // open confirmation modal (do not use native confirm)
    setConfirmTargetId(id);
    setConfirmOpen(true);
  }

  async function onConfirmDelete() {
    const id = confirmTargetId;
    setConfirmOpen(false);
    console.log("[FuelManagement] onConfirmDelete executing for id=", id);
    try {
      await tryFetchEndpoints(`/api/fuelrecord/${id}`, { method: "DELETE" });
      const remaining = records.filter((r) => r.id !== id);
        persist(remaining);
        toast.success("Xóa phiếu thành công");
    } catch (err) {
      console.error("[FuelManagement] delete failed:", err);
        toast.error("Xóa thất bại: " + (err?.message || "Lỗi khi gọi server"));
    } finally {
      setConfirmTargetId(null);
    }
  }

  const nowMonth = new Date().toISOString().slice(0, 7);

  const monthRecords = useMemo(
    () => records.filter((r) => (r.date || "").slice(0, 7) === nowMonth),
    [records, nowMonth]
  );

  const monthTotalCost = useMemo(
    () => monthRecords.reduce((s, r) => s + (Number(r.cost) || 0), 0),
    [monthRecords]
  );
  const monthTotalLiters = useMemo(
    () => monthRecords.reduce((s, r) => s + (Number(r.liters) || 0), 0),
    [monthRecords]
  );
  const monthCount = monthRecords.length;
  const monthAverage = monthCount ? Math.round(monthTotalCost / monthCount) : 0;

  const filtered = useMemo(() => {
    let data = [...records];

    if (vehicleFilter !== "all") {
      data = data.filter((r) => r.vehicleId === vehicleFilter);
    }

    if (dateFrom) {
      data = data.filter((r) => (r.date || "") >= dateFrom);
    }

    if (dateTo) {
      data = data.filter((r) => (r.date || "") <= dateTo);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter((r) => {
        const vehicle = vehicles.find((v) => v.id === r.vehicleId);
        const vehicleText = vehicle ? `${vehicle.name} ${vehicle.plate}`.toLowerCase() : "";
        return (
          vehicleText.includes(q) ||
          (r.station || "").toLowerCase().includes(q) ||
          (r.note || "").toLowerCase().includes(q)
        );
      });
    }

    data.sort((a, b) => {
      if (sortBy === "oldest") return (a.date || "").localeCompare(b.date || "");
      if (sortBy === "cost-desc") return (Number(b.cost) || 0) - (Number(a.cost) || 0);
      if (sortBy === "cost-asc") return (Number(a.cost) || 0) - (Number(b.cost) || 0);
      return (b.date || "").localeCompare(a.date || "");
    });

    return data;
  }, [records, vehicleFilter, dateFrom, dateTo, query, sortBy, vehicles]);

  const modalTotal = useMemo(() => {
    const liters = Number(form.liters) || 0;
    const unitPrice = Number(form.unitPrice) || 0;
    return Math.round(liters * unitPrice);
  }, [form.liters, form.unitPrice]);

  return (
    <div className="fuel-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="fuel-hero">
        <div className="fuel-hero-left">
          <div className="fuel-hero-icon">
            <FaTint />
          </div>
          <div>
            <h2 className="fuel-hero-title">Nhiên liệu</h2>
            <p className="fuel-hero-subtitle">Theo dõi và quản lý các phiếu đổ xăng cho phương tiện</p>
          </div>
        </div>

        <button className="fuel-primary-btn" type="button" onClick={openModal}>
          <FaPlus />
          Thêm phiếu
        </button>
      </div>

      <div className="fuel-stats-grid">
        <div className="fuel-stat-card">
          <div className="fuel-stat-icon green">
            <FaDollarSign />
          </div>
          <div className="fuel-stat-label">Tổng chi tháng này</div>
          <div className="fuel-stat-value">{formatMoney(monthTotalCost)}</div>
        </div>

        <div className="fuel-stat-card">
          <div className="fuel-stat-icon blue">
            <FaGasPump />
          </div>
          <div className="fuel-stat-label">Tổng lít tháng này</div>
          <div className="fuel-stat-value">{formatNumber(monthTotalLiters)} L</div>
        </div>

        <div className="fuel-stat-card">
          <div className="fuel-stat-icon purple">
            <FaTint />
          </div>
          <div className="fuel-stat-label">Số phiếu tháng này</div>
          <div className="fuel-stat-value">{formatNumber(monthCount)}</div>
        </div>

        <div className="fuel-stat-card">
          <div className="fuel-stat-icon orange">
            <FaChartLine />
          </div>
          <div className="fuel-stat-label">Trung bình / phiếu</div>
          <div className="fuel-stat-value">{formatMoney(monthAverage)}</div>
        </div>
      </div>

      <div className="fuel-panel">
        <div className="fuel-panel-row">
          <div className="fuel-field">
            <span className="fuel-field-label">Tìm kiếm</span>
            <div className="fuel-input-with-icon">
              <FaSearch />
              <input
                className="fuel-input"
                placeholder="Biển số / trạm / ghi chú"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="fuel-field">
            <span className="fuel-field-label">Phương tiện</span>
            <select className="fuel-input" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
              <option value="all">Tất cả xe</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.plate})
                </option>
              ))}
            </select>
          </div>

          <div className="fuel-field">
            <span className="fuel-field-label">Từ ngày</span>
            <input className="fuel-input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>

          <div className="fuel-field">
            <span className="fuel-field-label">Đến ngày</span>
            <input className="fuel-input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        <div className="fuel-panel-row">
          <div className="fuel-field">
            <span className="fuel-field-label">Sắp xếp</span>
            <select className="fuel-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="fuel-table">
        <div className="fuel-table-head">
          <div>NGÀY</div>
          <div>BIỂN SỐ</div>
          <div>ODOMETER (KM)</div>
          <div>LÍT</div>
          <div>ĐƠN GIÁ</div>
          <div>TỔNG TIỀN</div>
          <div>TRẠM</div>
          <div>GHI CHÚ</div>
          <div>HÀNH ĐỘNG</div>
        </div>

        {filtered.length === 0 ? (
          <div className="fuel-empty">
            <div className="fuel-empty-icon">
              <FaTint />
            </div>
            <div className="fuel-empty-text">Chưa có phiếu đổ xăng nào</div>
          </div>
        ) : (
          filtered.map((record) => {
            const vehicle = vehicles.find((v) => v.id === record.vehicleId);
            const unitPrice = record.unitPrice || (record.liters ? record.cost / record.liters : 0);
            return (
              <div key={record.id} className="fuel-table-row">
                <div>{record.date}</div>
                <div>{vehicle?.plate || record.vehiclePlate || "--"}</div>
                <div>{record.odometer == null ? "--" : formatNumber(record.odometer)}</div>
                <div>{formatNumber(record.liters)} L</div>
                <div>{formatMoney(unitPrice)}</div>
                <div>{formatMoney(record.cost)}</div>
                <div>{record.station || "--"}</div>
                <div className="fuel-note-cell">{record.note || "--"}</div>
                <div>
                  <button className="fuel-link-btn" type="button" onClick={() => handleDelete(record.id)}>
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen ? (
        <div className="fuel-modal-backdrop" onClick={closeModal}>
          <div className="fuel-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="fuel-modal-header">
              <h3>Thêm phiếu đổ xăng</h3>
              <button className="fuel-icon-btn" type="button" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form className="fuel-modal-body" onSubmit={handleCreate}>
              <div className="fuel-modal-field">
                <label>
                  Phương tiện <span className="fuel-required">*</span>
                </label>
                <select
                  className="fuel-input"
                  value={form.vehicleId}
                  onChange={(e) => setForm((prev) => ({ ...prev, vehicleId: e.target.value }))}
                >
                  <option value="">Chọn phương tiện</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="fuel-modal-grid">
                <div className="fuel-modal-field">
                  <label>
                    Ngày đổ xăng <span className="fuel-required">*</span>
                  </label>
                  <input
                    className="fuel-input"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div className="fuel-modal-field">
                  <label>
                    Số km (Odometer) <span className="fuel-required">*</span>
                  </label>
                  <input
                    className="fuel-input"
                    inputMode="numeric"
                    placeholder="Ví dụ: 15000"
                    value={form.odometer}
                    onChange={(e) => setForm((prev) => ({ ...prev, odometer: e.target.value }))}
                  />
                </div>

                <div className="fuel-modal-field">
                  <label>
                    Số lít <span className="fuel-required">*</span>
                  </label>
                  <input
                    className="fuel-input"
                    inputMode="decimal"
                    placeholder="Ví dụ: 50"
                    value={form.liters}
                    onChange={(e) => setForm((prev) => ({ ...prev, liters: e.target.value }))}
                  />
                </div>

                <div className="fuel-modal-field">
                  <label>
                    Đơn giá (VND/lít) <span className="fuel-required">*</span>
                  </label>
                  <input
                    className="fuel-input"
                    inputMode="numeric"
                    placeholder="Ví dụ: 24000"
                    value={form.unitPrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, unitPrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="fuel-modal-field">
                <label>Tổng tiền</label>
                <div className="fuel-total">{formatMoney(modalTotal)}</div>
                <div className="fuel-total-hint">Được tính tự động: Số lít × Đơn giá</div>
              </div>

              <div className="fuel-modal-field">
                <label>
                  Trạm xăng <span className="fuel-required">*</span>
                </label>
                <input
                  className="fuel-input"
                  placeholder="Ví dụ: Petrolimex Nguyễn Văn Linh"
                  value={form.station}
                  onChange={(e) => setForm((prev) => ({ ...prev, station: e.target.value }))}
                />
              </div>

              <div className="fuel-modal-field">
                <label>Ghi chú</label>
                <input
                  className="fuel-input"
                  placeholder="Thêm ghi chú nếu cần..."
                  value={form.note}
                  onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                />
              </div>

              {formError ? <div className="fuel-form-error">{formError}</div> : null}

              <div className="fuel-modal-actions">
                <button className="fuel-secondary-btn" type="button" onClick={closeModal}>
                  Hủy
                </button>
                <button className="fuel-primary-btn" type="submit">
                  Lưu phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <ConfirmModal
        open={confirmOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa phiếu đổ xăng này? Hành động này sẽ xóa vĩnh viễn."
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function formatMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatNumber(n) {
  const v = Number(n || 0);
  return v.toLocaleString("vi-VN");
}


