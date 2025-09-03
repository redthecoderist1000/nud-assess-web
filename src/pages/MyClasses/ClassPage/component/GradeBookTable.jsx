import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../../../../helper/Supabase";

const GradeBookTable = ({ classId }) => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data, error } = await supabase
        .from("vw_quizzesperclass")
        .select("class_exam_id, name, total_items")
        .eq("class_id", classId);

      if (!error) setQuizzes(data || []);
    };
    fetchQuizzes();
  }, [classId]);

useEffect(() => {
  if (!classId || quizzes.length === 0) return;

  const fetchStudents = async () => {
    const { data: members, error: memberError } = await supabase
      .from("vw_membersperclass")
      .select("id, f_name, l_name, role")
      .eq("class_id", classId);

    console.log("Members:", members, "Error:", memberError);

    const { data: scores, error: scoreError } = await supabase
      .from("vw_studentlistperquiz")
      .select("name, class_exam_id, score")
      .eq("class_id", classId);

    console.log("Scores:", scores, "Error:", scoreError);

    const studentsOnly = (members || []).filter(m => m.role !== "instructor");

    const studentRows = studentsOnly.map((member) => {
      const fullName = `${member.f_name || ""} ${member.l_name || ""}`.trim();
      const grades = quizzes.map((quiz) => {
        const found = (scores || []).find(
          (s) => s.name === fullName && s.class_exam_id === quiz.class_exam_id
        );
        return found ? found.score : null;
      });
      const validScores = grades.filter((g) => typeof g === "number");
      const average =
        validScores.length > 0
          ? Math.round(
              (validScores.reduce((a, b) => a + b, 0) /
                (quizzes.length * 1)) *
                100
            ) / 100
          : null;
      const totalScore = validScores.reduce((a, b) => a + b, 0);
      const totalItems = quizzes.reduce((sum, quiz) => sum + (quiz.total_items || 0), 0);
    
      return {
        initials: fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        name: fullName,
        grades,
        average,
        total: `${totalScore}/${totalItems}`,
      };
    });

    setStudents(studentRows);
  };

  fetchStudents();
}, [classId, quizzes]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.initials.toLowerCase().includes(search.toLowerCase())
  );

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
              <th className="py-2 px-3 text-left font-semibold">Student</th>
              {quizzes.map((q, idx) => (
                <th key={idx} className="py-2 px-3 font-semibold text-left">
                  {q.name} <span className="text-xs text-gray-400">({q.total_items} pts)</span>
                </th>
              ))}
              <th className="py-2 px-3 font-semibold text-left">Average</th>
              <th className="py-2 px-3 font-semibold text-left">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-2 px-3 flex items-center gap-2">
                  <div className="bg-[#e5e7eb] text-[#23286b] rounded-full w-8 h-8 flex items-center justify-center font-semibold text-xs">
                    {s.initials}
                  </div>
                  <span>{s.name}</span>
                </td>
                {s.grades.map((g, i) => (
                  <td key={i} className="py-2 px-3 font-medium">
                    {g === null ? (
                      <span className="text-gray-400">-</span>
                    ) : (
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
                    )}
                  </td>
                ))}
                <td className="py-2 px-3 font-medium">
                  <span
                    className={
                      s.average >= 90
                        ? "text-green-700"
                        : s.average >= 80
                        ? "text-blue-700"
                        : s.average >= 70
                        ? "text-yellow-700"
                        : "text-gray-700"
                    }
                  >
                    {s.average ? `${s.average}%` : "-"}
                  </span>
                  <div className="w-full h-1 bg-gray-200 rounded mt-1">
                    <div
                      className={
                        s.average >= 90
                          ? "bg-green-400"
                          : s.average >= 80
                          ? "bg-blue-400"
                          : s.average >= 70
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                      }
                      style={{
                        width: `${s.average || 0}%`,
                        height: "100%",
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                </td>
                <td className="py-2 px-3 font-medium">{s.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeBookTable;