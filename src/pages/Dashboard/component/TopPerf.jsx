import React, { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { CircularProgress, Stack, Typography } from "@mui/material";

const TopPerf = () => {
  const [topPerf, setTopPerf] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vw_topperformers")
      .select("*")
      .limit(10);

    if (error) {
      setLoading(false);
      return;
    }
    setTopPerf(data);
    setLoading(false);
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 w-full"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        minHeight: 400,
        maxHeight: 400,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Stack alignItems="center" justifyContent="center" flex={1}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmojiEventsRoundedIcon sx={{ color: "#757575ff" }} />
            <Typography variant="h6">Top Performers</Typography>
          </Stack>
          <Typography variant="caption" color="textSecondary">
            Students with the highest average scores
          </Typography>
          <div className="space-y-2 overflow-y-auto flex-1">
            {topPerf.length === 0 ? (
              <Stack justifyContent="center" alignItems="center" flex={1}>
                <Typography variant="body2" color="textSecondary">
                  No top performers data available.
                </Typography>
              </Stack>
            ) : (
              topPerf.map((perf, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {perf.student_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {perf.class_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-end sm:items-end mt-2 sm:mt-0">
                    <span className="font-bold text-green-700 text-lg sm:text-right">
                      {perf.average_score.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopPerf;
