import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const colors = [
  "#1e40af", 
  "#f59e42", 
  "#10b981", 
  "#fbbf24", 
  "#6366f1", 
];

const PerfGraph = ({ classesData }) => {
  const defaultClassesData = [
    {
      name: "Calculus III (MATH201)",
      color: "#fbbf24",
      scores: [80.2, 81.5, 82.1, 83.0, 84.2, 85.0],
    },
    {
      name: "Data Structures (CS301)",
      color: "#1e40af",
      scores: [91.2, 90.8, 86.7, 89.0, 90.5, 92.1],
    },
    {
      name: "Database Systems (CS401)",
      color: "#6366f1",
      scores: [92.5, 93.0, 93.4, 92.8, 93.1, 94.0],
    },
    {
      name: "Software Engineering (CS402)",
      color: "#f59e42",
      scores: [88.2, 89.1, 87.9, 88.5, 89.0, 88.7],
    },
    {
      name: "Statistics (MATH350)",
      color: "#10b981",
      scores: [82.1, 83.5, 84.8, 85.2, 86.0, 86.5],
    },
  ];

  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: (classesData || defaultClassesData).map((cls, idx) => ({
      label: cls.name,
      data: cls.scores,
      borderColor: cls.color || colors[idx % colors.length],
      backgroundColor: cls.color || colors[idx % colors.length],
      pointBackgroundColor: cls.color || colors[idx % colors.length],
      pointBorderColor: "#fff",
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: false,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => {
            const cls = data.datasets[tooltipItem.datasetIndex];
            return `${cls.label}: ${tooltipItem.formattedValue}`;
          },
        },
        backgroundColor: "#fff",
        titleColor: "#222",
        bodyColor: "#222",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        titleFont: { weight: "bold" },
        bodyFont: { weight: "normal" },
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      y: {
        min: 70,
        max: 95,
        title: {
          display: true,
          text: "Average Score (%)",
        },
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          stepSize: 7,
        },
      },
      x: {
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-4" style={{ height: "350px" }}>
      <Line data={data} options={options} height={350} />
    </div>
  );
};

export default PerfGraph;