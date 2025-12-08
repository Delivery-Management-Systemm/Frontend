import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { MdLocalGasStation } from "react-icons/md";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getFuelRecords,
  getFuelStats,
  getFuelChartData,
} from "../services/fuelService";
import "./FuelManagement.css";
import "./TripManagement.css";

const FuelManagement = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ consumption: [], cost: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recordsData, statsData, chartsData] = await Promise.all([
      getFuelRecords(),
      getFuelStats(),
      getFuelChartData(),
    ]);
    setRecords(recordsData);
    setStats(statsData);
    setChartData(chartsData);
    setLoading(false);
  };

  const filteredRecords = records.filter(
    (record) =>
      record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fuel-management">
      <div className="page-header">
        <div>
          <h1>Quản lý nhiên liệu</h1>
          <p className="page-subtitle">
            Theo dõi tiêu thụ và chi phí nhiên liệu
          </p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card-large">
          <div className="stat-header">
            <div className="stat-icon-small blue">
              <MdLocalGasStation />
            </div>
            <div className="stat-title">Tổng nhiên liệu</div>
          </div>
          <div className="stat-main-value">{stats.totalFuel}</div>
          <div className="stat-change positive">{stats.fuelChange}</div>
        </div>

        <div className="stat-card-large">
          <div className="stat-header">
            <div className="stat-icon-small orange">
              <MdLocalGasStation />
            </div>
            <div className="stat-title">Tổng chi phí</div>
          </div>
          <div className="stat-main-value">{stats.totalCost}</div>
          <div className="stat-change negative">{stats.costChange}</div>
        </div>

        <div className="stat-card-large">
          <div className="stat-header">
            <div className="stat-icon-small green">
              <MdLocalGasStation />
            </div>
            <div className="stat-title">TB/Chuyến</div>
          </div>
          <div className="stat-main-value">{stats.avgConsumption}</div>
          <div className="stat-change">{stats.consumptionChange}</div>
        </div>

        <div className="stat-card-large">
          <div className="stat-header">
            <div className="stat-icon-small purple">
              <MdLocalGasStation />
            </div>
            <div className="stat-title">Giá TB/Lít</div>
          </div>
          <div className="stat-main-value">{stats.totalStations}</div>
          <div className="stat-change">{stats.stationsChange}</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-title">Lượng nhiên liệu tuần này (Lít)</div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.consumption}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6f767e" fontSize={12} />
                <YAxis stroke="#6f767e" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#2196f3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Chi phí tuần này (Nghìn VNĐ)</div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.cost}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6f767e" fontSize={12} />
                <YAxis stroke="#6f767e" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff9800"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Tìm kiếm theo xe, tài xế, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary">
            <FiPlus /> Ghi nhận đổ xăng
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Xe</th>
                <th>Tài xế</th>
                <th>Địa điểm</th>
                <th>Số lượng</th>
                <th>Chi phí</th>
                <th>Km hiện tại</th>
                <th>Chuyến đi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="loading-cell">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    Không tìm thấy bản ghi
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.time}</td>
                    <td className="vehicle-cell">{record.vehicle}</td>
                    <td>{record.driver}</td>
                    <td>{record.location}</td>
                    <td>
                      <span className="fuel-type-badge diesel">
                        {record.amount}
                      </span>
                    </td>
                    <td>{record.cost}</td>
                    <td>{record.distance}</td>
                    <td>{record.station}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FuelManagement;
