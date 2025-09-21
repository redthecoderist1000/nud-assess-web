import { Line } from "react-chartjs-2";

const colors = [
  "#1e40af",
  "#f59e42",
  "#10b981",
  "#fbbf24",
  "#6366f1",
  "#ef4444",
  "#14b8a6",
  "#8b5cf6",
  "#22c55e",
  "#eab308",
  "#3b82f6",
  "#db2777",
  "#0ea5e9",
  "#a855f7",
  "#f97316",
  "#4ade80",
  "#e11d48",
  "#7c3aed",
  "#2dd4bf",
  "#f43f5e",
];

const PerfGraph = ({ perfData }) => {
  // console.log(perfData);

  const getWeekNumber = (date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((tempDate.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  const labels = [];
  const today = new Date();

  for (let i = 7; i >= 1; i--) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() + 1 - i * 7);
    const weekNum = getWeekNumber(pastDate);
    const label = `Week ${weekNum} (${pastDate.toLocaleDateString()})`;
    labels.push(label);
  }

  const finalData =
    perfData?.map((d, idx) => ({
      ...d,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length] + "80",
      pointBackgroundColor: colors[idx % colors.length],
    })) || [];

  const data = {
    labels: labels.map((d, _) => d),
    datasets: finalData.map((d, _) => ({
      label: d.class_name,
      data: [...d.scores],
      borderColor: d.borderColor,
      backgroundColor: d.backgroundColor,
      pointBackgroundColor: d.pointBackgroundColor,
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
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Average Score (%)",
        },
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          stepSize: 10,
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
    <div
      className="w-full bg-white rounded-lg shadow p-4"
      style={{ height: "350px" }}
    >
      <Line data={data} options={options} height={350} />
    </div>
  );
};

export default PerfGraph;
