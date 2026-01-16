import React from "react";
import {
  FaTruck,
  FaUser,
  FaRoute,
  FaExclamationTriangle,
  FaWaveSquare,
  FaCheckCircle,
} from "react-icons/fa";
import "./Home.css";

// Mock data for dashboard cards
const homeMockData = {
  user: {
    name: "Trần Thị Bình",
  },
  topCards: [
    {
      key: "totalVehicles",
      title: "Tổng số xe",
      value: 5,
      footer: "2 sẵn sàng",
      icon: <FaTruck />,
      theme: "blue",
    },
    {
      key: "totalDrivers",
      title: "Tổng tài xế",
      value: 5,
      footer: "2 sẵn sàng",
      icon: <FaUser />,
      theme: "green",
    },
    {
      key: "todayTrips",
      title: "Chuyến đi hôm nay",
      value: 2,
      footer: "1 hoàn thành",
      icon: <FaRoute />,
      theme: "purple",
    },
    {
      key: "urgentReports",
      title: "Báo cáo khẩn cấp",
      value: 2,
      footer: "1 khẩn cấp",
      icon: <FaExclamationTriangle />,
      theme: "red",
    },
  ],
  vehicleStatus: {
    title: "Trạng thái phương tiện",
    items: [
      { label: "Sẵn sàng", value: 2, color: "green" },
      { label: "Đang sử dụng", value: 1, color: "blue" },
      { label: "Đang công tác", value: 1, color: "purple" },
      { label: "Bảo trì", value: 1, color: "yellow" },
    ],
  },
  driverStatus: {
    title: "Trạng thái tài xế",
    items: [
      { label: "Đang lái", value: 1, color: "blue" },
      { label: "Sẵn sàng", value: 2, color: "green" },
      { label: "Đang công tác", value: 1, color: "purple" },
      { label: "Nghỉ phép", value: 1, color: "gray" },
    ],
  },
  recentActivities: {
    title: "Hoạt động gần đây",
    items: [
      {
        id: "act-1",
        color: "blue",
        title: "Phạm Văn Đức đang lái 30B-67890",
        subtitle: "Hà Nội → Hải Phòng (120 km)",
        status: "Đang thực hiện",
        date: "15/12/2024",
      },
      {
        id: "act-2",
        color: "blue",
        title: "Trần Văn Kiên đang lái 51C-11111",
        subtitle: "TP. Hồ Chí Minh → Đà Nẵng (965 km)",
        status: "Đang thực hiện",
        date: "14/12/2024",
      },
      {
        id: "act-3",
        color: "green",
        title: "Nguyễn Thị Hoa đang lái 29A-12345",
        subtitle: "Hà Nội → Ninh Bình (95 km)",
        status: "Hoàn thành",
        date: "10/12/2024",
      },
    ],
  },
  capabilityByType: [
    {
      key: "small_truck",
      title: "Xe tải nhỏ",
      requiredLicenses: "C, FC",
      numVehicles: 1,
      driversWithLicense: 3,
      driversReady: 2,
    },
    {
      key: "big_truck",
      title: "Xe tải lớn",
      requiredLicenses: "C, D, FC, FD",
      numVehicles: 1,
      driversWithLicense: 4,
      driversReady: 2,
    },
    {
      key: "container",
      title: "Xe container",
      requiredLicenses: "E, FE",
      numVehicles: 1,
      driversWithLicense: 1,
      driversReady: 0,
    },
    {
      key: "bus",
      title: "Xe khách",
      requiredLicenses: "D, FD",
      numVehicles: 1,
      driversWithLicense: 2,
      driversReady: 0,
    },
    {
      key: "pickup",
      title: "Xe bán tải",
      requiredLicenses: "B2, C, FB2, FC",
      numVehicles: 1,
      driversWithLicense: 3,
      driversReady: 2,
    },
  ],
};

function HomeProgressRow({ item, maxValue }) {
  const pct = maxValue > 0 ? Math.round((item.value / maxValue) * 100) : 0;

  return (
    <div className="home-progress-row">
      <div className="home-progress-left">
        <span className={`home-dot home-dot-${item.color}`} />
        <span className="home-progress-label">{item.label}</span>
      </div>

      <div className="home-progress-right">
        <span className="home-progress-value">{item.value}</span>
        <div className="home-progress-track" aria-hidden="true">
          <div
            className={`home-progress-fill home-progress-fill-${item.color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home({ currentUser }) {
  const { topCards, vehicleStatus, driverStatus, recentActivities } =
    homeMockData;
  const capabilityByType = homeMockData.capabilityByType || [];
  const displayName = currentUser?.fullName || homeMockData.user.name;

  const vehicleMax = Math.max(...vehicleStatus.items.map((x) => x.value), 0);
  const driverMax = Math.max(...driverStatus.items.map((x) => x.value), 0);

  return (
    <div className="home-container">
      <div className="home-header-card">
        <div className="home-header-icon">
          <FaWaveSquare />
        </div>
        <div className="home-header-text">
          <div className="home-header-title">Tổng quan hệ thống</div>
          <div className="home-header-subtitle">Chào mừng, {displayName}</div>
        </div>
      </div>

      <div className="home-stat-grid">
        {topCards.map((card) => (
          <div key={card.key} className="home-stat-card">
            <div className="home-stat-main">
              <div className="home-stat-text">
                <div className="home-stat-title">{card.title}</div>
                <div className="home-stat-value">{card.value}</div>
                <div className="home-stat-footer">{card.footer}</div>
              </div>

              <div
                className={`home-stat-icon-wrap home-stat-icon-${card.theme}`}
                aria-hidden="true"
              >
                <span className={`home-stat-icon home-stat-icon-${card.theme}`}>
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="home-status-grid">
        <div className="home-panel-card">
          <div className="home-panel-title">{vehicleStatus.title}</div>
          <div className="home-progress-list">
            {vehicleStatus.items.map((item, idx) => (
              <HomeProgressRow
                key={`${item.label}-${idx}`}
                item={item}
                maxValue={vehicleMax}
              />
            ))}
          </div>
        </div>

        <div className="home-panel-card">
          <div className="home-panel-title">{driverStatus.title}</div>
          <div className="home-progress-list">
            {driverStatus.items.map((item, idx) => (
              <HomeProgressRow
                key={`${item.label}-${idx}`}
                item={item}
                maxValue={driverMax}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="home-panel-card">
        <div className="home-panel-title">{recentActivities.title}</div>

        <div className="home-activity-list">
          {recentActivities.items.map((act) => (
            <div key={act.id} className="home-activity-item">
              <div className="home-activity-left">
                <span className={`home-dot home-dot-${act.color}`} />
                <div className="home-activity-content">
                  <div className="home-activity-title">{act.title}</div>
                  <div className="home-activity-subtitle">{act.subtitle}</div>
                  <div className="home-activity-status">{act.status}</div>
                </div>
              </div>

              <div className="home-activity-date">{act.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-panel-card capability-panel">
        <div className="home-panel-title">Khả năng vận hành theo loại xe</div>
        <div className="capability-list">
          {capabilityByType.map((item) => (
            <div className="capability-item" key={item.key}>
              <div className="capability-left">
                <div className="capability-title">
                  {item.title}{" "}
                  <span className="capability-ok">
                    <FaCheckCircle />
                  </span>
                </div>
                <div className="capability-sub">
                  Bằng lái cần: {item.requiredLicenses}
                </div>

                <div className="capability-stats">
                  <div className="cap-stat">
                    <div className="cap-stat-label">Số xe</div>
                    <div className="cap-stat-value">{item.numVehicles}</div>
                  </div>

                  <div className="cap-stat">
                    <div className="cap-stat-label">Tài xế có bằng</div>
                    <div className="cap-stat-value">
                      {item.driversWithLicense}
                    </div>
                  </div>

                  <div className="cap-stat">
                    <div className="cap-stat-label">Tài xế sẵn sàng</div>
                    <div
                      className={`cap-stat-value ${
                        item.driversReady === 0 ? "cap-zero" : ""
                      }`}
                    >
                      {item.driversReady}
                    </div>
                  </div>
                </div>
              </div>

              <div className="capability-right">
                <div className="cap-ratio">
                  {item.driversWithLicense}/{item.numVehicles}
                </div>
                <div className="cap-ratio-sub">Tài xế/Xe</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

