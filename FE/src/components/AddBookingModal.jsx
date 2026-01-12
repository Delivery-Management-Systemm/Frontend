import React, { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "./AddBookingModal.css";
import {
  buildRouteOptions,
  formatVnd,
  geocodeAddress,
  getRouteAlternatives,
  reverseGeocode,
} from "../services/routingService";

const vehicleOptions = [
  { key: "small_truck", label: "Xe tai nho" },
  { key: "big_truck", label: "Xe tai lon" },
  { key: "container", label: "Xe container" },
  { key: "bus", label: "Xe khach" },
];

const defaultCenter = [10.8231, 106.6297];

function MapClickHandler({ onPick }) {
  useMapEvents({
    click: (event) => onPick(event.latlng),
  });
  return null;
}

function MapAutoFit({ routeLine, markers, center }) {
  const map = useMap();

  React.useEffect(() => {
    if (routeLine.length > 0) {
      map.fitBounds(routeLine, { padding: [24, 24] });
      return;
    }
    if (markers.length > 0) {
      map.fitBounds(markers, { padding: [24, 24] });
      return;
    }
    if (center) {
      map.setView(center, 11);
    }
  }, [routeLine, markers, center, map]);

  return null;
}

export default function AddBookingModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    customer: "",
    contact: "",
    email: "",
    pickup: "",
    delivery: "",
    date: "",
    time: "",
    vehicleTypeKey: "big_truck",
    vehicleNote: "",
    notes: "",
  });

  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [pickupCoord, setPickupCoord] = useState(null);
  const [deliveryCoord, setDeliveryCoord] = useState(null);
  const [activePoint, setActivePoint] = useState("pickup");
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const when = useMemo(() => {
    if (!form.date) return null;
    const time = form.time || "00:00";
    return new Date(`${form.date}T${time}`);
  }, [form.date, form.time]);

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || null;
  }, [routes, selectedRouteId]);

  const routeLine = useMemo(() => {
    if (!selectedRoute || !selectedRoute.geometry) return [];
    return selectedRoute.geometry.coordinates.map((coord) => [coord[1], coord[0]]);
  }, [selectedRoute]);

  const markers = useMemo(() => {
    const list = [];
    if (pickupCoord) list.push([pickupCoord.lat, pickupCoord.lon]);
    if (deliveryCoord) list.push([deliveryCoord.lat, deliveryCoord.lon]);
    return list;
  }, [pickupCoord, deliveryCoord]);

  const handleMapPick = async (latlng) => {
    const target = activePoint || "pickup";
    const coords = { lat: latlng.lat, lon: latlng.lng };
    try {
      const address = await reverseGeocode(coords.lat, coords.lon);
      if (target === "pickup") {
        update("pickup", address);
        setPickupCoord(coords);
      } else {
        update("delivery", address);
        setDeliveryCoord(coords);
      }
    } catch (error) {
      const fallback = `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`;
      if (target === "pickup") {
        update("pickup", fallback);
        setPickupCoord(coords);
      } else {
        update("delivery", fallback);
        setDeliveryCoord(coords);
      }
    }
    setMapCenter([coords.lat, coords.lon]);
  };

  const handleLocateAddress = async (target) => {
    const query = target === "pickup" ? form.pickup : form.delivery;
    if (!query.trim()) {
      setRouteError("Vui long nhap dia chi.");
      return;
    }
    setRouteError("");
    try {
      const result = await geocodeAddress(query);
      const coords = { lat: result.lat, lon: result.lon };
      if (target === "pickup") {
        update("pickup", result.name || query);
        setPickupCoord(coords);
      } else {
        update("delivery", result.name || query);
        setDeliveryCoord(coords);
      }
      setMapCenter([coords.lat, coords.lon]);
    } catch (error) {
      setRouteError("Khong the tim dia chi. Vui long thu lai.");
    }
  };

  const handleGenerateRoutes = async () => {
    if (!form.pickup.trim() || !form.delivery.trim()) {
      setRouteError("Vui long nhap diem dau va diem cuoi.");
      return;
    }

    setRouteError("");
    setLoadingRoutes(true);
    try {
      const [start, end] = await Promise.all([
        geocodeAddress(form.pickup),
        geocodeAddress(form.delivery),
      ]);
      const alternatives = await getRouteAlternatives(start, end);
      const options = buildRouteOptions(alternatives, form.vehicleTypeKey, when);
      setRoutes(options);
      setSelectedRouteId(options[0]?.id || "");
      setPickupCoord({ lat: start.lat, lon: start.lon });
      setDeliveryCoord({ lat: end.lat, lon: end.lon });
      setMapCenter([(start.lat + end.lat) / 2, (start.lon + end.lon) / 2]);
      if (options.length === 0) {
        setRouteError("Khong tim thay tuyen phu hop.");
      }
    } catch (error) {
      setRouteError("Khong the tinh tuyen. Vui long thu lai.");
      setRoutes([]);
      setSelectedRouteId("");
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.customer.trim() ||
      !form.contact.trim() ||
      !form.pickup.trim() ||
      !form.delivery.trim() ||
      !form.date
    ) {
      alert("Vui long dien day du thong tin bat buoc");
      return;
    }

    if (routes.length > 0 && !selectedRoute) {
      alert("Vui long chon tuyen duong");
      return;
    }

    const typeLabel =
      vehicleOptions.find((item) => item.key === form.vehicleTypeKey)?.label ||
      form.vehicleTypeKey;

    const booking = {
      id: "c" + Date.now(),
      customer: form.customer,
      contact: form.contact,
      email: form.email,
      route: `${form.pickup} -> ${form.delivery}`,
      startLocation: form.pickup,
      endLocation: form.delivery,
      date: form.date,
      time: form.time,
      vehicleType: typeLabel,
      vehicleNote: form.vehicleNote,
      notes: form.notes,
      assigned: null,
      assignedDriver: null,
      status: "pending",
      routeMeta: selectedRoute
        ? {
            id: selectedRoute.id,
            distanceKm: selectedRoute.distanceKm,
            durationMin: selectedRoute.durationMin,
            trafficFactor: selectedRoute.trafficFactor,
            trafficLabel: selectedRoute.trafficLabel,
            costs: selectedRoute.costs,
          }
        : null,
    };

    if (onSave) onSave(booking);
  };

  return (
    <div className="addbooking-overlay">
      <div className="addbooking-container">
        <h3 className="addbooking-title">Dat lich moi</h3>
        <form className="addbooking-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <div>
              <label>Ten khach hang</label>
              <input
                className="input"
                value={form.customer}
                onChange={(e) => update("customer", e.target.value)}
                placeholder="Nguyen Van A"
              />
            </div>
            <div>
              <label>So dien thoai</label>
              <input
                className="input"
                value={form.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder="0901234567"
              />
            </div>
          </div>

          <div className="mt-3">
            <label>Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <h4 className="section-title">Thong tin chuyen di</h4>
          <div>
            <label>Diem dau</label>
            <input
              className="input"
              value={form.pickup}
              onChange={(e) => update("pickup", e.target.value)}
              placeholder="Nhap diem dau"
            />
            <button
              type="button"
              className="btn-link"
              onClick={() => handleLocateAddress("pickup")}
            >
              Dinh vi diem dau tren ban do
            </button>
          </div>
          <div className="mt-3">
            <label>Diem cuoi</label>
            <input
              className="input"
              value={form.delivery}
              onChange={(e) => update("delivery", e.target.value)}
              placeholder="Nhap diem cuoi"
            />
            <button
              type="button"
              className="btn-link"
              onClick={() => handleLocateAddress("delivery")}
            >
              Dinh vi diem cuoi tren ban do
            </button>
          </div>

          <div className="route-map mt-3">
            <div className="route-map-toolbar">
              <span>Chon diem tren ban do:</span>
              <button
                type="button"
                className={`btn btn-secondary ${
                  activePoint === "pickup" ? "is-active" : ""
                }`}
                onClick={() => setActivePoint("pickup")}
              >
                Diem dau
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${
                  activePoint === "delivery" ? "is-active" : ""
                }`}
                onClick={() => setActivePoint("delivery")}
              >
                Diem cuoi
              </button>
              <span className="route-hint">Click ban do de chon diem.</span>
            </div>
            <div className="route-map-frame">
              <MapContainer
                center={mapCenter}
                zoom={11}
                scrollWheelZoom={false}
                className="route-map-canvas"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onPick={handleMapPick} />
                <MapAutoFit
                  routeLine={routeLine}
                  markers={markers}
                  center={mapCenter}
                />
                {pickupCoord ? (
                  <Marker position={[pickupCoord.lat, pickupCoord.lon]} />
                ) : null}
                {deliveryCoord ? (
                  <Marker position={[deliveryCoord.lat, deliveryCoord.lon]} />
                ) : null}
                {routeLine.length > 0 ? (
                  <Polyline positions={routeLine} />
                ) : null}
              </MapContainer>
            </div>
          </div>

          <div className="route-section mt-3">
            <div className="route-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateRoutes}
                disabled={loadingRoutes}
              >
                {loadingRoutes ? "Dang tinh tuyen..." : "Tao tuyen goi y"}
              </button>
              <span className="route-hint">
                Go y tuyen dua tren quang duong, giao thong va chi phi uoc tinh.
              </span>
            </div>

            {routeError ? <div className="route-error">{routeError}</div> : null}

            {routes.length > 0 ? (
              <div className="route-options">
                {routes.map((route, idx) => (
                  <label
                    key={route.id}
                    className={`route-option${
                      route.id === selectedRouteId ? " is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="route"
                      checked={route.id === selectedRouteId}
                      onChange={() => setSelectedRouteId(route.id)}
                    />
                    <div className="route-option-body">
                      <div className="route-title">
                        Tuyen {idx + 1}: {route.distanceKm} km - {route.durationMin} phut
                      </div>
                      <div className="route-total">
                        Tong chi phi: {formatVnd(route.costs.total)}
                      </div>
                      <div className="route-breakdown">
                        Nhien lieu: {formatVnd(route.costs.fuel)} - Cao toc:{" "}
                        {formatVnd(route.costs.toll)} - Pha:{" "}
                        {formatVnd(route.costs.ferry)} - Thoi gian:{" "}
                        {formatVnd(route.costs.time)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid two mt-3">
            <div>
              <label>Ngay dat lich</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
            <div>
              <label>Gio dat lich</label>
              <input
                className="input"
                type="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid two mt-3">
            <div>
              <label>Loai phuong tien</label>
              <select
                className="input"
                value={form.vehicleTypeKey}
                onChange={(e) => update("vehicleTypeKey", e.target.value)}
              >
                {vehicleOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>So hanh khach</label>
              <input className="input" type="number" min="0" placeholder="0" />
            </div>
          </div>

          <div className="mt-3">
            <label>Hang hoa</label>
            <input
              className="input"
              value={form.vehicleNote}
              onChange={(e) => update("vehicleNote", e.target.value)}
              placeholder="Mo ta hang hoa"
            />
          </div>

          <div className="mt-3">
            <label>Ghi chu</label>
            <textarea
              className="input"
              rows={4}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Ghi chu them ve chuyen di"
            />
          </div>

          <div className="mt-4 actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Huy
            </button>
            <button type="submit" className="btn btn-primary">
              Dat lich
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

