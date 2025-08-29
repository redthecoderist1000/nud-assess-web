import React from "react";
import PerfGraph from "./PerfGraph";
import PerfBox from "./PerfBox";

const classes = [
  {
    color: "#1e40af",
    name: "Data Structures (CS301)",
    students: 42,
    joinCode: "DS2024A",
    avgScore: 88.7,
    completion: 94.2,
    totalExams: 8,
    activeExams: 2,
    status: "Excellent",
    trend: "up",
  },
  {
    color: "#fbbf24",
    name: "Calculus III (MATH201)",
    students: 35,
    joinCode: "MATH201A",
    avgScore: 82.1,
    completion: 90.5,
    totalExams: 7,
    activeExams: 1,
    status: "Good",
    trend: "up",
  },
  {
    color: "#6366f1",
    name: "Database Systems (CS401)",
    students: 28,
    joinCode: "CS401B",
    avgScore: 93.4,
    completion: 97.8,
    totalExams: 9,
    activeExams: 3,
    status: "Excellent",
    trend: "up",
  },
];

const PerfOverview = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow p-6 w-full mt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span>
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3L2 9l10 6 10-6-10-6zm0 13v5m-7-7v2a7 7 0 0 0 14 0v-2"
                  stroke="currentColor"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-medium text-base text-gray-900">
              Performance Overview per Class
            </span>
          </div>
          <a
            href="#"
            className="text-xs text-blue-700 hover:underline mt-1 block"
          >
            Weekly average scores across all active classes
          </a>
        </div>
        <a
          href="#"
          className="flex items-center text-sm text-gray-700 hover:text-blue-700 font-medium mt-2 md:mt-0"
        >
          View All Classes
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
      <div className="w-full mt-4">
        <PerfGraph />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {classes.map((classData, idx) => (
          <PerfBox key={idx} classData={classData} />
        ))}
      </div>
    </div>
  );
};

export default PerfOverview;