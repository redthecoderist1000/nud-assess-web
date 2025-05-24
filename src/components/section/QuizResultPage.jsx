import {
  Card,
  Checkbox,
  CircularProgress,
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
import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";

const QUESTION_TYPES = ["Multiple Choice", "True or False", "Identification"];

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};
  const { quizDetail, rows, total, quiz } = location.state;
  const [loading, setLoading] = useState(false);

  // Default Sample Questions
  const sampleQuestions = [
    {
      id: 1,
      type: "Multiple Choice",
      question:
        "What is the area of a triangle with a base of 12 cm and a height of 5 cm?",
      options: ["A) 30 cm²", "B) 60 cm²", "C) 25 cm²", "D) 20 cm²"],
      answer: "A) 30 cm²",
      tosPlacement: "Applying",
    },
    {
      id: 2,
      type: "True or False",
      question: "The solution to the equation 2(x-3)=10 is x=8.",
      answer: "False",
      tosPlacement: "Understanding",
    },
    {
      id: 3,
      type: "Identification",
      question: "Solve for x in the equation 3x+9=21.",
      answer: "x=4",
      tosPlacement: "Remembering",
    },
  ];

  // State for edit mode and editable data
  const [editMode, setEditMode] = useState(false);
  const [quizDetails, setQuizDetails] = useState({ ...quizDetail });
  const [questions, setQuestions] = useState(
    formData.questions && formData.questions.length > 0
      ? formData.questions
      : sampleQuestions
  );

  // State for adding new question
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "Multiple Choice",
    question: "",
    options: ["", "", "", ""],
    answer: "",
    tosPlacement: "Applying",
  });

  // Ref for print area
  const printRef = useRef();

  // Handlers for editing
  const handleQuizDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, oi) =>
                oi === optIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  // Add new question handlers
  const handleNewQuestionChange = (field, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "type"
        ? {
            options:
              value === "Multiple Choice"
                ? ["", "", "", ""]
                : value === "True or False"
                  ? []
                  : [],
          }
        : {}),
    }));
  };

  const handleNewOptionChange = (optIndex, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === optIndex ? value : opt)),
    }));
  };

  const handleAddQuestion = () => {
    if (
      !newQuestion.question.trim() ||
      (newQuestion.type === "Multiple Choice" &&
        newQuestion.options.some((opt) => !opt.trim())) ||
      !newQuestion.answer.trim()
    ) {
      alert("Please fill in all fields for the new question.");
      return;
    }
    setQuestions((prev) => [
      ...prev,
      {
        ...newQuestion,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
      },
    ]);
    setShowAddQuestion(false);
    setNewQuestion({
      type: "Multiple Choice",
      question: "",
      options: ["", "", "", ""],
      answer: "",
      tosPlacement: "Applying",
    });
  };

  // Simulate choosing from repo (for demo, just adds a sample)
  const handleChooseFromRepo = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        type: "Multiple Choice",
        question: "Sample question from repository?",
        options: ["A) Repo 1", "B) Repo 2", "C) Repo 3", "D) Repo 4"],
        answer: "A) Repo 1",
        tosPlacement: "Applying",
      },
    ]);
  };

  // Print handler: only print the printRef area
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Print Quiz</title>
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
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleFinish = async () => {
    setLoading(true);
    // create exam
    await supabase
      .from("tbl_exam")
      .insert({
        name: quizDetail.name,
        desc: quizDetail.desc,
        objective: quizDetail.objective,
        repository: quizDetail.repository,
        subject_id: quizDetail.subject_id,
        total_items: total.totalItems,
        is_random: quizDetail.is_random,
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
          // create questions
          await supabase
            .from("tbl_question")
            .insert({
              lesson_id: data.lesson_id,
              question: data.question,
              type: "Multiple Choice",
              blooms_category: data.specification,
              repository: quizDetails.repository,
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
        });
      })
      .catch((exerr) => {
        console.log("failed to make exam", exerr.error);
        setLoading(false);
        return;
      });

    // console.log("tos created:", tosres.data);
    navigate(-1);
    setLoading(false);
  };

  return (
    <div className="w-full p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-5xl font-bold mb-2">Quiz Summary</h1>
        <p className="text-gray-600">
          Here are the details and generated questions for your quiz.
        </p>
      </div>

      {/* Print Area */}
      <div style={{ display: "none" }}>
        <div className="quiz-title">{quizDetail.name}</div>
        <div className="quiz-lesson">Lesson: {quizDetails.lesson}</div>
        <div className="quiz-items">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="quiz-question"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                {q.type === "True or False" ? (
                  `${idx + 1}. (True or False) ${q.question}`
                ) : q.type === "Multiple Choice" ? (
                  <>
                    {idx + 1}. <b>Multiple choice:</b> {q.question}
                  </>
                ) : (
                  `${idx + 1}. ${q.question}`
                )}
                {q.type === "Multiple Choice" && q.options && (
                  <ul
                    className="quiz-options"
                    style={{ listStyle: "disc", marginLeft: 20 }}
                  >
                    {q.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Details */}
      <Card sx={{ padding: 3, mb: 3 }}>
        <h2 className="text-2xl font-bold mb-4">Quiz Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <TextField
            type="text"
            fullWidth
            variant="standard"
            disabled={!editMode}
            label="Quiz Name"
            value={quizDetails.name}
            className="input-field"
          />
          <TextField
            fullWidth
            type="text"
            variant="standard"
            disabled={!editMode}
            label="Subject"
            value={quizDetails.subject_id}
            className="input-field"
          />
          <TextField
            fullWidth
            type="number"
            variant="standard"
            disabled={!editMode}
            label="Total Items"
            value={total.totalItems}
            className="input-field"
          />
          <TextField
            type="text"
            variant="standard"
            fullWidth
            disabled={!editMode}
            label="Description"
            value={quizDetails.desc}
            className="input-field"
          />
          <TextField
            type="text"
            fullWidth
            variant="standard"
            disabled={!editMode}
            label="Objective"
            value={quizDetails.objective}
            className="input-field"
          />
          <FormControlLabel
            disabled={!editMode}
            control={<Checkbox checked={quizDetails.is_random} />}
            label="Randomize quiz items"
          />
        </div>
      </Card>

      {/* TOS */}
      <Card sx={{ padding: 3, mb: 3 }}>
        <h2 className="text-2xl font-bold mb-4">Table of Specification</h2>
        <TableContainer>
          <Table>
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
      <Card ref={printRef} sx={{ padding: 3 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Generated Questions</h2>
          {editMode && (
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={() => setShowAddQuestion(true)}
              >
                + Add Question
              </button>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                onClick={handleChooseFromRepo}
              >
                + Choose from Repo
              </button>
            </div>
          )}
        </div>
        {/* mismong questions */}
        {quiz.map((data, index) => (
          <div
            key={index}
            className="mb-6  pb-4  flex justify-between items-start"
          >
            <div className="flex-1">
              {/* question */}
              <p className="text-lg font-bold">
                {index + 1}). {data.question}
              </p>
              {/* options */}
              <Grid container columns={2} spacing={3} mt={1}>
                {data.answers.map((ans, ind) => {
                  return (
                    <Grid key={ind} size={1}>
                      {ans.is_correct ? (
                        <u>
                          <p>{ans.answer}</p>
                        </u>
                      ) : (
                        <p>{ans.answer}</p>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </div>
            <Stack maxWidth={250} rowGap={2}>
              <div className="text-right text-[#35408E] text-sm font-semibold">
                "{data.topic}"
              </div>
              <div className="min-w-[120px] text-right text-[#35408E] text-sm">
                "{data.specification}"
              </div>
            </Stack>
          </div>
        ))}

        {/* Add Question Modal */}
        {showAddQuestion && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Add New Question</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) =>
                    handleNewQuestionChange("type", e.target.value)
                  }
                  className="border rounded px-2 py-1 w-full"
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    handleNewQuestionChange("question", e.target.value)
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {newQuestion.type === "Multiple Choice" && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Choices
                  </label>
                  {newQuestion.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={(e) => handleNewOptionChange(i, e.target.value)}
                      className="border rounded px-2 py-1 w-full mb-1"
                    />
                  ))}
                </div>
              )}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Answer</label>
                <input
                  type="text"
                  value={newQuestion.answer}
                  onChange={(e) =>
                    handleNewQuestionChange("answer", e.target.value)
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Table of Specification Placement
                </label>
                <input
                  type="text"
                  value={newQuestion.tosPlacement}
                  onChange={(e) =>
                    handleNewQuestionChange("tosPlacement", e.target.value)
                  }
                  className="border rounded px-2 py-1 w-full"
                  placeholder="e.g. Applying"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowAddQuestion(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                  onClick={handleAddQuestion}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* action buttons sa baba */}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="flex justify-between mt-8 flex-wrap gap-4">
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
          >
            {editMode ? "Done" : "Edit"}
          </button>
          <button
            onClick={() => alert("Questions saved successfully!")}
            className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
          >
            Save Questions in Repository
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
          >
            Print
          </button>
          <button
            onClick={handleFinish}
            className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizResultPage;
