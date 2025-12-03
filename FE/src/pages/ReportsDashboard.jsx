// src/pages/ReportsDashboard.jsx
import React, { useEffect, useState } from "react";
import { getReportOverview } from "../services/reportAPI.js";
import "./Reports.css";

const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(value);

const ReportsDashboard = () => {
  const [period, setPeriod] = useState("this_month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getReportOverview(period)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading || !data) {
    return (
      <div className="reports-root">
        <div className="reports-loading">Đang tải dữ liệu báo cáo...</div>
      </div>
    );
  }

  return (
    <div className="reports-root">
      {/* HEADER */}
      <header className="reports-header">
        <div>
          <h1 className="reports-title">Báo cáo &amp; Thống kê</h1>
          <p className="reports-subtitle">
            Phân tích hiệu suất và chi phí đội xe
          </p>
        </div>
        <div className="reports-header-actions">
          <select
            className="reports-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="this_month">Tháng này</option>
            <option value="last_month">Tháng trước</option>
            <option value="this_quarter">Quý này</option>
          </select>
          <button
            type="button"
            className="reports-export-btn"
            onClick={() => alert("Tạm thời chỉ là demo xuất báo cáo 🙂")}
          >
            ⬇ Xuất báo cáo
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="reports-summary-grid">
        <div className="reports-summary-card">
          <div className="reports-summary-label">Tổng chi phí</div>
          <div className="reports-summary-main">
            <span className="reports-summary-value">
              {formatNumber(data.summary.totalCost)}M
            </span>
            <span className="reports-summary-icon">💰</span>
          </div>
          <div
            className={
              "reports-summary-trend " +
              (data.summary.totalCostChange < 0
                ? "is-down"
                : "is-up")
            }
          >
            {data.summary.totalCostChange < 0 ? "↓" : "↑"}{" "}
            {Math.abs(data.summary.totalCostChange)}% so với tháng trước
          </div>
        </div>

        <div className="reports-summary-card">
          <div className="reports-summary-label">Chi phí nhiên liệu</div>
          <div className="reports-summary-main">
            <span className="reports-summary-value">
              {formatNumber(data.summary.fuelCost)}M
            </span>
            <span className="reports-summary-icon">⛽</span>
          </div>
          <div
            className={
              "reports-summary-trend " +
              (data.summary.fuelCostChange < 0 ? "is-down" : "is-up")
            }
          >
            {data.summary.fuelCostChange < 0 ? "↓" : "↑"}{" "}
            {Math.abs(data.summary.fuelCostChange)}% so với tháng trước
          </div>
        </div>

        <div className="reports-summary-card">
          <div className="reports-summary-label">Tổng quãng đường</div>
          <div className="reports-summary-main">
            <span className="reports-summary-value">
              {formatNumber(data.summary.totalDistance)} km
            </span>
            <span className="reports-summary-icon">🚚</span>
          </div>
          <div
            className={
              "reports-summary-trend " +
              (data.summary.totalDistanceChange < 0
                ? "is-down"
                : "is-up")
            }
          >
            {data.summary.totalDistanceChange < 0 ? "↓" : "↑"}{" "}
            {Math.abs(data.summary.totalDistanceChange)}% so với tháng trước
          </div>
        </div>

        <div className="reports-summary-card">
          <div className="reports-summary-label">Hiệu suất trung bình</div>
          <div className="reports-summary-main">
            <span className="reports-summary-value">
              {data.summary.avgEfficiency} km/L
            </span>
            <span className="reports-summary-icon">👤</span>
          </div>
          <div className="reports-summary-status">{data.summary.efficiencyLabel}</div>
        </div>
      </section>

      {/* CHARTS ROW */}
      <section className="reports-main-grid">
        {/* BAR CHART */}
        <div className="reports-card reports-card-tall">
          <div className="reports-card-header">
            <h3>Chi phí 6 tháng gần nhất (Triệu VNĐ)</h3>
          </div>
          <div className="reports-bar-chart">
            <div className="reports-bar-chart-inner">
              {data.costByMonth.map((m) => (
                <div className="reports-bar-group" key={m.label}>
                  <div className="reports-bar-wrapper">
                    <div
                      className="reports-bar-total"
                      style={{ height: `${m.totalPercent}%` }}
                    />
                    <div
                      className="reports-bar-fuel"
                      style={{ height: `${m.fuelPercent}%` }}
                    />
                  </div>
                  <span className="reports-bar-label">{m.label}</span>
                </div>
              ))}
            </div>
            <div className="reports-bar-legend">
              <span className="legend-dot legend-total" /> Tổng chi phí
              <span className="legend-dot legend-fuel" /> Nhiên liệu
            </div>
          </div>
        </div>

        {/* PIE-LIKE CARD */}
        <div className="reports-card reports-card-tall">
          <div className="reports-card-header">
            <h3>Phân bố chi phí</h3>
          </div>
          <div className="reports-pie-wrapper">
            <div className="reports-pie-fake">
              {data.costDistribution.map((item, index) => (
                <div
                  key={item.label}
                  className={`reports-pie-slice slice-${index}`}
                />
              ))}
              <div className="reports-pie-center">
                <span>Tổng</span>
                <strong>{formatNumber(data.summary.totalCost)}M</strong>
              </div>
            </div>
            <ul className="reports-pie-legend">
              {data.costDistribution.map((item, index) => (
                <li key={item.label}>
                  <span
                    className={`legend-dot legend-slice-${index}`}
                  />
                  <span className="legend-label">{item.label}</span>
                  <span className="legend-value">
                    {item.percent}% • {formatNumber(item.value)}M
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TABLE + STATUS ROW */}
      <section className="reports-bottom-grid">
        {/* TABLE */}
        <div className="reports-card reports-card-wide">
          <div className="reports-card-header">
            <h3>Hiệu suất theo xe</h3>
          </div>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Xe</th>
                  <th>Số chuyến</th>
                  <th>Quãng đường (km)</th>
                  <th>Hiệu suất (km/L)</th>
                  <th>Đánh giá</th>
                  <th>Xếp hạng</th>
                </tr>
              </thead>
              <tbody>
                {data.vehiclePerformance.map((v) => (
                  <tr key={v.plate}>
                    <td>{v.plate}</td>
                    <td>{v.trips}</td>
                    <td>{formatNumber(v.distance)}</td>
                    <td
                      className={
                        "reports-efficiency " +
                        (v.efficiency >= 8.2
                          ? "is-good"
                          : v.efficiency >= 8
                          ? "is-medium"
                          : "is-bad")
                      }
                    >
                      {v.efficiency.toFixed(1)}
                    </td>
                    <td>
                      {"⭐".repeat(Math.round(v.rating))}
                      <span className="reports-rating-number">
                        {v.rating.toFixed(1)}
                      </span>
                    </td>
                    <td>{v.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="reports-right-column">
          <div className="reports-card">
            <div className="reports-card-header">
              <h3>Tình trạng đội xe</h3>
            </div>
            <div className="reports-status-grid">
              {data.fleetStatus.map((s) => (
                <div
                  key={s.label}
                  className={
                    "reports-status-card status-" + s.statusKey
                  }
                >
                  <div className="reports-status-top-row">
                    <span className="reports-status-label">{s.label}</span>
                    <span className="reports-status-percent">
                      {s.percent}%
                    </span>
                  </div>
                  <div className="reports-status-value">
                    {s.count} xe
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reports-card">
            <div className="reports-card-header">
              <h3>Thống kê hôm nay</h3>
            </div>
            <div className="reports-today-list">
              {data.todayStats.map((item) => (
                <div key={item.label} className="reports-today-item">
                  <div className="reports-today-header">
                    <span className="reports-today-label">{item.label}</span>
                    <span className="reports-today-value">
                      {item.valueText}
                    </span>
                  </div>
                  <div className="reports-progress">
                    <div
                      className="reports-progress-inner"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <div className="reports-today-percent">
                    {item.percent}% mục tiêu
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsDashboard;
