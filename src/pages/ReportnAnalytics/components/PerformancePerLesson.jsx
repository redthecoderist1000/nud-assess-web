import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler } from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler);

const defaultChartData = {
  labels: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5", "Lesson 6"],
  datasets: [
    {
      label: "Performance",
      data: [78, 82, 85, 80, 88, 91],
      fill: true,
      backgroundColor: "rgba(59, 73, 223, 0.08)",
      borderColor: "#26348b",
      pointBackgroundColor: "#26348b",
      pointBorderColor: "#26348b",
      pointRadius: 5,
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#222", font: { size: 14 } },
    },
    y: {
      min: 0,
      max: 100,
      grid: { color: "#eee" },
      ticks: { color: "#222", font: { size: 14 }, stepSize: 25 },
    },
  },
};

const PerformancePerLesson = ({ chartData, className }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 p-5 w-full ${className || ""}`}
    style={{
      boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
      width: "100%",
    }}
  >
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[17px] font-semibold text-[#26348b] flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M3 17V7M8 17V3M13 17V11M18 17V9" stroke="#26348b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Performance Per Lesson
      </span>
    </div>
    <p className="text-sm text-gray-500 mt-1 mb-4">
      Track student performance trends across lessons
    </p>
    <div style={{ width: "100%", height: 220 }}>
      <Line data={chartData || defaultChartData} options={options} />
    </div>
  </div>
);

export default PerformancePerLesson;