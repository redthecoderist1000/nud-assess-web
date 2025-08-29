import React from "react";

const DashboardLead = ({
  userName = "Dr. Sarah Smith",
  activeExams = 8,
  newSubmissions = 162,
  classCount = 5,
  stats = [
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
          <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" />
        </svg>
      ),
      value: "280",
      label: "Total Exams",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <path d="M12 16v-4" stroke="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
      value: "4,373",
      label: "Questions",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-8 0v2" stroke="currentColor" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" />
          <path d="M5.5 17a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" />
          <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" />
        </svg>
      ),
      value: "162",
      label: "Students",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
          <path d="M7 17v-6M12 17v-2M17 17v-8" stroke="currentColor" />
        </svg>
      ),
      value: "87.2%",
      label: "Avg Score",
    },
  ],
  onCreateQuiz,
  onCreateQuestions,
  onCreateClass,
}) => {
  return (
    <div className="rounded-2xl bg-[#4957a3] p-6 md:p-8 pb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-[#6b7bd6] rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#6b7bd6] rounded-full opacity-30 translate-x-1/2 -translate-y-1/2"></div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back, {userName}!
          </h2>
          <p className="text-white text-base mb-4">
            You have {activeExams} active exams and {newSubmissions} new student submissions to review across {classCount} classes.
          </p>
        </div>
        <div className="flex gap-2 md:gap-3 mb-4 md:mb-0">
          <button
            className="flex items-center gap-2 bg-[#3d478c] text-white px-3 py-2 md:px-4 rounded-lg font-medium text-sm hover:bg-[#2e3566] transition"
            onClick={onCreateQuiz}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" />
              <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
              <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" />
            </svg>
            Create Quiz
          </button>
          <button
            className="flex items-center gap-2 bg-[#3d478c] text-white px-3 py-2 md:px-4 rounded-lg font-medium text-sm hover:bg-[#2e3566] transition"
            onClick={onCreateQuestions}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" />
              <path d="M12 16v-4" stroke="currentColor" />
              <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
            Create Questions
          </button>
          <button
            className="flex items-center gap-2 bg-[#3d478c] text-white px-3 py-2 md:px-4 rounded-lg font-medium text-sm hover:bg-[#2e3566] transition"
            onClick={onCreateClass}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-8 0v2" stroke="currentColor" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" />
              <path d="M5.5 17a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" />
              <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" />
            </svg>
            Create Class
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-[#6b7bd6] bg-opacity-40 rounded-xl px-6 py-4 flex-1 min-w-[160px]"
          >
            {stat.icon}
            <div>
              <div className="text-2xl font-bold text-white leading-tight">{stat.value}</div>
              <div className="text-white text-sm opacity-80">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLead;