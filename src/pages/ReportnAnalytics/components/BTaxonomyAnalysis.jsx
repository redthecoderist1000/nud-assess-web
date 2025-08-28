
import React from "react";

const defaultBloomData = [
  { level: "Remembering", questions: 25, percent: "31.25%" },
  { level: "Understanding", questions: 20, percent: "25.00%" },
  { level: "Applying", questions: 15, percent: "18.75%" },
  { level: "Analyzing", questions: 10, percent: "12.50%" },
  { level: "Evaluating", questions: 7, percent: "8.75%" },
  { level: "Creating", questions: 3, percent: "3.75%" },
];

const BTaxonomyAnalysis = ({ data }) => {
  const bloomData = data && Array.isArray(data) ? data : defaultBloomData;
  const totalQuestions = bloomData.reduce((sum, item) => sum + item.questions, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 w-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[17px] font-semibold text-yellow-600 flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="#eab308" strokeWidth="2" fill="none"/>
            <circle cx="10" cy="10" r="2" fill="#eab308"/>
          </svg>
          Bloom's Taxonomy Analysis
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Question distribution across cognitive levels
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-[15px]">
              <th className="py-2 px-4 font-medium text-left">Bloom Level</th>
              <th className="py-2 px-4 font-medium text-center">Number of Questions</th>
              <th className="py-2 px-4 font-medium text-center">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {bloomData.map((item) => (
              <tr key={item.level} className="border-t border-gray-100 text-[15px]">
                <td className="py-2 px-4">{item.level}</td>
                <td className="py-2 px-4 text-center">{item.questions}</td>
                <td className="py-2 px-4 text-center">{item.percent}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 text-[15px] font-semibold">
              <td className="py-2 px-4">Total</td>
              <td className="py-2 px-4 text-center">{totalQuestions}</td>
              <td className="py-2 px-4 text-center">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BTaxonomyAnalysis;