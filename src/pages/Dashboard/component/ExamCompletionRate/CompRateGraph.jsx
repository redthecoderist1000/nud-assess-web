import React from "react";

const CompRateGraph = ({ data }) => {

  const chartData =
    data ||
    [
      { month: "Jan", rate: 93.2 },
      { month: "Feb", rate: 93.4 },
      { month: "Mar", rate: 92.8 },
      { month: "Apr", rate: 93.5 },
      { month: "May", rate: 96.4 },
      { month: "Jun", rate: 96.7 },
    ];

  const minY = 85;
  const maxY = 100;
  const graphHeight = 260;
  const graphWidth = 600;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  const usableWidth = graphWidth - paddingLeft - paddingRight;
  const usableHeight = graphHeight - paddingTop - paddingBottom;

  const points = chartData.map((d, i) => {
    const x =
      paddingLeft +
      (i * usableWidth) / (chartData.length - 1);
    const y =
      paddingTop +
      ((maxY - d.rate) / (maxY - minY)) * usableHeight;
    return { x, y, label: d.month, rate: d.rate };
  });

  const linePath = points
    .map((pt, i) =>
      i === 0 ? `M${pt.x},${pt.y}` : `L${pt.x},${pt.y}`
    )
    .join(" ");

  const yTicks = [100, 97, 93, 89, 85];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        width="100%"
        height={graphHeight}
        style={{ minWidth: 400, maxWidth: "100%" }}
      >
        {yTicks.map((tick, i) => {
          const y =
            paddingTop +
            ((maxY - tick) / (maxY - minY)) * usableHeight;
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={graphWidth - paddingRight}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 2"
              />
              <text
                x={paddingLeft - 10}
                y={y + 5}
                fontSize="15"
                fill="#6b7280"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}
        {points.map((pt, i) => (
          <text
            key={pt.label}
            x={pt.x}
            y={graphHeight - paddingBottom + 24}
            fontSize="15"
            fill="#6b7280"
            textAnchor="middle"
          >
            {pt.label}
          </text>
        ))}
        <path
          d={linePath}
          fill="none"
          stroke="#273e8a"
          strokeWidth="3"
        />
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={7}
            fill="#273e8a"
            stroke="#fff"
            strokeWidth="3"
          />
        ))}
      </svg>
    </div>
  );
};

export default CompRateGraph;