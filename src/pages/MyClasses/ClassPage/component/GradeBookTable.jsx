import React, { useState, useEffect, useMemo, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../../../../helper/Supabase";
import {
  Avatar,
  LinearProgress,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import Export from "../../../../components/elements/Export";
import GradeBook_csv from "../../../../components/printables/Gradebook_csv";
import { userContext } from "../../../../App";

const GradeBookTable = ({ classId, class_name }) => {
  const { setSnackbar } = useContext(userContext);

  const [search, setSearch] = useState("");
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    fetchGradebook();

    const resultChannel = supabase
      .channel("gradebook_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_result" },
        (payload) => {
          fetchGradebook();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(resultChannel);
    };
  }, []);

  const fetchGradebook = async () => {
    const { data, error } = await supabase
      .rpc("get_gradebook", {
        p_class_id: classId,
      })
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching gradebook. Please try again.",
        severity: "error",
      });
      return;
    }

    if (!data || data.gradebook === null) {
      setLoading(false);
      return;
    }
    setHeaders((prev) => [...data.gradebook.map((g) => g.exam_name)]);

    const studentsMap = new Map();
    data.gradebook.forEach((exam, examIndex) => {
      exam.student_scores.forEach((student) => {
        const key = student.student_id;
        if (!studentsMap.has(key)) {
          studentsMap.set(key, {
            student_name: student.student_name,
            scores: [],
          });
        }
        studentsMap.get(key).scores[examIndex] = student.ave_score;
      });
    });

    studentsMap.forEach((student) => {
      const total = student.scores.reduce((sum, score) => sum + score, 0);
      const average =
        student.scores.length > 0 ? total / student.scores.length : 0;
      student.average_score = Math.round(average * 100) / 100;
    });

    setBody(Array.from(studentsMap.values()));

    setLoading(false);
  };

  var filteredBody = useMemo(
    () =>
      body.filter((student) =>
        student.student_name.toLowerCase().includes(search.toLowerCase())
      ),
    [body, search]
  );

  const dlCsv = () => {
    GradeBook_csv(headers, body, class_name);
    setAnchorEl(null);
  };

  //

  if (loading) {
    return <LinearProgress />;
  }

  if (body.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 mt-6 p-4">
        <Typography variant="body1" color="textSecondary" align="center" p={4}>
          No grades available.
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 mt-6 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg flex items-center gap-2">
          <span>Student Grades</span>
        </div>
        <Stack direction="row" spacing={1} alignItems="center">
          <OutlinedInput
            size="small"
            placeholder="Search students..."
            value={search}
            startAdornment={
              <SearchIcon
                sx={{ color: "action.active", mr: 1, fontSize: 20 }}
              />
            }
            onChange={(e) => setSearch(e.target.value)}
          />
          <Export anchorEl={anchorEl} setAnchorEl={setAnchorEl} dlCsv={dlCsv} />
        </Stack>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 px-3 text-left font-semibold sticky left-0 bg-white z-10">
                Student
              </th>
              {/* quizzes na header */}
              {headers.map((q, idx) => (
                <th key={idx} className="py-2 px-3 font-semibold text-center">
                  {q}
                </th>
              ))}
              <th className="py-2 px-3 font-semibold text-left sticky right-0 bg-white z-10">
                Average
              </th>
            </tr>
          </thead>
          <tbody>
            {/* scores */}
            {filteredBody.map((s, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td
                  className={`py-2 px-3 flex items-center gap-2 sticky left-0 bg-white z-10`}
                >
                  <span>{s.student_name}</span>
                </td>
                {s.scores.map((g, i) => (
                  <td key={i} className="py-2 px-3 font-medium text-center">
                    <span
                      className={
                        g >= 90
                          ? "text-green-700"
                          : g >= 80
                            ? "text-blue-700"
                            : g >= 70
                              ? "text-yellow-700"
                              : "text-gray-700"
                      }
                    >
                      {g}
                    </span>
                  </td>
                ))}
                {/* average */}
                <td className="py-2 px-3 font-medium sticky right-0 bg-white z-10">
                  <span
                    className={
                      s.average_score >= 90
                        ? "text-green-700"
                        : s.average_score >= 80
                          ? "text-blue-700"
                          : s.average_score >= 70
                            ? "text-yellow-700"
                            : "text-gray-700"
                    }
                  >
                    {s.average_score ? `${s.average_score}%` : "-"}
                  </span>
                  <LinearProgress
                    variant="determinate"
                    value={s.average_score}
                    color={
                      s.average_score >= 90
                        ? "success"
                        : s.average_score >= 80
                          ? "info"
                          : s.average_score >= 70
                            ? "warning"
                            : "error"
                    }
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeBookTable;
