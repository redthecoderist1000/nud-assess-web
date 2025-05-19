import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QUESTION_TYPES = [
  "Multiple Choice",
  "True or False",
  "Identification",
];

const QuizDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};

  // Default Sample Questions
  const sampleQuestions = [
    {
      id: 1,
      type: "Multiple Choice",
      question: "What is the area of a triangle with a base of 12 cm and a height of 5 cm?",
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
  const [quizDetails, setQuizDetails] = useState({
    quizName: formData.quizName || "Sample Quiz",
    lesson: formData.lesson || "Sample Lesson",
    course: formData.course || "Sample Course",
    class: formData.class || "Sample Class",
    timeLimit: formData.timeLimit || "30 mins",
    totalItems: formData.totalItems || (formData.questions ? formData.questions.length : sampleQuestions.length),
    startDate: formData.startDate || "N/A",
    endDate: formData.endDate || "N/A",
    randomized: formData.randomized || false,
  });
  const [questions, setQuestions] = useState(
    formData.questions && formData.questions.length > 0 ? formData.questions : sampleQuestions
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
      prev.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((opt, oi) => (oi === optIndex ? value : opt)) }
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

  return (
    <div className="w-full p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-5xl font-bold mb-2">Quiz Result</h1>
        <p className="text-gray-600">Here are the details and generated questions for your quiz.</p>
      </div>

      {/* Print Area */}
      <div ref={printRef} style={{ display: "none" }}>
        <div className="quiz-title">{quizDetails.quizName}</div>
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
                {q.type === "True or False"
                  ? `${idx + 1}. (True or False) ${q.question}`
                  : q.type === "Multiple Choice"
                  ? (
                      <>
                        {idx + 1}. <b>Multiple choice:</b> {q.question}
                      </>
                    )
                  : `${idx + 1}. ${q.question}`}
                {q.type === "Multiple Choice" && q.options && (
                  <ul className="quiz-options" style={{ listStyle: "disc", marginLeft: 20 }}>
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
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz Details</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Quiz Name", name: "quizName" },
            { label: "Lesson", name: "lesson" },
            { label: "Course", name: "course" },
            { label: "Class", name: "class" },
            { label: "Time Limit", name: "timeLimit" },
            { label: "Total Items", name: "totalItems" },
            { label: "Start Date", name: "startDate" },
            { label: "End Date", name: "endDate" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              {editMode ? (
                <input
                  type="text"
                  name={name}
                  value={quizDetails[name]}
                  onChange={handleQuizDetailChange}
                  className="input-field"
                />
              ) : (
                <input
                  type="text"
                  value={quizDetails[name]}
                  readOnly
                  className="input-field"
                />
              )}
            </div>
          ))}
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <input
                  type="checkbox"
                  name="randomized"
                  checked={quizDetails.randomized}
                  onChange={handleQuizDetailChange}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Randomized Questions?</label>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={quizDetails.randomized}
                  readOnly
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Randomized Questions?</label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
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
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="mb-6 border-b pb-4 shadow-sm flex justify-between items-start"
          >
            <div className="flex-1">
              <p className="text-lg font-bold">
                {q.type === "True or False"
                  ? `${index + 1}. (True or False) ${q.question}`
                  : q.type === "Multiple Choice"
                  ? (
                      <>
                        {index + 1}. <b>Multiple choice:</b> {q.question}
                      </>
                    )
                  : `${index + 1}. ${q.question}`}
              </p>
              {q.type === "Multiple Choice" && q.options && (
                <ul className="list-disc pl-5">
                  {q.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              )}
              {!editMode && (
                <p className="mt-2 font-bold text-blue-600">Answer: {q.answer}</p>
              )}
              {editMode && (
                <>
                  <select
                    value={q.type}
                    onChange={e => handleQuestionChange(index, "type", e.target.value)}
                    className="border rounded px-2 py-1 mb-2"
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={q.question}
                    onChange={e => handleQuestionChange(index, "question", e.target.value)}
                    className="w-full border rounded px-2 py-1 mb-2"
                  />
                  {q.type === "Multiple Choice" && q.options && (
                    <ul className="list-disc pl-5">
                      {q.options.map((option, i) => (
                        <li key={i}>
                          <input
                            type="text"
                            value={option}
                            onChange={e => handleOptionChange(index, i, e.target.value)}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  <input
                    type="text"
                    value={q.answer}
                    onChange={e => handleQuestionChange(index, "answer", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-2 text-blue-600 font-bold"
                  />
                  <input
                    type="text"
                    value={q.tosPlacement || ""}
                    onChange={e => handleQuestionChange(index, "tosPlacement", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-2"
                    placeholder="Table of Specification Placement"
                  />
                </>
              )}
            </div>
            <div
              className="min-w-[120px] text-right text-[#35408E] text-sm font-semibold ml-4"
              style={{ marginTop: 2 }}
            >
              {q.tosPlacement || "Applying"}
            </div>
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
                  onChange={e => handleNewQuestionChange("type", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Question</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={e => handleNewQuestionChange("question", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {newQuestion.type === "Multiple Choice" && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Choices</label>
                  {newQuestion.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={e => handleNewOptionChange(i, e.target.value)}
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
                  onChange={e => handleNewQuestionChange("answer", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Table of Specification Placement</label>
                <input
                  type="text"
                  value={newQuestion.tosPlacement}
                  onChange={e => handleNewQuestionChange("tosPlacement", e.target.value)}
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
      </div>

      <div className="flex justify-between mt-8 flex-wrap gap-4">
        <button
          onClick={() => alert('Quiz edit successfully!')}
          className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default QuizDetails;