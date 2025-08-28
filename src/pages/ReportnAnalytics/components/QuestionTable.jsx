import React from "react";

const defaultQuestions = [
  {
    question: "What is cryptography?",
    sub: "Encryption Fundamentals",
    type: "Multiple Choice",
    bloom: "Remembering",
    successRate: 85,
    usage: "8x",
    lastUsed: "2/20/2024",
    status: "Good",
  },
  {
    question: "Explain SQL injection attacks and their prevention methods",
    sub: "Web Application Security",
    type: "Essay",
    bloom: "Analyzing",
    successRate: 68,
    usage: "6x",
    lastUsed: "2/18/2024",
    status: "Good",
  },
  {
    question: "Define HTTPS protocol",
    sub: "Network Security",
    type: "Multiple Choice",
    bloom: "Understanding",
    successRate: 75,
    usage: "12x",
    lastUsed: "2/22/2024",
    status: "Good",
  },
  {
    question: "Which of the following is NOT a symmetric encryption algorithm?",
    sub: "Encryption Algorithms",
    type: "Multiple Choice",
    bloom: "Remembering",
    successRate: 92,
    usage: "5x",
    lastUsed: "2/25/2024",
    status: "Too Easy",
  },
  {
    question: "Analyze the security vulnerabilities in the given code snippet.",
    sub: "Secure Coding",
    type: "Essay",
    bloom: "Evaluating",
    successRate: 52,
    usage: "3x",
    lastUsed: "2/23/2024",
    status: "Good",
  },
  {
    question: "True or False: Two-factor authentication eliminates all security risks.",
    sub: "Authentication Methods",
    type: "True/False",
    bloom: "Understanding",
    successRate: 78,
    usage: "9x",
    lastUsed: "2/21/2024",
    status: "Good",
  },
];

const typeColors = {
  "Multiple Choice": "bg-blue-100 text-blue-700",
  Essay: "bg-purple-100 text-purple-700",
  "True/False": "bg-green-100 text-green-700",
};

const bloomColors = {
  Remembering: "bg-blue-50 text-blue-700",
  Understanding: "bg-blue-50 text-blue-700",
  Analyzing: "bg-blue-50 text-blue-700",
  Evaluating: "bg-blue-50 text-blue-700",
};

const statusColors = {
  Good: "bg-green-100 text-green-700",
  "Too Easy": "bg-blue-100 text-blue-700",
};

const successColors = (rate) => {
  if (rate >= 80) return "bg-green-100 text-green-700";
  if (rate >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const QuestionTable = ({ data }) => {
  const questions = Array.isArray(data) && data.length > 0 ? data : defaultQuestions;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 w-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="border border-gray-200 rounded-lg px-4 py-2 w-full md:w-1/3 text-sm"
        />
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>All Types</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>All Levels</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>All</option>
        </select>
      </div>
      {/* Table */}
      <div>
        <h2 className="text-[17px] font-semibold text-gray-900 mb-0">Detailed Question Analysis</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Comprehensive performance metrics for individual questions
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-[15px]">
                <th className="py-2 px-4 font-medium text-left">Question</th>
                <th className="py-2 px-4 font-medium text-center">Type</th>
                <th className="py-2 px-4 font-medium text-center">Bloom's Level</th>
                <th className="py-2 px-4 font-medium text-center">Success Rate</th>
                <th className="py-2 px-4 font-medium text-center">Usage</th>
                <th className="py-2 px-4 font-medium text-center">Last Used</th>
                <th className="py-2 px-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={idx} className="border-t border-gray-100 text-[15px]">
                  <td className="py-2 px-4">
                    <div className="font-medium text-gray-900">{q.question}</div>
                    <div className="text-xs text-gray-500">{q.sub}</div>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[q.type]}`}>{q.type}</span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${bloomColors[q.bloom]}`}>{q.bloom}</span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${successColors(q.successRate)}`}>
                      {q.successRate}%
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">{q.usage}</td>
                  <td className="py-2 px-4 text-center">{q.lastUsed}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[q.status]}`}>{q.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionTable;