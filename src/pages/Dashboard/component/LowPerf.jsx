import React from "react";

const sampleData = [
  {
    name: "Alex Thompson",
    class: "CS301",
    missed: 2,
    score: 68.2,
    completion: 75,
  },
  {
    name: "Jordan Lee",
    class: "MATH201",
    missed: 1,
    score: 71.5,
    completion: 80,
  },
  {
    name: "Taylor Brown",
    class: "CS401",
    missed: 1,
    score: 69.8,
    completion: 85,
  },
];

function LowPerf({ data }) {
  const students = data || sampleData;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 w-full"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)", minHeight: 400, maxHeight: 400, display: "flex", flexDirection: "column" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v4M12 17h.01M4.93 19h14.14a2 2 0 0 0 1.74-2.82l-7.07-12.26a2 2 0 0 0-3.48 0L3.19 16.18A2 2 0 0 0 4.93 19z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-medium text-base text-gray-900">Students Needing Support</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Students with declining performance or missed assignments (from tbl_result trends)
      </p>
      <div className="space-y-3 overflow-y-auto flex-1">
        {students.map((student, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">{student.name}</div>
              <div className="text-xs text-gray-500">{student.class}</div>
              <div className="flex gap-2 mt-2">
                <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {student.missed} missed exams
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end mt-2 sm:mt-0">
              <span className="font-bold text-orange-700 text-lg">{student.score}%</span>
              <span className="text-xs text-orange-700 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                  <path d="M8 4v8M8 12l-4-4M8 12l4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {student.completion}% completion
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LowPerf;