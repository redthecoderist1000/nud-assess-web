import { Typography } from "@mui/material";
import React from "react";

const PerformanceByQuiz = ({ perf_by_quiz }) => {
  const quizData = perf_by_quiz;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 w-full h-full className="l"`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      {perf_by_quiz == null ? (
        <Typography>no record yet</Typography>
      ) : (
        <>
          <div className="mb-2">
            <h2 className="text-[17px] font-semibold text-gray-900 mb-0">
              Performance by Quiz
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-0">
              Detailed breakdown of quiz performance metrics
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-[15px]">
                  <th className="py-2 px-4 font-medium text-left">Quiz</th>
                  <th className="py-2 px-4 font-medium text-left">Class</th>
                  <th className="py-2 px-4 font-medium text-center">
                    Avg Score
                  </th>
                  <th className="py-2 px-4 font-medium text-center">Highest</th>
                  <th className="py-2 px-4 font-medium text-center">Lowest</th>
                  <th className="py-2 px-4 font-medium text-center">
                    Pass Rate
                  </th>
                  <th className="py-2 px-4 font-medium text-center">
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizData.map((quiz, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-100 text-[15px]"
                  >
                    <td className="py-2 px-4">{quiz.quiz_name}</td>
                    <td className="py-2 px-4">{quiz.class_name}</td>
                    <td className="py-2 px-4 text-center">
                      <span className="bg-blue-100 text-blue-700 rounded px-2 py-1 font-medium">
                        {quiz.avgScore}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">{quiz.highest}</td>
                    <td className="py-2 px-4 text-center">{quiz.lowest}</td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={` ${quiz.passRate >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} rounded px-2 py-1 font-medium`}
                      >
                        {quiz.passRate} %
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">{quiz.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceByQuiz;
