// src/components/modules/FuelForm.jsx
import React, { useMemo, useState } from "react";

export default function FuelForm({ vehicles, types, onCreate }) {
  const defaultVehicleId = useMemo(() => vehicles?.[0]?.id ?? "", [vehicles]);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [vehicleId, setVehicleId] = useState(defaultVehicleId);
  const [type, setType] = useState(types?.[0] ?? "Xang");
  const [liters, setLiters] = useState("");
  const [cost, setCost] = useState("");
  const [odometer, setOdometer] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    if (!vehicleId) return setError("Vui lòng ch?n xe.");
    const l = Number(liters);
    const c = Number(cost);

    if (!Number.isFinite(l) || l <= 0) return setError("S? lít ph?i > 0.");
    if (!Number.isFinite(c) || c <= 0) return setError("Chi phí ph?i > 0.");

    onCreate({
      date,
      vehicleId,
      type,
      liters: l,
      cost: c,
      odometer: odometer ? Number(odometer) : null,
      note,
    });

    // reset light
    setLiters("");
    setCost("");
    setOdometer("");
    setNote("");
  }

  return (
    <div className="fuel-form">
      <div className="fuel-form-title">T?o b?n ghi m?i</div>

      <form onSubmit={submit} className="fuel-form-grid">
        <label className="fuel-field">
          <span>Ngày</span>
          <input className="fuel-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label className="fuel-field">
          <span>Xe</span>
          <select className="fuel-select" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="" disabled>
              Ch?n xe...
            </option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.plate})
              </option>
            ))}
          </select>
        </label>

        <label className="fuel-field">
          <span>Lo?i</span>
          <select className="fuel-select" value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="fuel-field">
          <span>S? lít</span>
          <input
            className="fuel-input"
            inputMode="decimal"
            placeholder="VD: 20"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
          />
        </label>

        <label className="fuel-field">
          <span>Chi phí (VND)</span>
          <input
            className="fuel-input"
            inputMode="numeric"
            placeholder="VD: 450000"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </label>

        <label className="fuel-field">
          <span>ODO (tu? ch?n)</span>
          <input
            className="fuel-input"
            inputMode="numeric"
            placeholder="VD: 52340"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
          />
        </label>

        <label className="fuel-field fuel-field-full">
          <span>Ghi chú (tu? ch?n)</span>
          <input
            className="fuel-input"
            placeholder="VD: Ð? ? cây xang X..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        {error ? <div className="fuel-error fuel-field-full">{error}</div> : null}

        <div className="fuel-actions fuel-field-full">
          <button className="fuel-btn primary" type="submit">
            T?o b?n ghi
          </button>
        </div>
      </form>
    </div>
  );
}
