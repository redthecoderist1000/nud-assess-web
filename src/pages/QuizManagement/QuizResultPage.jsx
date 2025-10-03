import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";

import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import QuestionBuilder from "./components/resultPage/QuestionBuilder";
import { userContext } from "../../App";
import GenQuestionDialog from "../../components/elements/GeneralDialog";
import Export from "../../components/elements/Export";
import TOS_pdf_export from "../../components/printables/TOS_pdf";
import TOS_csv_export from "../../components/printables/TOS_csv";
import Exam_pdf from "../../components/printables/Exam_pdf";
import ExamKey_pdf from "../../components/printables/ExamKey_pdf";

const QuizResultPage = () => {
  const { setSnackbar } = useContext(userContext);
  const navigate = useNavigate();
  const {
    quizDetail = {},
    rows = [],
    total = {},
    quiz = [],
  } = JSON.parse(localStorage.getItem("quizsummary") || "{}");

  const [loading, setLoading] = useState(false);
  // State for edit mode and editable data
  const [editQDetail, setEditQDetail] = useState(false);

  const [quizDetails, setQuizDetails] = useState(quizDetail);
  const [quizResult, setQuizResult] = useState([...quiz]);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });
  const [tosExportAnchor, setTosExportAnchor] = useState(null);
  const [examExportAnchor, setExamExportAnchor] = useState(null);

  // Ref for print area
  const tosRef = useRef();

  const AIGenerated = async () => {
    // create exam
    setLoading(true);

    await supabase
      .from("tbl_exam")
      .insert({
        name: quizDetails.name,
        desc: quizDetails.desc,
        mode: "AI",
        objective: quizDetails.objective,
        repository: quizDetails.repository,
        subject_id: quizDetails.subject_id,
        total_items: total.totalItems,
        is_random: quizDetails.is_random,
        allow_review: quizDetails.allow_review,
        time_limit:
          quizDetails.time_limit == "none" ? null : quizDetails.time_limit,
      })
      .select("id")
      .single()
      .then((exres) => {
        // create tos
        rows.map(async (data) => {
          const tosres = await supabase
            .from("tbl_tos")
            .insert({ ...data, exam_id: exres.data.id })
            .select("*");
          if (tosres.error) {
            console.log("failed to make tos", tosres.error);
            setLoading(false);
            return;
          }
        });

        quiz.map(async (data, index) => {
          // if has id => nag recycle ng question
          // no need to create new question
          if (data.id) {
            await supabase
              .from("tbl_exam_question")
              .insert({
                exam_id: exres.data.id,
                question_id: data.id,
              })
              .select("*")
              .then((data) => {})
              .catch((eqerr) => {
                console.log("fail to add to exam_question", eqerr.error);
              });
          } else {
            // create questions
            await supabase
              .from("tbl_question")
              .insert({
                lesson_id: data.lesson_id,
                question: data.question,
                type: "Multiple Choice",
                blooms_category: data.specification,
                repository: quizDetails.repository,
                ai_generated: true,
              })
              .select("id")
              .single()
              .then((qures) => {
                // create exam_questions
                const addExamQuestion = async () => {
                  await supabase
                    .from("tbl_exam_question")
                    .insert({
                      exam_id: exres.data.id,
                      question_id: qures.data.id,
                    })
                    .select("*")
                    .then((data) => {})
                    .catch((eqerr) => {
                      console.log("fail to add to exam_question", eqerr.error);
                    });
                };
                addExamQuestion();
                // create answers
                data.answers.map(async (ans) => {
                  await supabase.from("tbl_answer").insert({
                    question_id: qures.data.id,
                    answer: ans.answer,
                    is_correct: ans.is_correct,
                  });
                });
              })
              .catch((querr) => {
                console.log("failed to make question", querr);

                setLoading(false);
                return;
              });
          }
        });
      })
      .catch((exerr) => {
        console.log("failed to make exam", exerr.error);
        setSnackbar({
          open: true,
          message: "Failed to create quiz. Please try again.",
          severity: "error",
        });
        setLoading(false);
        return;
      });
    setSnackbar({
      open: true,
      message: "Quiz created successfully!",
      severity: "success",
    });
    localStorage.removeItem("quizsummary");

    navigate(-1);
  };

  const randomQuiz = async () => {
    // insert exam
    setLoading(true);

    const { data: examData, error: examErr } = await supabase
      .from("tbl_exam")
      .insert({
        name: quizDetails.name,
        desc: quizDetails.desc,
        mode: "Random",
        objective: quizDetails.objective,
        repository: quizDetails.repository,
        subject_id: quizDetails.subject_id,
        total_items: total.totalItems,
        is_random: quizDetails.is_random,
        allow_review: quizDetails.allow_review,
        time_limit:
          quizDetails.time_limit == "none" ? null : quizDetails.time_limit,
      })
      .select("id")
      .single();

    if (examErr) {
      setSnackbar({
        open: true,
        message: "Failed to create exam. Please try again.",
        severity: "error",
      });
      return;
    }

    const payload = rows.map((d) => {
      return { ...d, exam_id: examData.id };
    });

    // insert tos

    const { data: tosData, error: tosErr } = await supabase
      .from("tbl_tos")
      .insert(payload);

    if (tosErr) {
      const { error: delErr } = await supabase
        .from("tbl_exam")
        .delete()
        .eq("id", examData.id);

      setSnackbar({
        open: true,
        message: "Failed to create TOS. Please try again.",
        severity: "error",
      });
      return;
    }

    setSnackbar({
      open: true,
      message: "Quiz created successfully!",
      severity: "success",
    });
    localStorage.removeItem("quizsummary");
    navigate(-1);
  };

  const validate = () => {
    if (!isAllChecked && quizDetails.mode === "AI-Generated") {
      setDialog({
        open: true,
        title: "Unchecked Questions",
        content:
          "Some questions haven't been checked for similarity. Do you want to proceed?",
        action: () => handleFinish(),
      });
      return;
    }
    if (hasSimilarity) {
      setDialog({
        open: true,
        title: "Similar Questions Found",
        content: "Some questions have similar content. Do you want to proceed?",
        action: () => handleFinish(),
      });
      return;
    }

    handleFinish();
  };

  const handleFinish = async () => {
    setDialog({ ...dialog, open: false });
    // console.log(quizDetails.mode);

    const actions = {
      "AI-Generated": AIGenerated,
      Random: randomQuiz,
    };

    setDialog({
      open: true,
      title: "Create Quiz",
      content:
        "Are you sure you want to create this quiz? The quiz cannot be edited later.",
      action: actions[quizDetails.mode],
    });
  };

  const handleEditDetail = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "is_random" || name === "allow_review") {
      setQuizDetails((prev) => ({
        ...prev,
        [name]: !e.target.checked,
      }));
      return;
    }

    setQuizDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAllChecked = quizResult.every((q) => q.checked);

  const hasSimilarity = quizResult.some((q) => q.hasSimilar);

  const onCancel = () => {
    navigate(-1);
    localStorage.removeItem("quizsummary");
  };

  const handleTosPdf = () => {
    TOS_pdf_export(rows, quizDetails.name);
    setTosExportAnchor(null);
  };

  const handleTosCsv = () => {
    TOS_csv_export(rows, quizDetails.name);
    setTosExportAnchor(null);
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const exportExamPDF = () => {
    const forExport = quizResult;
    if (quizDetails.is_random) {
      shuffleArray(forExport);
    }

    Exam_pdf(forExport, quizDetails);
    ExamKey_pdf(forExport, quizDetails);
  };

  return (
    <Container maxWidth="xl" sx={{ my: 5 }}>
      <div className="bg-white border-b border-gray-200 pt-6 pb-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">Quiz Summary</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Here are the details and generated questions for your quiz.
        </p>
      </div>
      {/* Quiz Details */}
      <Card sx={{ padding: 3, mb: 3 }} variant="outlined">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h2 className="text-2xl font-bold mb-4">Quiz Details</h2>
          <Button
            size="small"
            variant={editQDetail ? "contained" : "outlined"}
            onClick={() => setEditQDetail(!editQDetail)}
            color="warning"
            startIcon={<ModeEditRoundedIcon />}
            disableElevation
          >
            {editQDetail ? "Editing " : "Edit "}
          </Button>
        </Stack>
        <div className="grid grid-cols-3 gap-4">
          <TextField
            type="text"
            fullWidth
            variant="standard"
            disabled={!editQDetail}
            label="Quiz Name"
            value={quizDetails.name}
            name="name"
            onChange={handleEditDetail}
          />
          <TextField
            fullWidth
            type="text"
            variant="standard"
            disabled
            label="Subject"
            value={quizDetails.subject_name}
          />
          <TextField
            fullWidth
            type="number"
            variant="standard"
            disabled
            label="Total Items"
            value={total.totalItems}
          />
          <TextField
            type="text"
            variant="standard"
            fullWidth
            disabled={!editQDetail}
            label="Description"
            value={quizDetails.desc}
            onChange={handleEditDetail}
            name="desc"
          />
          <TextField
            type="text"
            fullWidth
            variant="standard"
            disabled={!editQDetail}
            label="Objective"
            value={quizDetails.objective}
            onChange={handleEditDetail}
            name="objective"
          />
          <FormControlLabel
            disabled={!editQDetail}
            control={
              <Checkbox
                checked={quizDetails.is_random}
                name="is_random"
                // onChange={handleEditDetail}
                onClick={handleEditDetail}
              />
            }
            label="Randomize quiz items"
          />
          <FormControlLabel
            disabled={!editQDetail}
            control={
              <Checkbox
                checked={quizDetails.allow_review}
                name="allow_review"
                // onChange={handleEditDetail}
                onClick={handleEditDetail}
              />
            }
            label="Allow students to review answers after quiz"
          />
        </div>
      </Card>

      {/* TOS */}
      <Card ref={tosRef} sx={{ padding: 3, mb: 3 }} variant="outlined">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h2 className="text-2xl font-bold">Table of Specification</h2>

          <Export
            anchorEl={tosExportAnchor}
            setAnchorEl={setTosExportAnchor}
            dlPdf={handleTosPdf}
            dlCsv={handleTosCsv}
          />
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* <th rowSpan={2}>Source Material</th> */}
                <TableCell align="center" rowSpan={2}>
                  <b>Topic Title</b>
                </TableCell>
                <TableCell align="center" rowSpan={2}>
                  <b>Hours</b>
                </TableCell>
                <TableCell align="center" rowSpan={2}>
                  <b>Percentage</b>
                </TableCell>
                <TableCell align="center" colSpan={2} bgcolor="#e3f2fd">
                  <b>EASY</b>
                </TableCell>
                <TableCell align="center" colSpan={2} bgcolor="#fffde7">
                  <b>MEDIUM</b>
                </TableCell>
                <TableCell align="center" colSpan={2} bgcolor="#ffebee">
                  <b>HARD</b>
                </TableCell>
                <TableCell align="center" rowSpan={2}>
                  <b>Total Items</b>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" bgcolor="#e3f2fd">
                  <b>Remembering (30%)</b>
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  <b>Understanding (20%)</b>
                </TableCell>
                <TableCell align="center" bgcolor="#fffde7">
                  <b>Applying (20%)</b>
                </TableCell>
                <TableCell align="center " bgcolor="#fffde7">
                  <b>Analyzing (10%)</b>
                </TableCell>
                <TableCell align="center" bgcolor="#ffebee">
                  <b>Creating (10%)</b>
                </TableCell>
                <TableCell align="center" bgcolor="#ffebee">
                  <b>Evaluating (10%)</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.topic}</TableCell>
                  <TableCell align="center">{row.hours}</TableCell>
                  <TableCell align="center">{row.percentage} %</TableCell>
                  <TableCell align="center" bgcolor="#e3f2fd">
                    {row.remembering}
                  </TableCell>
                  <TableCell align="center" bgcolor="#e3f2fd">
                    {row.understanding}
                  </TableCell>
                  <TableCell align="center" bgcolor="#fffde7">
                    {row.applying}
                  </TableCell>
                  <TableCell align="center" bgcolor="#fffde7">
                    {row.analyzing}
                  </TableCell>
                  <TableCell align="center" bgcolor="#ffebee">
                    {row.creating}
                  </TableCell>
                  <TableCell align="center" bgcolor="#ffebee">
                    {row.evaluating}
                  </TableCell>
                  <TableCell align="center">{row.totalItems}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="center">
                  <b>Total</b>
                </TableCell>
                <TableCell align="center">{total.hours}</TableCell>
                <TableCell align="center">{total.percentage} %</TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  {total.remembering}
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  {total.understanding}
                </TableCell>
                <TableCell align="center" bgcolor="#fffde7">
                  {total.applying}
                </TableCell>
                <TableCell align="center" bgcolor="#fffde7">
                  {total.analyzing}
                </TableCell>
                <TableCell align="center" bgcolor="#ffebee">
                  {total.creating}
                </TableCell>
                <TableCell align="center" bgcolor="#ffebee">
                  {total.evaluating}
                </TableCell>
                <TableCell align="center">{total.totalItems}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Questions List */}
      {quizResult.length != 0 && (
        <>
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            my={2}
          >
            <h2 className="text-2xl font-bold">Generated Questions</h2>
            {/* <Stack direction="row" spacing={2}>
              <Button size="small" variant="outlined" onClick={() => {}}>
                Print <PrintRoundedIcon />
              </Button>
            </Stack> */}
            <Export
              anchorEl={examExportAnchor}
              setAnchorEl={setExamExportAnchor}
              dlPdf={exportExamPDF}
            />
          </Stack>
          {/* mismong questions */}
          {quizResult.map((data, index) => {
            return (
              <QuestionBuilder
                key={index}
                index={index}
                items={quizResult}
                setItems={setQuizResult}
                repository={quizDetail.repository}
              />
            );
          })}
        </>
      )}

      {/* action buttons sa baba */}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="flex justify-between mt-8 flex-wrap gap-4">
          <Button
            color="error"
            size="large"
            onClick={onCancel}
            disableElevation
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={validate}
            disableElevation
            color="success"
            disabled={!isAllChecked}
          >
            Finish
          </Button>
        </div>
      )}

      <GenQuestionDialog dialog={dialog} setDialog={setDialog} />
    </Container>
  );
};

export default QuizResultPage;
