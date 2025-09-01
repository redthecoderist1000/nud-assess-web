import { Typography } from "@mui/material";
import React from "react";

const colors = ["#ef4444", "#f59e42", "#eab308", "#312e81", "#22c55e"];

const ScoreDistribution = ({ className, distribution }) => {
  const scoreData = distribution;
  // console.log(scoreData);
  // const maxCount = distribution.fold();
  var maxCount = 0;
  if (distribution != null) {
    maxCount = distribution.reduce((acc, initial) => acc + initial.value, 0);
  }

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 w-full h-full w-full h-full`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      {distribution == null ? (
        <Typography>no record yet</Typography>
      ) : (
        <>
          <div className="mb-2">
            <h2 className="text-[17px] font-semibold text-gray-900 mb-0">
              Score Distribution
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-0">
              Current class performance breakdown
            </p>
          </div>
          <div className="space-y-4 mt-4">
            {scoreData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[15px] text-gray-700">
                    {item.range}
                  </span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {item.value} students
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 relative">
                  <div
                    className="h-2 rounded-full absolute top-0 left-0"
                    style={{
                      width: `${(item.value / maxCount) * 100}%`,
                      background: colors[index],
                      transition: "width 0.3s",
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

export default ScoreDistribution;
