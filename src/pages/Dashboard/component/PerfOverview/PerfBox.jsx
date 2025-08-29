import React from "react";

const PerfBox = ({ classData }) => {
  const {
    color = "#d1d5db", 
    name = "Class Name",
    students = 0,
    joinCode = "N/A",
    avgScore = 0,
    completion = 0,
    totalExams = 0,
    activeExams = 0,
    status = "Status",
    trend = "up", 
  } = classData || {};

  const statusColor =
    status === "Excellent"
      ? "bg-green-100 text-green-700"
      : status === "Good"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

return (
    <div className="rounded-lg border border-gray-200 shadow p-4 flex flex-col h-full min-w-0 w-full" style={{ backgroundColor: "#f9f9fa" }}>
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
                <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                ></span>
                <span className="font-semibold text-gray-900 text-sm truncate">
                    {name}
                </span>
            </div>
            <span className={trend === "up" ? "text-green-500" : "text-blue-500"}>
                {trend === "up" ? (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M4 17l6-6 5 5 5-9"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M20 7l-6 6-5-5-5 9"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>
        </div>
        <div className="text-xs text-gray-500 mb-2 truncate">
            {students} students &bull; Join: {joinCode}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
                <div className="text-xs text-gray-500">Avg Score</div>
                <div className="font-bold text-lg">{avgScore}%</div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Completion</div>
                <div className="font-bold text-lg">{completion}%</div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Total Exams</div>
                <div className="font-bold text-lg">{totalExams}</div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Active</div>
                <div className="font-bold text-lg">{activeExams}</div>
            </div>
        </div>
        <div className="mt-2">
            <span className={`inline-block px-3 py-1 text-xs rounded font-medium ${statusColor}`}>
                {status}
            </span>
        </div>
    </div>
);
};

export default PerfBox;