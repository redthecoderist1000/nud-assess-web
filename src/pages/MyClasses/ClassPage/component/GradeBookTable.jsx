import React, { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../../../../helper/Supabase";
import { Avatar, LinearProgress, Typography } from "@mui/material";

const GradeBookTable = ({ classId, setSnackbar, setAllowExport }) => {
  const [search, setSearch] = useState("");
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setAllowExport(false);
      return;
    }
    setAllowExport(true);
    setHeaders((prev) => [...data.gradebook.map((g) => g.exam_name)]);

    const studentsMap = new Map();
    data.gradebook.forEach((exam, examIndex) => {
      exam.student_scores.forEach((student) => {
        const key = student.student_id;
        if (!studentsMap.has(key)) {
          studentsMap.set(key, {
            f_name: student.f_name,
            l_name: student.l_name,
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
    console.log(Array.from(studentsMap.values()));

    setLoading(false);
  };

  var filteredBody = useMemo(
    () =>
      body.filter(
        (student) =>
          student.f_name.toLowerCase().includes(search.toLowerCase()) ||
          student.l_name.toLowerCase().includes(search.toLowerCase())
      ),
    [body, search]
  );

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
        <div className="relative">
          <input
            type="text"
            className="bg-[#f4f5f7] rounded-md pl-9 pr-3 py-2 text-sm border-none outline-none w-56"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              color: "#bdbdbd",
              fontSize: 20,
            }}
          />
        </div>
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
                  <span>
                    {s.f_name} {s.l_name}
                  </span>
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
