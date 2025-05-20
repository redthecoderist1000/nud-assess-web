import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const QuestionResultPage = () => {
  const location = useLocation();
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

  // State for question details
  const [questionDetails, setQuestionDetails] = useState({
    lesson: formData.lesson || "Sample Lesson",
    course: formData.course || "Sample Course",
    lessonTitle: formData.lessonTitle || "Sample Lesson Title",
  });

  const [questions, setQuestions] = useState(
    formData.questions && formData.questions.length > 0 ? formData.questions : sampleQuestions
  );

  // Ref for print area
  const printRef = useRef();

  // Print handler: only print the printRef area
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Print Questions</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .questions-title { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
            .questions-lesson { font-size: 1.2rem; margin-bottom: 1.5rem; }
            .questions-items { margin-top: 1.5rem; }
            .questions-question { margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: flex-start; }
            .questions-options { margin-left: 1.5rem; }
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
        <h1 className="text-5xl font-bold mb-2">Question Result</h1>
        <p className="text-gray-600">Here are the details and generated questions.</p>
      </div>

      {/* Print Area */}
      <div ref={printRef} style={{ display: "none" }}>
        <div className="questions-title">{questionDetails.lessonTitle}</div>
        <div className="questions-lesson">Lesson: {questionDetails.lesson}</div>
        <div className="questions-course">Course: {questionDetails.course}</div>
        <div className="questions-items">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="questions-question"
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
                  <ul className="questions-options" style={{ listStyle: "disc", marginLeft: 20 }}>
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

      {/* Question Details */}
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Question Details</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Lesson", value: questionDetails.lesson },
            { label: "Course", value: questionDetails.course },
            { label: "Lesson Title", value: questionDetails.lessonTitle },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={value}
                readOnly
                className="input-field"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Generated Questions</h2>
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
              <p className="mt-2 font-bold text-blue-600">Answer: {q.answer}</p>
            </div>
            <div
              className="min-w-[120px] text-right text-[#35408E] text-sm font-semibold ml-4"
              style={{ marginTop: 2 }}
            >
              {q.tosPlacement || "Applying"}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 flex-wrap gap-4">
        <button
          onClick={handlePrint}
          className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
        >
          Print
        </button>
        <button
          onClick={() => alert("Questions saved successfully!")}
          className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center shadow"
        >
          Save to Bank
        </button>
      </div>
    </div>
  );
};

export default QuestionResultPage;