import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { FiAlertTriangle } from "react-icons/fi";
import { MdLocationOn, MdSpeed } from "react-icons/md";
import {
  getVehicleLocations,
  getAlerts,
  getGPSStats,
  getVehicleList,
} from "../services/gpsService";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GPSTracking.css";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different vehicle statuses
const createCustomIcon = (status) => {
  const colors = {
    moving: "#4caf50",
    idle: "#ff9800",
    alert: "#f44336",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${colors[status] || colors.moving};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
    ">🚗</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const GPSTracking = () => {
  const [vehicleLocations, setVehicleLocations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Simulate real-time updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [locationsData, vehiclesData, alertsData, statsData] =
      await Promise.all([
        getVehicleLocations(),
        getVehicleList(),
        getAlerts(),
        getGPSStats(),
      ]);
    setVehicleLocations(locationsData);
    setVehicles(vehiclesData);
    setAlerts(alertsData);
    setStats(statsData);
    setLoading(false);
  };

  const getFuelBarClass = (fuel) => {
    if (fuel < 30) return "low";
    if (fuel < 60) return "medium";
    return "";
  };

  return (
    <div className="gps-tracking">
      <div className="page-header">
        <div>
          <h1>GPS Tracking</h1>
          <p className="page-subtitle">
            Theo dõi vị trí và trạng thái xe real-time
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đang di chuyển</div>
            <div className="stat-value">{stats.moving}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đã dừng</div>
            <div className="stat-value">{stats.idle}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-label">Cảnh báo</div>
            <div className="stat-value">{stats.alert}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <MdLocationOn />
          </div>
          <div className="stat-content">
            <div className="stat-label">Cảnh báo</div>
            <div className="stat-value">{stats.geofencing}</div>
          </div>
        </div>
      </div>

      <div className="gps-layout">
        <div className="map-section">
          <div className="map-container-wrapper">
            <div className="map-overlay">
              <div className="map-title">
                <h3>Bản đồ theo dõi</h3>
                <p className="map-subtitle">Bản đồ GPS Real-time</p>
              </div>
              <div className="map-legend">
                <div className="legend-item">
                  <span className="legend-dot moving"></span>
                  <span>Đang di chuyển</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot idle"></span>
                  <span>Đã dừng</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot alert"></span>
                  <span>Cảnh báo</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot geofencing"></span>
                  <span>Cảnh báo</span>
                </div>
              </div>
            </div>

            <MapContainer
              center={[21.0285, 105.8542]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {vehicleLocations.map((vehicle) => (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lat, vehicle.lng]}
                  icon={createCustomIcon(vehicle.status)}
                >
                  <Popup>
                    <div style={{ minWidth: "200px" }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          color: "#2a85ff",
                          fontSize: "16px",
                        }}
                      >
                        {vehicle.id}
                      </h3>
                      <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Tài xế:</strong> {vehicle.name}
                      </div>
                      <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Tốc độ:</strong> {vehicle.speed} km/h
                      </div>
                      <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Nhiên liệu:</strong> {vehicle.fuel}%
                      </div>
                      {vehicle.destination && (
                        <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                          <strong>Đích đến:</strong> {vehicle.destination}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6f767e",
                          marginTop: "8px",
                        }}
                      >
                        Cập nhật: {vehicle.lastUpdate}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {vehicleLocations
                .filter((v) => v.status === "moving")
                .map((vehicle) => (
                  <Circle
                    key={`circle-${vehicle.id}`}
                    center={[vehicle.lat, vehicle.lng]}
                    radius={500}
                    pathOptions={{
                      color: "#4caf50",
                      fillColor: "#4caf50",
                      fillOpacity: 0.1,
                    }}
                  />
                ))}
            </MapContainer>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="alerts-card">
            <div className="alerts-header">
              <FiAlertTriangle style={{ color: "#ff9800" }} />
              <h3>Cảnh báo Geofencing</h3>
            </div>
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#6f767e",
                  padding: "20px",
                }}
              >
                Đang tải...
              </div>
            ) : alerts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#6f767e",
                  padding: "20px",
                }}
              >
                Không có cảnh báo
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-vehicle">{alert.vehicle}</div>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{alert.time}</div>
                </div>
              ))
            )}
          </div>

          <div className="vehicles-list-card">
            <div className="vehicles-list-header">
              <h3>Danh sách xe</h3>
            </div>
            <div className="vehicles-list-content">
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6f767e",
                    padding: "40px",
                  }}
                >
                  Đang tải...
                </div>
              ) : vehicles.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6f767e",
                    padding: "40px",
                  }}
                >
                  Không có xe
                </div>
              ) : (
                vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="vehicle-item">
                    <div className="vehicle-header">
                      <span className="vehicle-id">{vehicle.id}</span>
                      <span
                        className={`vehicle-status-dot ${vehicle.status}`}
                      ></span>
                    </div>
                    <div className="vehicle-driver">{vehicle.driver}</div>
                    <div className="vehicle-info">
                      <div className="vehicle-info-item">
                        <MdLocationOn />
                        {vehicle.location}
                      </div>
                    </div>
                    <div className="vehicle-info" style={{ marginTop: "8px" }}>
                      <div className="vehicle-info-item">
                        <MdSpeed />
                        Tốc độ: {vehicle.speed} km/h
                      </div>
                      <div className="fuel-indicator">
                        <span>Nhiên liệu: {vehicle.fuel}%</span>
                        <div className="fuel-bar">
                          <div
                            className={`fuel-fill ${getFuelBarClass(
                              vehicle.fuel
                            )}`}
                            style={{ width: `${vehicle.fuel}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#9a9fa5",
                        marginTop: "8px",
                      }}
                    >
                      Cập nhật: {vehicle.lastUpdate}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSTracking;
