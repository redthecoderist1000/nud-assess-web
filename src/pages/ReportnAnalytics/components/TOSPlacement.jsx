import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip } from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip);

const defaultChartData = {
  labels: [
    "Remember",
    "Understand",
    "Apply/Placement",
    "Analyze",
    "Evaluate"
  ],
  datasets: [
    {
      label: "Performance",
      data: [85, 78, 92, 88, 74],
      backgroundColor: "#22c55e",
      borderRadius: 6,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
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
      ticks: {
        color: "#222",
        font: { size: 14 },
        maxRotation: 30,
        minRotation: 30,
      },
    },
    y: {
      min: 0,
      max: 100,
      grid: { color: "#eee" },
      ticks: { color: "#222", font: { size: 14 }, stepSize: 25 },
    },
  },
};

const TOSPlacement = ({ chartData }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 w-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[17px] font-semibold text-[#26348b] flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M3 17V7M8 17V3M13 17V11M18 17V9" stroke="#26348b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Performance Per Placement in TOS
      </span>
    </div>
    <p className="text-sm text-gray-500 mt-1 mb-4">
      Performance breakdown by Bloom's taxonomy levels
    </p>
    <div style={{ width: "100%", height: 260 }}>
      <Bar data={chartData || defaultChartData} options={options} />
    </div>
  </div>
);

export default TOSPlacement;