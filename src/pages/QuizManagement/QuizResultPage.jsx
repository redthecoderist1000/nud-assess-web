import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";

import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QuestionBuilder from "./components/resultPage/QuestionBuilder";
import { userContext } from "../../App";

const QUESTION_TYPES = ["Multiple Choice", "True or False", "Identification"];

const QuizResultPage = () => {
  const { setSnackbar } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { quizDetail, rows, total, quiz } = location.state;
  const [loading, setLoading] = useState(false);

  // State for edit mode and editable data
  const [editQDetail, setEditQDetail] = useState(false);
  const [editQuestion, setEditQuestion] = useState(false);

  const [quizDetails, setQuizDetails] = useState(quizDetail);
  const [quizResult, setQuizResult] = useState([...quiz]);

  // Ref for print area
  const tosRef = useRef();
  const questionRef = useRef();

  // Print handler: only print the printRef area
  const handlePrint = (target) => {
    const tosContent = tosRef.current.innerHTML;
    const questionContent = questionRef.current.innerHTML;

    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .quiz-title { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
            .quiz-lesson { font-size: 1.2rem; margin-bottom: 1.5rem; }
            .quiz-items { margin-top: 1.5rem; }
            .quiz-question { margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: flex-start; }
            .quiz-options { margin-left: 1.5rem; }
          </style>
        </head>
        <body>
          ${target === "tos" ? tosContent : questionContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const AIGenerated = async () => {
    // create exam
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
  };

  const randomQuiz = async () => {
    // console.log("random");
    // console.log(quizDetails);
    // console.log(rows);

    //    repository: 'Quiz',
    //     mode: 'Random',
    //     subject_id: '75b47974-ec35-4319-9dd2-6364d0f7348e',
    //     subject_name: 'Information Assurance And Security\n',
    //     is_random: false,
    //     name: 'Red Zinfandel Ochavillo'

    // insert exam

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
  };

  const handleFinish = async () => {
    if (!isAllChecked) {
      setSnackbar({
        message: "Please review all questions before finishing.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    switch (quizDetails.mode) {
      case "AI-Generated":
        AIGenerated();
        break;
      case "Random":
        randomQuiz();
        break;
      default:
        break;
    }
    // console.log("tos created:", tosres.data);
    navigate(-1);
    // setLoading(false);
  };

  const handleEditDetail = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (name === "is_random") {
      setQuizDetails((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
      return;
    }

    setQuizDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAllChecked = quizResult.every((q) => q.checked);

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
          >
            {editQDetail ? "Editing " : "Edit "} <PrintRoundedIcon />
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
                onChange={handleEditDetail}
              />
            }
            label="Randomize quiz items"
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
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePrint("tos")}
          >
            Print <PrintRoundedIcon />
          </Button>
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
                <TableCell align="center" colSpan={2}>
                  <b>EASY</b>
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  <b>MEDIUM</b>
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  <b>HARD</b>
                </TableCell>
                <TableCell align="center" rowSpan={2}>
                  <b>Total Items</b>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">
                  <b>Remembering (30%)</b>
                </TableCell>
                <TableCell align="center">
                  <b>Understanding (20%)</b>
                </TableCell>
                <TableCell align="center">
                  <b>Applying (20%)</b>
                </TableCell>
                <TableCell align="center">
                  <b>Analyzing (10%)</b>
                </TableCell>
                <TableCell align="center">
                  <b>Creating (10%)</b>
                </TableCell>
                <TableCell align="center">
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
                  <TableCell align="center">{row.remembering}</TableCell>
                  <TableCell align="center">{row.understanding}</TableCell>
                  <TableCell align="center">{row.applying}</TableCell>
                  <TableCell align="center">{row.analyzing}</TableCell>
                  <TableCell align="center">{row.creating}</TableCell>
                  <TableCell align="center">{row.evaluating}</TableCell>
                  <TableCell align="center">{row.totalItems}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="center">
                  <b>Total</b>
                </TableCell>
                <TableCell align="center">{total.hours}</TableCell>
                <TableCell align="center">{total.percentage} %</TableCell>
                <TableCell align="center">{total.remembering}</TableCell>
                <TableCell align="center">{total.understanding}</TableCell>
                <TableCell align="center">{total.applying}</TableCell>
                <TableCell align="center">{total.analyzing}</TableCell>
                <TableCell align="center">{total.creating}</TableCell>
                <TableCell align="center">{total.evaluating}</TableCell>
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
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handlePrint("question")}
              >
                Print <PrintRoundedIcon />
              </Button>
              <Button
                size="small"
                variant={editQuestion ? "contained" : "outlined"}
                color="warning"
                onClick={() => setEditQuestion(!editQuestion)}
              >
                Edit <ModeEditRoundedIcon />
              </Button>
            </Stack>
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
            onClick={() => navigate(-1)}
            disableElevation
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleFinish}
            disableElevation
            color="success"
            disabled={!isAllChecked}
          >
            Finish
          </Button>
        </div>
      )}
    </Container>
  );
};

export default QuizResultPage;
