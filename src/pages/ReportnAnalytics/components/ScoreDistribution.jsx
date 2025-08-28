import React from "react";

const defaultScoreData = [
  {
    range: "90-100%",
    count: 12,
    color: "#22c55e", // green
  },
  {
    range: "80-89%",
    count: 15,
    color: "#312e81", // indigo
  },
  {
    range: "70-79%",
    count: 8,
    color: "#eab308", // yellow
  },
  {
    range: "60-69%",
    count: 4,
    color: "#f59e42", // orange
  },
  {
    range: "0-59%",
    count: 1,
    color: "#ef4444", // red
  },
];

const ScoreDistribution = ({ data, className }) => {
  const scoreData = Array.isArray(data) && data.length > 0 ? data : defaultScoreData;
  const maxCount = Math.max(...scoreData.map((d) => d.count));

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 w-full h-full ${className || ""}`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      <div className="mb-2">
        <h2 className="text-[17px] font-semibold text-gray-900 mb-0">Score Distribution</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Current class performance breakdown
        </p>
      </div>
      <div className="space-y-4 mt-4">
        {scoreData.map((item) => (
          <div key={item.range}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[15px] text-gray-700">{item.range}</span>
              <span className="text-[15px] font-semibold text-gray-900">{item.count} students</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 relative">
              <div
                className="h-2 rounded-full absolute top-0 left-0"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  background: item.color,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDistribution;