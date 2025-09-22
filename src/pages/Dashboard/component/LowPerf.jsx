import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { CircularProgress, Stack, Typography } from "@mui/material";

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

function LowPerf() {
  const [missed, setMissed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vw_10missedexam")
      .select("*")
      .limit(10);

    if (error) {
      setLoading(false);
      return;
    }
    setMissed(data);
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
        <Stack justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <WarningAmberRoundedIcon sx={{ color: "#757575ff" }} />
            <Typography variant="h6">Students Needing Support</Typography>
          </div>
          <Typography variant="caption" color="textSecondary">
            Students with missed exams
          </Typography>

          <div className="space-y-3 overflow-y-auto flex-1">
            {missed.length === 0 ? (
              <Stack justifyContent="center" alignItems="center" flex={1}>
                <Typography variant="body2" color="textSecondary">
                  No students with missed exams.
                </Typography>
              </Stack>
            ) : (
              missed.map((student, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {student.student_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.class_name}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {student.missed_exam} missed exams
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
}

export default LowPerf;
