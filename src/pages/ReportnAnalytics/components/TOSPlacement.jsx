import React from "react";

const bloomLevels = [
  {
    label: "Remembering",
    color: "#16a34a",
    bg: "#e6f4ea",
    questions: 25,
    percent: 88,
    dot: "#16a34a",
  },
  {
    label: "Understanding",
    color: "#2563eb",
    bg: "#e6ecfa",
    questions: 20,
    percent: 76,
    dot: "#2563eb",
  },
  {
    label: "Applying",
    color: "#eab308",
    bg: "#fdf6e3",
    questions: 15,
    percent: 69,
    dot: "#eab308",
  },
  {
    label: "Analyzing",
    color: "#ef4444",
    bg: "#fdeaea",
    questions: 10,
    percent: 65,
    dot: "#ef4444",
  },
  {
    label: "Evaluating",
    color: "#a855f7",
    bg: "#f5e8fd",
    questions: 7,
    percent: 58,
    dot: "#a855f7",
  },
  {
    label: "Creating",
    color: "#ec4899",
    bg: "#fde6f3",
    questions: 3,
    percent: 45,
    dot: "#ec4899",
  },
];

const TOSPlacement = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 w-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[17px] font-semibold text-[#26348b] flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M3 17V7M8 17V3M13 17V11M18 17V9" stroke="#26348b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Performance by Bloom's Taxonomy Level
      </span>
    </div>
    <p className="text-sm text-gray-500 mt-1 mb-4">
      Student performance across different cognitive complexity levels
    </p>
    <div className="flex flex-col gap-5">
      {bloomLevels.map((level, idx) => (
        <div key={level.label}>
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
            <span className="ml-auto font-semibold text-gray-700" style={{ fontSize: 16 }}>
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
  </div>
);

export default TOSPlacement;