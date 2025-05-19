import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuestionAutomatically = () => {
  const [tab, setTab] = useState("paste");
  const [lesson, setLesson] = useState("");
  const [course, setCourse] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleGenerate = () => {
    // Sample questions to pass to QuestionSummary
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

    // Navigate to QuestionSummary with state
    navigate("/dashboard/QuestionSummary", {
      state: {
        formData: {
          lesson,
          course,
          lessonTitle,
          questions: sampleQuestions,
        },
      },
    });
  };

  return (
    <div className="flex flex-col w-full px-12 py-8">
      <h1 className="text-2xl font-bold mb-1">Generate questions</h1>
      <p className="text-xs text-gray-500 mb-6">
        Input basic details and upload your file to generate questions
      </p>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-xs text-gray-700 mb-1">Lesson</label>
          <input
            type="text"
            placeholder="Enter lesson number"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-700 mb-1">Course</label>
          <input
            type="text"
            placeholder="Enter course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-xs text-gray-700 mb-1">Lesson title</label>
        <input
          type="text"
          placeholder="Enter lesson title"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div className="border-b border-gray-300 mb-2 flex">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "paste"
              ? "border-b-2 border-blue-900 text-blue-900"
              : "text-gray-500"
          }`}
          onClick={() => setTab("paste")}
        >
          Paste text
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "upload"
              ? "border-b-2 border-blue-900 text-blue-900"
              : "text-gray-500"
          }`}
          onClick={() => setTab("upload")}
        >
          Upload file
        </button>
      </div>
      {tab === "paste" ? (
        <textarea
          className="w-full h-52 bg-[#D9DCEE] rounded p-3 text-sm text-gray-700 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          placeholder="Paste your text here and we will do the rest..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div
          className="w-full mb-8 bg-[#D9DCEE] rounded-lg flex flex-col items-center justify-center py-8 relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <svg
            className="w-10 h-10 mb-2 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0l-4 4m4-4l4 4M20 16.5A2.5 2.5 0 0017.5 14H17v-2a5 5 0 00-10 0v2h-.5A2.5 2.5 0 004 16.5v2A2.5 2.5 0 006.5 21h11a2.5 2.5 0 002.5-2.5v-2z"
            />
          </svg>
          <div className="text-center">
            <div className="font-semibold">Drag and drop your file.</div>
            <div className="text-xs text-gray-700 mb-4">
              Supported file types are pdf, docs, etc
            </div>
            <button
              type="button"
              className="bg-blue-900 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
              onClick={handleBrowseClick}
            >
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <div className="mt-2 text-sm text-gray-800">
                Selected file: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button className="bg-red-600 text-white px-8 py-2 rounded font-semibold hover:bg-red-700 transition">
          Cancel
        </button>
        <button
          className="bg-blue-900 text-white px-8 py-2 rounded font-semibold hover:bg-blue-800 transition"
          onClick={handleGenerate}
        >
          Generate questions
        </button>
      </div>
    </div>
  );
};

export default CreateQuestionAutomatically;