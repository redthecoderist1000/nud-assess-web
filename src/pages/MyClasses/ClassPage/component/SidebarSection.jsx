import React, { useState } from "react";
import { IconButton, Stack, Tooltip, Button } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import QuizIcon from "@mui/icons-material/Quiz";
import GroupIcon from "@mui/icons-material/Group";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";

const SidebarSection = ({ classData, people = [], quizzes = [] }) => {
  const [copyToolTip, setCopyToolTip] = useState(false);

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyToolTip(true);
        setTimeout(() => {
          setCopyToolTip(false);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className=" rounded-xl text-white flex flex-col gap-2 h-[90vh]">
      {/* Class Information */}
      <div className="bg-[#23286b] rounded-xl p-5 mb-2">
        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <span role="img" aria-label="book">
            📖
          </span>{" "}
          Class Information
        </h2>
        <p className="text-sm text-gray-300 mb-1">Description</p>
        <p className="text-base font-semibold mb-3">{classData.desc}</p>
        {classData.archived_at === null && (
          <>
            <p className="text-sm text-gray-300 mb-1">Class join code</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#23286b] px-2 py-1 rounded text-base font-mono font-semibold border border-gray-400">
                {classData.join_code}
              </span>
              <Tooltip
                open={copyToolTip}
                arrow
                placement="top"
                disableFocusListener
                title="Copied to clipboard"
              >
                <IconButton
                  size="small"
                  onClick={() => copy(classData.join_code)}
                  sx={{ color: "white" }}
                >
                  <ContentCopyRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Share this code with students
            </p>
          </>
        )}

        <div className="flex gap-6 mt-3">
          <div>
            <p className="text-xs text-gray-300">Students</p>
            <p className="text-lg font-bold">{people.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-300">Quizzes</p>
            <p className="text-lg font-bold">{quizzes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSection;
