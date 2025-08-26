import React from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

const defaultBoxes = [
  {
    title: "Number of Students",
    icon: <PeopleAltOutlinedIcon style={{ fontSize: 22, color: "#888" }} />,
    value: "40",
    subtitle: "Active in BSIT 3A",
  },
  {
    title: "Number of Quizzes",
    icon: <DescriptionOutlinedIcon style={{ fontSize: 22, color: "#888" }} />,
    value: "10",
    subtitle: "Completed assessments",
  },
  {
    title: "Average Class Score",
    icon: <TrackChangesOutlinedIcon style={{ fontSize: 22, color: "#888" }} />,
    value: "85%",
    subtitle: (
      <span className="flex items-center text-green-600 text-[13px] font-medium">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ marginRight: 2 }}>
          <path d="M5 10l4 4 6-8" stroke="#16a34a" strokeWidth="2" fill="none" />
        </svg>
        +3% from last month
      </span>
    ),
  },
  {
    title: "Pass Rate",
    icon: <EmojiEventsOutlinedIcon style={{ fontSize: 22, color: "#888" }} />,
    value: "90%",
    subtitle: (
      <span className="text-gray-500 text-[13px]">
        Students passing (<span className="font-medium">&ge;70%</span>)
      </span>
    ),
  },
];

const TetraBox = ({ data }) => {
  const boxes = Array.isArray(data) && data.length > 0 ? data : defaultBoxes;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">
      {boxes.map((box) => (
        <div
          key={box.title}
          className="bg-white rounded-xl border border-gray-200 h-[140px] px-6 py-5 shadow-sm flex flex-col justify-between w-full"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[15px] font-medium text-gray-700">{box.title}</span>
            {box.icon}
          </div>
          <div className="text-[32px] font-bold text-black leading-none mb-1">{box.value}</div>
          <div className="text-[13px] text-gray-500">{box.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

export default TetraBox;