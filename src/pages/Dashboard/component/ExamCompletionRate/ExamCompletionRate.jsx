import React from "react";
import CompRateGraph from "./CompRateGraph";
import CompBox from "./CompBox";

const ExamCompletionRate = ({ graphData, boxData }) => {
  return (
    <div className=" p-5 w-full mt-8" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span>
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-medium text-base text-gray-900">
          Exam Completion Rate
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1 mb-4">
        Monthly completion trends across all classes
      </p>
      <CompRateGraph data={graphData} />
      <div className="mt-4">
        <CompBox data={boxData} />
      </div>
    </div>
  );
};

export default ExamCompletionRate;