import React from "react";

const defaultQuestionTypes = [
  {
    type: "Multiple Choice",
    questions: 45,
    successRate: 84,
    avgTime: "47s",
    disc: 0.56,
  },
  {
    type: "Essay",
    questions: 12,
    successRate: 60,
    avgTime: "210s",
    disc: 0.75,
  },
  {
    type: "True/False",
    questions: 18,
    successRate: 78,
    avgTime: "28s",
    disc: 0.62,
  },
];

const Question = ({ data }) => {
  const questionTypes = Array.isArray(data) && data.length > 0 ? data : defaultQuestionTypes;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 w-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[17px] font-semibold text-[#26348b] flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M3 17V7M8 17V3M13 17V11M18 17V9" stroke="#26348b" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Performance by Question Type
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        How different question formats perform across your assessments
      </p>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {questionTypes.map((q) => (
          <div key={q.type} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-1 min-w-[220px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900 text-[16px]">{q.type}</span>
              <span className="text-xs bg-white border border-gray-300 rounded px-2 py-1 font-medium">{q.questions} questions</span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-gray-700">Success Rate</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-full h-2 bg-gray-200 rounded-full relative">
                  <div
                    className="h-2 rounded-full absolute top-0 left-0"
                    style={{
                      width: `${q.successRate}%`,
                      background: "#4349a7",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-900 ml-2">{q.successRate}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 mt-2">
              <span>Avg Time: {q.avgTime}</span>
              <span>Disc {q.disc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;