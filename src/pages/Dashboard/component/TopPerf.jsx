import React from "react";

const TopPerf = ({ data }) => {
  const performers =
    data ||
    [
      { name: "Sarah Chen", class: "INF221", rank: 1, score: 96.2, completion: 100, trend: "up" },
      { name: "Marcus Johnson", class: "INF222", rank: 2, score: 94.8, completion: 100, trend: "down" },
      { name: "Elena Rodriguez", class: "INF223", rank: 3, score: 93.5, completion: 95, trend: "up" },
      { name: "David Kim", class: "INF224", rank: 4, score: 92.1, completion: 100, trend: "up" },
      { name: "Amanda Wu", class: "INF225", rank: 5, score: 91.7, completion: 100, trend: "down" },
    ];

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 w-full"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)", minHeight: 400, maxHeight: 400, display: "flex", flexDirection: "column" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 21h8M12 17v4M5 5h14v2a7 7 0 01-14 0V5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-medium text-base text-gray-900">Top Performers</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Highest achieving students across all classes (from tbl_result analysis)
      </p>
      <div className="space-y-2 overflow-y-auto flex-1">
        {performers.map((perf) => (
          <div
            key={perf.rank}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-white font-bold text-sm">
                {perf.rank}
              </span>
              <div>
                <div className="font-semibold text-gray-900">{perf.name}</div>
                <div className="text-xs text-gray-500">{perf.class}</div>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-end sm:items-end mt-2 sm:mt-0">
              <span className="font-bold text-green-700 text-lg sm:text-right">{perf.score}%</span>
              <span className="text-xs text-green-700 flex items-center gap-1 sm:justify-end ml-2 sm:ml-0">
                {perf.trend === "up" ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                    <path d="M8 12V4M8 4l-4 4M8 4l4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                    <path d="M8 4v8M8 12l-4-4M8 12l4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {perf.completion}% completion
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerf;