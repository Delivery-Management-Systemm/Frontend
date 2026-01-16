// src/components/modules/FuelDetail.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function FuelDetail({ record, vehicles, types, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);

  const [date, setDate] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [type, setType] = useState(types?.[0] ?? "Xang");
  const [liters, setLiters] = useState("");
  const [cost, setCost] = useState("");
  const [odometer, setOdometer] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!record) return;
    setDate(record.date ?? "");
    setVehicleId(record.vehicleId ?? "");
    setType(record.type ?? (types?.[0] ?? "Xang"));
    setLiters(String(record.liters ?? ""));
    setCost(String(record.cost ?? ""));
    setOdometer(record.odometer == null ? "" : String(record.odometer));
    setNote(record.note ?? "");
    setEdit(false);
  }, [record]);

  const vehicleText = useMemo(() => {
    const v = vehicles.find((x) => x.id === record?.vehicleId);
    return v ? `${v.name} (${v.plate})` : "Xe (không xác d?nh)";
  }, [vehicles, record]);

  if (!record) {
    return (
      <div className="fuel-detail">
        <div className="fuel-detail-empty">Ch?n m?t b?n ghi bên trái d? xem chi ti?t.</div>
      </div>
    );
  }

  const unitPrice =
    Number(record.liters || 0) > 0 ? Math.round((Number(record.cost || 0) / Number(record.liters || 0)) * 100) / 100 : 0;

  function save() {
    const l = Number(liters);
    const c = Number(cost);
    const odo = odometer ? Number(odometer) : null;

    if (!vehicleId) return alert("Vui lòng ch?n xe.");
    if (!Number.isFinite(l) || l <= 0) return alert("S? lít ph?i > 0.");
    if (!Number.isFinite(c) || c <= 0) return alert("Chi phí ph?i > 0.");

    onUpdate(record.id, {
      date,
      vehicleId,
      type,
      liters: l,
      cost: c,
      odometer: odo,
      note,
    });

    setEdit(false);
  }

  function cancel() {
    setDate(record.date ?? "");
    setVehicleId(record.vehicleId ?? "");
    setType(record.type ?? (types?.[0] ?? "Xang"));
    setLiters(String(record.liters ?? ""));
    setCost(String(record.cost ?? ""));
    setOdometer(record.odometer == null ? "" : String(record.odometer));
    setNote(record.note ?? "");
    setEdit(false);
  }

  function remove() {
    const ok = confirm("Xoá b?n ghi này?");
    if (!ok) return;
    onDelete(record.id);
  }

  return (
    <div className="fuel-detail">
      <div className="fuel-detail-head">
        <div>
          <div className="fuel-detail-title">Chi ti?t</div>
          <div className="fuel-muted">{vehicleText}</div>
        </div>

        <div className="fuel-actions">
          {!edit ? (
            <button className="fuel-btn" type="button" onClick={() => setEdit(true)}>
              S?a
            </button>
          ) : (
            <>
              <button className="fuel-btn primary" type="button" onClick={save}>
                Luu
              </button>
              <button className="fuel-btn" type="button" onClick={cancel}>
                Hu?
              </button>
            </>
          )}
          <button className="fuel-btn danger" type="button" onClick={remove}>
            Xoá
          </button>
        </div>
      </div>

      <div className="fuel-detail-grid">
        <div className="fuel-kv">
          <div className="fuel-k">Mã</div>
          <div className="fuel-v mono">{record.id}</div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">Ngày</div>
          <div className="fuel-v">
            {edit ? (
              <input className="fuel-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            ) : (
              record.date
            )}
          </div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">Xe</div>
          <div className="fuel-v">
            {edit ? (
              <select className="fuel-select" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.plate})
                  </option>
                ))}
              </select>
            ) : (
              vehicleText
            )}
          </div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">Lo?i</div>
          <div className="fuel-v">
            {edit ? (
              <select className="fuel-select" value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <span className="fuel-badge">{record.type}</span>
            )}
          </div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">S? lít</div>
          <div className="fuel-v">
            {edit ? (
              <input className="fuel-input" value={liters} onChange={(e) => setLiters(e.target.value)} />
            ) : (
              `${Number(record.liters || 0).toLocaleString("vi-VN")} L`
            )}
          </div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">Chi phí</div>
          <div className="fuel-v">
            {edit ? (
              <input className="fuel-input" value={cost} onChange={(e) => setCost(e.target.value)} />
            ) : (
              Number(record.cost || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            )}
          </div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">Ðon giá</div>
          <div className="fuel-v">
            {Number(unitPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}/L
          </div>
        </div>

        <div className="fuel-kv">
          <div className="fuel-k">ODO</div>
          <div className="fuel-v">
            {edit ? (
              <input className="fuel-input" value={odometer} onChange={(e) => setOdometer(e.target.value)} />
            ) : record.odometer == null ? (
              <span className="fuel-muted">—</span>
            ) : (
              Number(record.odometer).toLocaleString("vi-VN")
            )}
          </div>
        </div>

        <div className="fuel-kv full">
          <div className="fuel-k">Ghi chú</div>
          <div className="fuel-v">
            {edit ? (
              <input className="fuel-input" value={note} onChange={(e) => setNote(e.target.value)} />
            ) : record.note ? (
              record.note
            ) : (
              <span className="fuel-muted">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
