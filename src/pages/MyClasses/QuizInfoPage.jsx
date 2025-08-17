import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";
import Header from "../../assets/images/header.png";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Button, Card, Container, Stack } from "@mui/material";
import ItemAnalysisQuiz from "./components/ItemAnalysisQuiz";
import LessonAnalysisQuiz from "./components/LessonAnalysisQuiz";
import StudentSummaryce from "./components/StudentSummary";
import StudentSummary from "./components/StudentSummary";

function QuizInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { class_exam_id, class_id } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examName, setExamName] = useState("");
  const [examInfo, setExamInfo] = useState({ name: "", mode: "" });
  const [totalScore, setTotalScore] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [openSummary, setOpenSummary] = useState(false);
  const [resultId, setResultId] = useState("");

  useEffect(() => {
    fetchData();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_result" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  const fetchData = async () => {
    // student list
    const { data: membersData, error: membersErr } = await supabase
      .from("vw_membersperclass")
      .select("*")
      .eq("class_id", class_id);

    const { data: resultData, error: resultErr } = await supabase
      .from("tbl_result")
      .select("*")
      .eq("class_exam_id", class_exam_id);

    let memberList = membersData.map((d, i) => {
      let has_result = false;
      let res = {};

      resultData.forEach((e) => {
        if (e.student_id == d.id) {
          has_result = true;
          res = e;
        }
      });

      if (has_result) {
        setTotalScore(totalScore + res.correct_items);
        setTotalItems(res.total_items);
        return {
          student_id: d.id,
          name: `${d.f_name} ${d.m_name} ${d.l_name}`,
          result_id: res.id,
          score: res.correct_items,
          total_items: res.total_items,
          is_answered: true,
          percentage: Math.round((res.correct_items / res.total_items) * 100),
        };
      } else {
        return {
          student_id: d.id,
          name: `${d.f_name} ${d.m_name} ${d.l_name}`,
          is_answered: false,
        };
      }
    });

    setStudents(memberList);

    const { data: examDetails } = await supabase
      .from("tbl_class_exam")
      .select("tbl_exam(name, mode)")
      .eq("id", class_exam_id)
      .single();
    setExamName(examDetails?.tbl_exam.name || "Quiz");
    setExamInfo({
      name: examDetails?.tbl_exam.name,
      mode: examDetails?.tbl_exam.mode,
    });

    setLoading(false);
  };

  const submittedCount = students.filter((s) => s.is_answered).length;
  const notSubmittedCount = students.length - submittedCount;

  const handleOpenSummary = (resId) => {
    setResultId(resId);
    setOpenSummary(true);
  };

  const handleCloseSummary = () => {
    setOpenSummary(false);
  };

  return (
    <div className="font-sans bg-[#f5f7fb] h-full">
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
            {examInfo.name}
          </h1>
        </Stack>
        <img
          src={Header}
          alt="Header"
          className="h-60 object-contain ml-4 mt-5"
        />
      </div>

      {/* Content */}
      {/* <div className="p-8 bg-[#f5f7fb] min-h-screen"> */}
      <Container maxWidth={"xl"} sx={{ py: 5 }}>
        <Stack rowGap={4}>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className=" p-4 rounded-xl shadow bg-white">
              <p className="text-sm text-gray-500">Total Students</p>
              <h2 className="text-2xl font-semibold text-gray-800">
                {students.length}
              </h2>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">Turned In</p>
              <h2 className="text-2xl font-semibold text-green-600">
                {submittedCount}
              </h2>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">Not Turned In</p>
              <h2 className="text-2xl font-semibold text-red-500">
                {notSubmittedCount}
              </h2>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">Average Score</p>
              <h2 className="text-2xl font-semibold text-indigo-600">
                {submittedCount == 0 ? "0" : totalScore / submittedCount}/
                {totalItems} --{" "}
                {submittedCount == 0
                  ? "0"
                  : (totalScore / submittedCount / totalItems) * 100}
                %
              </h2>
            </div>
          </div>

          {/* Table */}
          {/* div className="bg-white rounded-xl shadow p-4 overflow-x-auto" */}
          <Card sx={{ p: 2 }} variant="outlined">
            {loading ? (
              <p>Loadindg...</p>
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
                    <tr
                      key={i}
                      className="hover:bg-gray-50"
                      onClick={() => handleOpenSummary(s.result_id)}
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {s.name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`${s.is_answered ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"} px-2 py-1 rounded-full text-xs font-semibold`}
                        >
                          {s.is_answered ? "Turned In" : "Not Turned In"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {s.is_answered ? `${s.score} / ${s.total_items}` : ""}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {s.is_answered ? `${s.percentage} %` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {/* item analysis */}
          {examInfo.mode != "Random" && (
            <ItemAnalysisQuiz
              class_exam_id={class_exam_id}
              exam_name={examName}
            />
          )}

          {/* lesson analysis */}
          <LessonAnalysisQuiz class_exam_id={class_exam_id} />
        </Stack>
      </Container>

      {/* <Dialog
        open={openSummary}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Disagree</Button>
          <Button onClick={() => {}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog> */}

      <StudentSummary
        open={openSummary}
        close={handleCloseSummary}
        result_id={resultId}
      />
    </div>
  );
}

export default QuizInfoPage;
