import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const PerfBox = ({ data, onClick }) => {
  const color =
    data.ave_score >= 90
      ? "#1ba845ff"
      : data.ave_score >= 70
        ? "#355de0ff"
        : "#ee6a96ff";

  const completion =
    ((data.result_count ?? 0) / (data.student_exam_pairs ?? 1)) * 100;

  return (
    <div
      className="rounded-lg border border-gray-200 shadow p-4 flex flex-col h-full min-w-0 w-full"
      style={{ backgroundColor: "#f9f9fa" }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          ></span>
          <span className="font-semibold text-gray-900 text-sm truncate">
            {data.class_name}
          </span>
        </div>
        <Tooltip title="Go to Class" placement="top" arrow>
          <IconButton onClick={onClick} size="small" color="inherit">
            <ChevronRightRoundedIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="text-xs text-gray-500 mb-2 truncate">
        {data.student_count} students &bull; Join code: {data.join_code}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div className="text-xs text-gray-500">Avg Score</div>
          <div className="font-bold text-lg">
            {data.average_score?.toFixed(2) ?? 0}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Completion</div>
          <div className="font-bold text-lg">{completion.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Total Exams</div>
          <div className="font-bold text-lg">{data.exam_count ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Open Exams</div>
          <div className="font-bold text-lg">{data.active_exams ?? 0}</div>
        </div>
      </div>
      <div className="mt-2">
        {/* <span
          className={`inline-block px-3 py-1 text-xs rounded font-medium ${statusColor}`}
        >
          {data.status}
        </span> */}
      </div>
    </div>
  );
};

export default PerfBox;
