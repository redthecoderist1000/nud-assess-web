import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuizModal from "../elements/QuizModal";
import QuestionRepoModal from "../elements/QuestionRepoModal";
import VerticalBarChart from "../elements/VerticalBarChart";
import TOS from "./TOS";
import Tosifier from "../elements/Tosifier";

const QuizmanagementPage = () => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState("1st Year");

  const [quizDetail, setQuizDetail] = useState({
    repository: "",
    mode: "",
  });

  const navigate = useNavigate();

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const selectYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleLessonClick = (lesson) => {
    // Navigate to QuizDetails.jsx with the lesson details
    navigate("/dashboard/QuizDetails", {
      state: { lesson },
    });
  };

  const handleQuizModalSelect = (mode) => {
    setQuizDetail({ ...quizDetail, mode: mode });

    // Close QuizModal and open QuestionRepoModal
    setIsQuizModalOpen(false);
    setIsRepoModalOpen(true);
  };

  const handleRepoModalSelect = (repo) => {
    setQuizDetail({ ...quizDetail, repository: repo });
    // Close QuestionRepoModal and show TOS
    setIsRepoModalOpen(false);
    setShowTOS(true);
  };

  const yearSubjects = {
    "1st Year": [
      { code: "CCTAPDVL - INF221", name: "Introduction to Programming" },
      { code: "CCTAPDVL - INF222", name: "Basic Mathematics" },
    ],
    "2nd Year": [
      { code: "CCTAPDVL - INF223", name: "Data Structures and Algorithms" },
      { code: "CCTAPDVL - INF224", name: "Object-Oriented Programming" },
    ],
    "3rd Year": [
      { code: "CCTAPDVL - INF225", name: "Software Engineering" },
      { code: "CCTAPDVL - INF226", name: "Operating Systems" },
    ],
    "4th Year": [
      { code: "CCTAPDVL - INF227", name: "Capstone Project" },
      { code: "CCTAPDVL - INF228", name: "Machine Learning" },
    ],
  };

  const lessons = [
    { id: 1, title: "Lesson 1 - Introduction" },
    { id: 2, title: "Lesson 2 - Fundamentals" },
    { id: 3, title: "Lesson 3 - Advanced Topics" },
  ];

  if (showTOS) {
    return (
      <Tosifier quizDetail={quizDetail} onCancel={() => setShowTOS(false)} />
    );
    // return <TOS onNext={() => setShowTOS(false)} />;
    // console.log("Quiz Details:", quizDetail);
  }

  return (
    <motion.div
      className="flex h-screen overflow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <main className="flex-1 p-6 min-h-screen flex flex-col justify-start">
        <div>
          <h1 className="text-5xl font-bold mb-4">Quiz Management</h1>
          <p className="text-gray-600 mb-6">
            Design and customize quizzes with questions, options, and scoring
            rules.
          </p>
        </div>

        <div className="flex items-center justify-end py-3 px-4 rounded-lg">
          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
          >
            Create Quiz
          </button>
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 mt-6 w-full overflow">
          <div className="bg-blue-900 text-yellow-400 text-xl font-bold p-4 rounded-t-lg flex justify-between items-center">
            <span>{selectedYear}</span>
            <select
              id="yearDropdown"
              value={selectedYear}
              onChange={selectYear}
              className="p-2 border rounded-lg bg-white text-blue-900"
            >
              {Object.keys(yearSubjects).map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 border border-gray-200 rounded-b-lg">
            {yearSubjects[selectedYear].map((subject, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{subject.code}</h3>
                    <p className="text-gray-500 text-sm">{subject.name}</p>
                  </div>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="text-gray-600"
                  >
                    {openDropdown === index ? "▲" : "▼"}
                  </button>
                </div>
                <div
                  className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                    openDropdown === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="py-2 text-gray-700">
                    {lessons.map((lesson) => (
                      <p
                        key={lesson.id}
                        className="cursor-pointer text-blue-600 hover:underline"
                        onClick={() => handleLessonClick(lesson)}
                      >
                        {lesson.title}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <VerticalBarChart />
        </div>
      </main>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelectOption={handleQuizModalSelect}
      />

      {/* Question Repository Modal */}
      <QuestionRepoModal
        isOpen={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        onSelect={handleRepoModalSelect}
      />
    </motion.div>
  );
};

export default QuizmanagementPage;
