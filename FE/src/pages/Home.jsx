import React from "react";
import {
  FaTruck,
  FaUser,
  FaRoute,
  FaExclamationTriangle,
  FaCheck,
  FaWrench,
  FaUserPlus,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./Home.css";

// ====================== MOCK DATA =============================

const fuelCostData = [
  { month: "T1", value: 4500 },
  { month: "T2", value: 3800 },
  { month: "T3", value: 4300 },
  { month: "T4", value: 3950 },
  { month: "T5", value: 4200 },
  { month: "T6", value: 4650 },
];

const tripsWeeklyData = [
  { day: "T2", trips: 45 },
  { day: "T3", trips: 52 },
  { day: "T4", trips: 48 },
  { day: "T5", trips: 62 },
  { day: "T6", trips: 55 },
  { day: "T7", trips: 50 },
  { day: "CN", trips: 38 },
];

const fleetStatusData = [
  { name: "Hoạt động", value: 70, color: "#00C49F" },
  { name: "Bảo trì", value: 16, color: "#FFBB28" },
  { name: "Hỏng", value: 6, color: "#FF8042" },
  { name: "Chờ", value: 8, color: "#8884d8" },
];

// ===============================================================

export default function Home() {
  return (
    <div className="home-container">

      <h1 className="home-title">Dashboard</h1>
      <p className="home-subtitle">Tổng quan hệ thống quản lý đội xe</p>

      {/* ========================================================= */}
      {/*                        TOP CARDS                         */}
      {/* ========================================================= */}
      <div className="home-stat-grid">

        <div className="home-stat-card">
          <div className="home-stat-icon home-blue">
            <FaTruck />
          </div>
          <div className="home-stat-value">50</div>
          <div className="home-stat-label">Tổng số xe</div>
          <div className="home-stat-footer home-green">35 xe đang hoạt động</div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon home-green-bg">
            <FaUser />
          </div>
          <div className="home-stat-value">72</div>
          <div className="home-stat-label">Tài xế</div>
          <div className="home-stat-footer home-green">68 đang làm việc</div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon home-purple">
            <FaRoute />
          </div>
          <div className="home-stat-value">348</div>
          <div className="home-stat-label">Chuyến đi tháng này</div>
          <div className="home-stat-footer">28 chuyến hôm nay</div>
        </div>

        <div className="home-stat-card home-warning">
          <div className="home-stat-icon home-orange">
            <FaExclamationTriangle />
          </div>
          <div className="home-stat-value">5</div>
          <div className="home-stat-label">Sắp đến hạn bảo dưỡng</div>
          <div className="home-stat-footer home-red">3 xe cần bảo trì</div>
        </div>

      </div>

      {/* ========================================================= */}
      {/*                          CHARTS                          */}
      {/* ========================================================= */}

      <div className="home-chart-row">

        {/* FUEL COST BAR CHART */}
        <div className="home-chart-card">
          <h3>Chi phí nhiên liệu (Triệu VNĐ)</h3>
          
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fuelCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 6000]} />
              <Tooltip />
              <Bar dataKey="value" fill="#4287f5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* WEEKLY TRIPS LINE CHART */}
        <div className="home-chart-card">
          <h3>Số chuyến đi tuần này</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={tripsWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 80]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="trips"
                stroke="#00b37d"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ========================================================= */}
      {/*                      BOTTOM ROW                          */}
      {/* ========================================================= */}
      <div className="home-bottom-row">

        {/* PIE CHART */}
        <div className="home-info-card">
          <h3>Tình trạng đội xe</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={fleetStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {fleetStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="home-info-card">
          <h3>Hoạt động gần đây</h3>

          <div className="home-activity">
            <span className="home-icon home-green-bg"><FaCheck /></span>
            <p>Chuyến đi hoàn thành<br/><span>Xe 29A-12345 – 5 phút trước</span></p>
          </div>

          <div className="home-activity">
            <span className="home-icon home-blue-bg"><FaTruck /></span>
            <p>Xe mới được thêm<br/><span>30B-98765 – 1 giờ trước</span></p>
          </div>

          <div className="home-activity">
            <span className="home-icon home-orange-bg"><FaWrench /></span>
            <p>Bảo trì hoàn thành<br/><span>Xe 29A-54321 – 2 giờ trước</span></p>
          </div>

          <div className="home-activity">
            <span className="home-icon home-purple-bg"><FaUserPlus /></span>
            <p>Tài xế mới<br/><span>Nguyễn Văn A – 3 giờ trước</span></p>
          </div>

        </div>

        {/* TOP DRIVERS */}
        <div className="home-info-card">
          <h3>Top tài xế hoạt động tốt</h3>

          <div className="home-driver">
            <span className="home-rank home-gold">1</span>
            <p>Trần Văn B<br/><span>45 chuyến</span></p>
            <span className="home-percent">98%</span>
          </div>

          <div className="home-driver">
            <span className="home-rank home-silver">2</span>
            <p>Lê Thị C<br/><span>42 chuyến</span></p>
            <span className="home-percent">96%</span>
          </div>

          <div className="home-driver">
            <span className="home-rank home-bronze">3</span>
            <p>Phạm Văn D<br/><span>38 chuyến</span></p>
            <span className="home-percent">95%</span>
          </div>

          <div className="home-driver">
            <span className="home-rank home-gray">4</span>
            <p>Hoàng Thị E<br/><span>35 chuyến</span></p>
            <span className="home-percent">94%</span>
          </div>

        </div>

      </div>

    </div>
  );
}
