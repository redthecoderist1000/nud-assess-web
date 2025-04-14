import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuestionResultPage = () => {
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
    },
    {
      id: 2,
      type: "True or False",
      question: "The solution to the equation 2(x-3)=10 is x=8.",
      answer: "False",
    },
    {
      id: 3,
      type: "Identification",
      question: "Solve for x in the equation 3x+9=21.",
      answer: "x=4",
    },
  ];

  // Check if questions exist, otherwise use sample questions
  const questions = formData.questions && formData.questions.length > 0 ? formData.questions : sampleQuestions;

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-5xl font-bold mb-2">Quiz Result</h1>
        <p className="text-gray-600">Here are the details and generated questions for your quiz.</p>
      </div>

      {/* 📌 Quiz Details */}
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quiz Name</label>
            <input type="text" value={formData.quizName || "Sample Quiz"} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lesson</label>
            <input type="text" value={formData.lesson || "Sample Lesson"} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <input type="text" value={formData.course || "Sample Course"} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <input type="text" value={formData.class || "Sample Class"} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Limit</label>
            <input type="text" value={formData.timeLimit || "30 mins"} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Items</label>
            <input type="text" value={formData.totalItems || questions.length} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="text" value={formData.startDate || "N/A"} readOnly className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="text" value={formData.endDate || "N/A"} readOnly className="input-field" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.randomized || false} readOnly className="w-5 h-5" />
            <label className="text-sm font-medium text-gray-700">Randomized Questions?</label>
          </div>
        </div>
      </div>

      {/* 📌 Questions List */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Generated Questions</h2>
        {questions.map((q, index) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <p className="text-lg font-bold">Question {index + 1}: {q.type}</p>
            <p className="text-gray-800">{q.question}</p>
            {q.options && (
              <ul className="list-disc pl-5">
                {q.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            )}
            <p className="mt-2 font-bold text-blue-600">Answer: {q.answer}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
  <button 
    onClick={() => navigate("/dashboard/CreateAutomatically")}
    className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center">
    Edit
  </button>
  <button 
    onClick={() => alert('Questions saved successfully!')}
    className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center">
    Save Questions in Repository
  </button>
  <button 
    onClick={() => window.print()}
    className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center">
    Print
  </button>
  <button 
    onClick={() => alert('Quiz posted successfully!')}
    className="bg-[#35408E] text-white w-48 px-6 py-2 rounded-md hover:opacity-80 transition text-center">
    Post
  </button>
</div>


    </div>
  );
};

export default QuestionResultPage;
