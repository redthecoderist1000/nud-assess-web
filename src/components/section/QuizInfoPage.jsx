import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";
import Header from "../../assets/images/header.png";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Button, Stack } from "@mui/material";

function QuizInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exam_id } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examName, setExamName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!exam_id) {
        setError("Missing exam ID");
        setLoading(false);
        return;
      }

      try {
        // 1. Exam name
        const { data: examDetails } = await supabase
          .from("tbl_exam")
          .select("name")
          .eq("id", exam_id)
          .single();
        setExamName(examDetails?.name || "Quiz");

        // 2. class_ids
        const { data: classExamData } = await supabase
          .from("tbl_class_exam")
          .select("class_id")
          .eq("exam_id", exam_id);
        const classIds = classExamData?.map((e) => e.class_id) || [];

        // 3. student_ids
        const { data: classMembers } = await supabase
          .from("tbl_class_members")
          .select("student_id")
          .in("class_id", classIds);
        const studentIds = [...new Set(classMembers.map((m) => m.student_id))];

        // 4. user info
        const { data: users } = await supabase
          .from("tbl_users")
          .select("id, f_name, l_name")
          .in("id", studentIds);

        // 5. results
        const { data: results } = await supabase
          .from("tbl_result")
          .select("student_id, correct_items, total_items")
          .eq("exam_id", exam_id)
          .in("student_id", studentIds);

        const studentData = users.map((user) => {
          const result = results.find((r) => r.student_id === user.id);
          const submitted = !!result;
          const correct = result?.correct_items || 0;
          const total = result?.total_items || 0;
          const percentage = total ? Math.round((correct / total) * 100) : 0;

          return {
            id: user.id,
            name: `${user.f_name} ${user.l_name}`,
            submitted,
            displayScore: submitted ? `${correct} / ${total}` : "N/A",
            percentage,
          };
        });

        setStudents(studentData);
      } catch (err) {
        setError("Failed to load quiz data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [exam_id]);

  const submittedCount = students.filter((s) => s.submitted).length;
  const notSubmittedCount = students.length - submittedCount;

  return (
    <div className="font-sans">
      {/* Header */}
      <div
        className="w-full h-20 p-6 relative h-60 flex justify-between items-center"
        style={{
          background: "linear-gradient(to right, #1E3A8A, #000000)",
        }}
      >
        <Stack justifyContent="start" alignItems="self-start">
          <Button
            sx={{ color: "white", textTransform: "lowercase" }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" /> return{""}
          </Button>
          <h1 className="text-7xl font-bold mt-30 text-white">
            {examName}
          </h1>
        </Stack>
        <img
          src={Header}
          alt="Header"
          className="h-60 object-contain ml-4 mt-5"
        />
      </div>

      {/* Content */}
      <div className="p-8 bg-[#f5f7fb] min-h-screen">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className=" p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Students</p>
            <h2 className="text-2xl font-semibold text-gray-800">{students.length}</h2>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Turned In</p>
            <h2 className="text-2xl font-semibold text-green-600">{submittedCount}</h2>
          </div>
          <div className="bg-red-50 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Not Turned In</p>
            <h2 className="text-2xl font-semibold text-red-500">{notSubmittedCount}</h2>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Average Score</p>
            <h2 className="text-2xl font-semibold text-indigo-600">
              {submittedCount > 0
                ? `${Math.round(
                    students.reduce((acc, s) => acc + (s.submitted ? s.percentage : 0), 0) /
                      submittedCount
                  )}%`
                : "N/A"}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                    <td className="py-3 px-4">
                      {s.submitted ? (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                          Turned In
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs font-semibold">
                          Not Turned In
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{s.displayScore}</td>
                    <td className="py-3 px-4 text-gray-700">{s.submitted ? `${s.percentage}%` : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizInfoPage;