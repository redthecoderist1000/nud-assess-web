import { useState, useEffect, useContext } from "react";
import { Select, MenuItem } from "@mui/material";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import CalendarViewMonthRoundedIcon from "@mui/icons-material/CalendarViewMonthRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { getReportHTML } from "../Download/DLReport";
import { downloadFullCSV } from "../Download/CSVReport";
import { downloadWordReport } from "../Download/WordReport";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
const summaryData = {
  students: 40,
  quizzes: 10,
  avgScore: "85%",
  avgScoreChange: "+3%",
  passRate: "90%",
};
const quizData = [
  {
    quiz: "Quiz 1",
    avg: "85%",
    high: "98%",
    low: "72%",
    pass: "92%",
    attempts: 40,
  },
  {
    quiz: "Quiz 2",
    avg: "78%",
    high: "95%",
    low: "65%",
    pass: "85%",
    attempts: 38,
  },
  {
    quiz: "Quiz 3",
    avg: "82%",
    high: "100%",
    low: "68%",
    pass: "88%",
    attempts: 39,
  },
];
const scoreDist = [
  { range: "90-100%", count: 12 },
  { range: "80-89%", count: 15 },
  { range: "70-79%", count: 8 },
  { range: "60-69%", count: 4 },
  { range: "0-59%", count: 1 },
];
const lessonPerf = [
  { lesson: "Lesson 1", score: 78 },
  { lesson: "Lesson 2", score: 82 },
  { lesson: "Lesson 3", score: 85 },
  { lesson: "Lesson 4", score: 80 },
  { lesson: "Lesson 5", score: 88 },
  { lesson: "Lesson 6", score: 91 },
];
const questionTypes = [
  {
    type: "Multiple Choice",
    questions: 45,
    successRate: "84%",
    avgTime: "47s",
    disc: 0.56,
  },
  {
    type: "Essay",
    questions: 12,
    successRate: "60%",
    avgTime: "210s",
    disc: 0.75,
  },
  {
    type: "True/False",
    questions: 18,
    successRate: "78%",
    avgTime: "28s",
    disc: 0.62,
  },
];
const questionAnalysis = [
  {
    question: "What is cryptography?",
    type: "Multiple Choice",
    bloom: "Remembering",
    successRate: "85%",
    usage: "8x",
    lastUsed: "2/20/2024",
    status: "Good",
  },
  {
    question: "Explain SQL injection attacks and their prevention methods",
    type: "Essay",
    bloom: "Analyzing",
    successRate: "68%",
    usage: "6x",
    lastUsed: "2/18/2024",
    status: "Good",
  },
  {
    question: "Define HTTPS protocol",
    type: "Multiple Choice",
    bloom: "Understanding",
    successRate: "75%",
    usage: "12x",
    lastUsed: "2/22/2024",
    status: "Good",
  },
  {
    question: "Which of the following is NOT a symmetric encryption algorithm?",
    type: "Multiple Choice",
    bloom: "Remembering",
    successRate: "92%",
    usage: "5x",
    lastUsed: "2/25/2024",
    status: "Too Easy",
  },
  {
    question: "Analyze the security vulnerabilities in the given code snippet.",
    type: "Essay",
    bloom: "Evaluating",
    successRate: "52%",
    usage: "3x",
    lastUsed: "2/23/2024",
    status: "Good",
  },
  {
    question:
      "True or False: Two-factor authentication eliminates all security risks.",
    type: "True/False",
    bloom: "Understanding",
    successRate: "78%",
    usage: "9x",
    lastUsed: "2/21/2024",
    status: "Good",
  },
];
const tosPlacement = [
  { level: "Remember", score: 85 },
  { level: "Understand", score: 78 },
  { level: "Apply/Placement", score: 92 },
  { level: "Analyze", score: 88 },
  { level: "Evaluate", score: 74 },
];
const taxonomyAnalysis = [
  { level: "Remembering", count: 25, percent: "31.25%" },
  { level: "Understanding", count: 20, percent: "25.00%" },
  { level: "Applying", count: 15, percent: "18.75%" },
  { level: "Analyzing", count: 10, percent: "12.50%" },
  { level: "Evaluating", count: 7, percent: "8.75%" },
  { level: "Creating", count: 3, percent: "3.75%" },
];

const FilterAnalytics = ({ filter, setFilter, hasResult }) => {
  const { setSnackbar } = useContext(userContext);
  const [classOption, setClassOption] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const { data: authData, error } = await supabase.auth.getUser();
    const user_id = authData?.user?.id;
    const { data: classOptionData, error: classErr } = await supabase
      .from("tbl_class")
      .select("*")
      .eq("created_by", user_id);
    if (classErr) {
      setSnackbar({
        open: true,
        message: "Error fetching class options.",
        severity: "error",
      });
      return;
    }
    setClassOption(classOptionData);
    if (classOptionData.length > 0) {
      setFilter({ ...filter, class_id: classOptionData[0].id });
    } else {
      setFilter({ ...filter, class_id: "" });
      // console.log("test no options");
    }
  };

  // csv handler
  const handleCSVDownload = () => {
    downloadFullCSV({
      summaryData,
      quizData,
      scoreDist,
      lessonPerf,
      questionTypes,
      questionAnalysis,
      tosPlacement,
      taxonomyAnalysis,
      filename: "class_report.csv",
    });
  };

  // word handler
  const handleWordDownload = () => {
    downloadWordReport({
      summaryData,
      quizData,
      scoreDist,
      lessonPerf,
      questionTypes,
      questionAnalysis,
      tosPlacement,
      taxonomyAnalysis,
      filename: "class_report.doc",
    });
  };

  // pdf handler
  function openQuickSummaryPDF() {
    const html = getReportHTML({
      summaryData,
      quizData,
      scoreDist,
      lessonPerf,
      questionTypes,
      questionAnalysis,
      tosPlacement,
      taxonomyAnalysis,
    });
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div
      className="flex flex-wrap items-center w-full justify-between mt-4"
      style={{ minHeight: 32, paddingTop: 8 }}
    >
      <span className="text-[14px] text-gray-600 ml-2 mb-2 sm:mb-0">
        Monitor quiz performance and student engagement
      </span>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filter.class_id || ""}
          onChange={(e) => setFilter({ ...filter, class_id: e.target.value })}
          size="small"
          className="bg-gray-100 rounded-md"
          variant="outlined"
          style={{
            minWidth: 110,
            height: 36,
            fontSize: 14,
            marginLeft: 4,
            marginRight: 4,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          {classOption.map((data, index) => (
            <MenuItem key={index} value={data.id}>
              {data.class_name}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={filter.start_time}
          onChange={(e) => setFilter({ ...filter, start_time: e.target.value })}
          size="small"
          className="bg-gray-100 rounded-md"
          variant="outlined"
          style={{
            minWidth: 110,
            height: 36,
            fontSize: 14,
            marginLeft: 4,
            marginRight: 4,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="7">last 7 days</MenuItem>
          <MenuItem value="30">last 30 days</MenuItem>
        </Select>

        {!hasResult && (
          <Select
            className="bg-gray-100 rounded-md"
            labelId="export_label"
            size="small"
            sx={{
              height: 36,
              fontSize: 14,
            }}
            displayEmpty
            value=""
          >
            <MenuItem value="" disabled>
              Export as
            </MenuItem>
            <MenuItem
              onClick={handleCSVDownload}
              value="csv"
              sx={{ justifyContent: "center", gap: 1 }}
            >
              <CalendarViewMonthRoundedIcon
                style={{ fontSize: 16 }}
                color="success"
              />
              .csv
            </MenuItem>
            <MenuItem
              onClick={handleWordDownload}
              value="docx"
              sx={{ justifyContent: "center", gap: 1 }}
            >
              <InsertDriveFileRoundedIcon
                style={{ fontSize: 16 }}
                color="primary"
              />
              .docx
            </MenuItem>
            <MenuItem
              onClick={openQuickSummaryPDF}
              value="pdf"
              sx={{ justifyContent: "center", gap: 1 }}
            >
              <PictureAsPdfRoundedIcon style={{ fontSize: 16 }} color="error" />
              .pdf
            </MenuItem>
          </Select>
        )}
      </div>
    </div>
  );
};

export default FilterAnalytics;
