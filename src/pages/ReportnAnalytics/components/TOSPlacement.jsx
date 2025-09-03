import { Typography } from "@mui/material";
import React from "react";

const bloomLevels = [
  {
    label: "Remembering",
    color: "#16a34a",
    bg: "#e6f4ea",
    dot: "#16a34a",
  },
  {
    label: "Understanding",
    color: "#2563eb",
    bg: "#e6ecfa",
    dot: "#2563eb",
  },
  {
    label: "Applying",
    color: "#eab308",
    bg: "#fdf6e3",
    dot: "#eab308",
  },
  {
    label: "Analyzing",
    color: "#ef4444",
    bg: "#fdeaea",
    dot: "#ef4444",
  },
  {
    label: "Evaluating",
    color: "#a855f7",
    bg: "#f5e8fd",
    dot: "#a855f7",
  },
  {
    label: "Creating",
    color: "#ec4899",
    bg: "#fde6f3",
    dot: "#ec4899",
  },
];

const TOSPlacement = ({ perf_by_bloom }) => {
  var data = [];
  if (perf_by_bloom != null) {
    data = bloomLevels.map((level) => {
      const record = perf_by_bloom.find(
        (it) => it.cognitive_level === level.label
      );
      return {
        ...level,
        questions: record ? record.question_count : 0,
        percent: record ? Math.round(record.ave_score) : 0,
      };
    });
  }
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 w-full"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      {perf_by_bloom == null ? (
        <Typography>no record yet</Typography>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[17px] font-semibold text-[#26348b] flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  d="M3 17V7M8 17V3M13 17V11M18 17V9"
                  stroke="#26348b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Performance by Bloom's Taxonomy Level
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Student performance across different cognitive complexity levels
          </p>
          <div className="flex flex-col gap-5">
            {data.map((level, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    style={{
                      background: level.bg,
                      color: level.color,
                      fontWeight: 600,
                      borderRadius: 6,
                      padding: "2px 10px",
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: level.dot,
                        marginRight: 6,
                      }}
                    />
                    {level.label}
                  </span>
                  <span
                    style={{
                      background: "#fde047",
                      color: "#92400e",
                      fontWeight: 500,
                      borderRadius: 5,
                      fontSize: 13,
                      padding: "2px 8px",
                      marginLeft: 8,
                    }}
                  >
                    {level.questions} questions
                  </span>
                  <span
                    className="ml-auto font-semibold text-gray-700"
                    style={{ fontSize: 16 }}
                  >
                    {level.percent}%
                  </span>
                </div>
                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: 8,
                    height: 10,
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#26348b",
                      height: "100%",
                      width: `${level.percent}%`,
                      borderRadius: 8,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TOSPlacement;
