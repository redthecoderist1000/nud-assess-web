import React from "react";

const statConfig = [
  {
    key: "totalExams",
    label: "Total Exams",
    borderStyle: { borderLeft: "4px solid #2C388F" },
    valueClass: "text-[#2C388F]",
    icon: (
      <span className="inline-flex items-center justify-center bg-[#e7eafc] rounded-full w-8 h-8">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#4854a3" strokeWidth="2" />
          <path d="M8 10h8M8 14h5" stroke="#4854a3" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    ),
    sub: (data) => (
      <span className="flex items-center gap-1 text-xs text-[#2C388F] mt-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
          <path d="M8 12V4M8 4l-4 4M8 4l4 4" stroke="#2C388F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {data?.examsChange ? `+${data.examsChange} from last month` : ""}
      </span>
    ),
  },
  {
    key: "activeExams",
    label: "Active Exams",
    borderStyle: { borderLeft: "4px solid #1ecb7b" },
    valueClass: "text-[#1ecb7b]",
    icon: (
      <span className="inline-flex items-center justify-center bg-[#eafcf3] rounded-full w-8 h-8">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" stroke="#1ecb7b" strokeWidth="2" />
          <path d="M12 8v4l3 2" stroke="#1ecb7b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    ),
    sub: () => <span className="text-xs text-[#1ecb7b] mt-1">Currently available</span>,
  },
  {
    key: "totalStudents",
    label: "Total Students",
    borderStyle: { borderLeft: "4px solid #3887fe" },
    valueClass: "text-[#3887fe]",
    icon: (
      <span className="inline-flex items-center justify-center bg-[#eaf4fe] rounded-full w-8 h-8">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke="#3887fe" strokeWidth="2" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="#3887fe" strokeWidth="2" />
        </svg>
      </span>
    ),
    sub: () => <span className="text-xs text-[#3887fe] mt-1">Student submissions</span>,
  },
  {
    key: "avgScore",
    label: "Avg Score",
    borderStyle: { borderLeft: "4px solid #ff7a2f" },
    valueClass: "text-[#ff7a2f]",
    icon: (
      <span className="inline-flex items-center justify-center bg-[#fff4ec] rounded-full w-8 h-8">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" stroke="#ff7a2f" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" stroke="#ff7a2f" strokeWidth="2" />
          <path d="M12 8v4l2 2" stroke="#ff7a2f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    ),
    sub: () => <span className="text-xs text-[#ff7a2f] mt-1">Across all exams</span>,
  },
];

const TetraBox = ({ statsData }) => {
  const fallback = {
    totalExams: 0,
    examsChange: 0,
    activeExams: 0,
    totalStudents: 0,
    avgScore: "0%",
  };
  const data = statsData || fallback;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statConfig.map((stat) => (
        <div
          key={stat.key}
          style={stat.borderStyle}
          className={`bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 flex flex-col justify-between min-h-[120px]`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">{stat.label}</span>
            {stat.icon}
          </div>
          <div className="mt-2">
            <span className={`font-bold text-2xl ${stat.valueClass}`}>
              {data[stat.key]}
            </span>
            <div>{typeof stat.sub === "function" ? stat.sub(data) : stat.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TetraBox;