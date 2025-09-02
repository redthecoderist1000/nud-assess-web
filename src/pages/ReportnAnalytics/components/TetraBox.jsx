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
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          style={{ marginRight: 2 }}
        >
          <path
            d="M5 10l4 4 6-8"
            stroke="#16a34a"
            strokeWidth="2"
            fill="none"
          />
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

const TetraBox = ({ data, generalData }) => {
  const boxes = Array.isArray(data) && data.length > 0 ? data : defaultBoxes;

  //  {
  //     member_count: 2,
  //     exam_count: 8,
  //     ave_acore: 25.76,
  //     passing_rate: 9.09
  //   }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">
      {/* member_count */}
      <div
        className="bg-white rounded-xl border border-gray-200  px-6 py-5 shadow-sm flex flex-col justify-between w-full"
        style={{
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-medium text-gray-700">
            Number of Students
          </span>
          <PeopleAltOutlinedIcon style={{ fontSize: 22, color: "#888" }} />
        </div>
        <div className="text-[32px] font-bold text-black leading-none mb-1">
          {generalData.member_count}
        </div>
      </div>
      {/* exam_count */}
      <div
        className="bg-white rounded-xl border border-gray-200  px-6 py-5 shadow-sm flex flex-col justify-between w-full"
        style={{
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-medium text-gray-700">
            Number of Quizzes
          </span>
          <DescriptionOutlinedIcon style={{ fontSize: 22, color: "#888" }} />
        </div>
        <div className="text-[32px] font-bold text-black leading-none mb-1">
          {generalData.exam_count}
        </div>
      </div>
      {/* ave_score */}
      <div
        className="bg-white rounded-xl border border-gray-200  px-6 py-5 shadow-sm flex flex-col justify-between w-full"
        style={{
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-medium text-gray-700">
            Average Class Score
          </span>
          <TrackChangesOutlinedIcon style={{ fontSize: 22, color: "#888" }} />
        </div>
        <div className="text-[32px] font-bold text-black leading-none mb-1">
          {generalData.ave_score} %
        </div>
      </div>
      {/* passing_rate */}
      <div
        className="bg-white rounded-xl border border-gray-200  px-6 py-5 shadow-sm flex flex-col justify-between w-full"
        style={{
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-medium text-gray-700">
            Passing Rate
          </span>
          <EmojiEventsOutlinedIcon style={{ fontSize: 22, color: "#888" }} />
        </div>
        <div className="text-[32px] font-bold text-black leading-none mb-1">
          {generalData.passing_rate} %
        </div>
      </div>
    </div>
  );
};

export default TetraBox;
