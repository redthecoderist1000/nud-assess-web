import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SampleIcon from "../../assets/images/sampleicon.png";
import PerformanceChart from "../elements/PerformanceChart";

const ReportAndAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("Overall");
  const [activeYear, setActiveYear] = useState(null);

  const yearContent = {
    "1st": {
      stats: [
        "Total number of classes for 1st Year",
        "Average class performance for 1st Year",
        "Classes with highest engagement for 1st Year",
        "Classes with lowest engagement for 1st Year",
        "Total number of sections per class for 1st Year",
      ],
      largeDivs: [
        "Class with highest average score for 1st Year",
        "Class with most incorrect answers for 1st Year",
        "Class performance summary for 1st Year",
      ],
    },
    "2nd": {
      stats: [
        "Total number of classes for 2nd Year",
        "Average class performance for 2nd Year",
        "Classes with highest engagement for 2nd Year",
        "Classes with lowest engagement for 2nd Year",
        "Total number of sections per class for 2nd Year",
      ],
      largeDivs: [
        "Class with highest average score for 2nd Year",
        "Class with most incorrect answers for 2nd Year",
        "Class performance summary for 2nd Year",
      ],
    },
    "3rd": {
      stats: [
        "Total number of classes for 3rd Year",
        "Average class performance for 3rd Year",
        "Classes with highest engagement for 3rd Year",
        "Classes with lowest engagement for 3rd Year",
        "Total number of sections per class for 3rd Year",
      ],
      largeDivs: [
        "Class with highest average score for 3rd Year",
        "Class with most incorrect answers for 3rd Year",
        "Class performance summary for 3rd Year",
      ],
    },
    "4th": {
      stats: [
        "Total number of classes for 4th Year",
        "Average class performance for 4th Year",
        "Classes with highest engagement for 4th Year",
        "Classes with lowest engagement for 4th Year",
        "Total number of sections per class for 4th Year",
      ],
      largeDivs: [
        "Class with highest average score for 4th Year",
        "Class with most incorrect answers for 4th Year",
        "Class performance summary for 4th Year",
      ],
    },
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.10, ease: "easeInOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.10, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence>
      <motion.main
        className="flex-1 p-6 mt-12 md:mt-0"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
      >
        {/* Header */}
        <div>
          <motion.h1
            className="text-5xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Reports And Analytics
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Monitor quiz performance and student engagement.
          </motion.p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-4 mt-8">
          {["Overall", "Class", "Quiz", "Question", "Students"].map((tab) => (
            <motion.a
              key={tab}
              href="#"
              className={`cursor-pointer ${
                activeTab === tab ? "text-yellow-500 font-bold" : ""
              } hover:text-amber-500`}
              onClick={() => setActiveTab(tab)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {tab}
            </motion.a>
          ))}
        </nav>

        {/* Content based on active tab */}
        <div className="mt-8">
          {activeTab === "Overall" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {/* Top Statistics Boxes */}
              <div className="flex flex-wrap gap-5 mt-8 justify-between mb-8">
                {[
                  "Total number of classes",
                  "Total number of quizzes",
                  "Total number of questions",
                  "Total number of students",
                  "Total number of sections",
                ].map((title, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow flex-1">
                    <div className="flex justify-between items-center">
                      <span>{title}</span>
                      <img
                        src={SampleIcon}
                        alt="icon"
                        className="w-6 h-6 cursor-pointer"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">100</h2>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Overall performance overview</h2>
                <PerformanceChart />
              </div>
              {/* Three Large Divs in One Row */}
              <div className="flex flex-wrap gap-5 mt-8">
                {[
                  "Quiz with average score",
                  "Most incorrectly answered question",
                  "Student performance",
                ].map((title, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded shadow flex-1 h-[400px]"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">{title}</span>
                      <img
                        src={SampleIcon}
                        alt="icon"
                        className="w-6 h-6 cursor-pointer"
                      />
                    </div>
                    <p className="text-gray-600">Content goes here...</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "Class" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8,  ease: "easeOut" }}
            >
              {/* Year Tabs */}
              <div className="mb-8">
                <div className="flex space-x-4 justify-between w-full mt-4">
                  {/* 1st Year Button */}
                  <motion.button
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                  onClick={() => setActiveYear("1st")}
                  className={`${
                    activeYear === "1st"
                      ? "bg-yellow-600 text-black"
                      : "bg-yellow-500 text-black"
                  } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                >
                  1st Year
                </motion.button>

                  {/* 2nd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("2nd")}
                    className={`${
                      activeYear === "2nd"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    2nd Year
                  </motion.button>

                  {/* 3rd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("3rd")}
                    className={`${
                      activeYear === "3rd"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    3rd Year
                  </motion.button>

                  {/* 4th Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400}}
                    onClick={() => setActiveYear("4th")}
                    className={`${
                      activeYear === "4th"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    4th Year
                  </motion.button>
                </div>
              </div>

              {/* Conditional Content Based on Active Year */}
              {activeYear && (
                <div>
                  {/* Top Statistics Boxes */}
                  <div className="flex flex-wrap gap-5 mt-8 justify-between mb-8">
                    {yearContent[activeYear].stats.map((title, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded shadow flex-1"
                      >
                        <div className="flex justify-between items-center">
                          <span>{title}</span>
                          <img
                            src={SampleIcon}
                            alt="icon"
                            className="w-6 h-6 cursor-pointer"
                          />
                        </div>
                        <h2 className="text-2xl font-bold mt-2">100</h2>
                      </div>
                    ))}
                  </div>
                  {/* Performance Chart */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      {`${activeYear} Year performance overview`}
                    </h2>
                    <PerformanceChart />
                  </div>
                  {/* Three Large Divs in One Row */}
                  <div className="flex flex-wrap gap-5 mt-8">
                    {yearContent[activeYear].largeDivs.map((title, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded shadow flex-1 h-[400px]"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">{title}</span>
                          <img
                            src={SampleIcon}
                            alt="icon"
                            className="w-6 h-6 cursor-pointer"
                          />
                        </div>
                        <p className="text-gray-600">Content goes here...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Quiz Tab */}
          {activeTab === "Quiz" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8,  ease: "easeOut" }}
            >
              {/* YearTabs */}
              <div className="mb-8">
                <div className="flex space-x-4 justify-between w-full mt-4">
                  {/* 1st Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("1st")}
                    className={`${
                      activeYear === "1st"
                        ? "bg-yellow-600 text-black"
                        : "bg-yellow-500 text-black"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    1st Year
                  </motion.button>

                  {/* 2nd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("2nd")}
                    className={`${
                      activeYear === "2nd"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    2nd Year
                  </motion.button>

                  {/* 3rd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("3rd")}
                    className={`${
                      activeYear === "3rd"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    3rd Year
                  </motion.button>

                  {/* 4th Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("4th")}
                    className={`${
                      activeYear === "4th"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    4th Year
                  </motion.button>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Row */}
                <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Lesson List - {activeYear} Year</h2>
                  <div className="flex items-center justify-between mb-2">
                    <span>Lesson name</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <ul className="space-y-2">
                    <li className="bg-indigo-500 text-white p-2 rounded cursor-pointer">
                      Lesson name - lesson number - date created - total quiz
                    </li>
                    <li className="bg-gray-200 p-2 rounded cursor-pointer">
                      Lesson name - lesson number - date created - total quiz
                    </li>
                    <li className="bg-gray-200 p-2 rounded cursor-pointer">
                      Lesson name - lesson number - date created - total quiz
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Quiz Average Score</h2>
                  <p className="text-gray-600">Content goes here...</p>
                </div>
                {/* Second Row */}
                <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Quiz Pass Rate</h2>
                  <p className="text-gray-600">Content goes here...</p>
                </div>
                <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Hardest and Easiest Quiz</h2>
                  <p className="text-gray-600">Content goes here...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Question Tab */}
          {activeTab === "Question" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, ease: "easeOut" }}
            >
              {/* YearTabs */}
              <div className="mb-8">
                <div className="flex space-x-4 justify-between w-full mt-4">
                  {/* 1st Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("1st")}
                    className={`${
                      activeYear === "1st"
                        ? "bg-yellow-600 text-black"
                        : "bg-yellow-500 text-black"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    1st Year
                  </motion.button>

                  {/* 2nd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("2nd")}
                    className={`${
                      activeYear === "2nd"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    2nd Year
                  </motion.button>

                  {/* 3rd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("3rd")}
                    className={`${
                      activeYear === "3rd"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    3rd Year
                  </motion.button>

                  {/* 4th Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("4th")}
                    className={`${
                      activeYear === "4th"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    4th Year
                  </motion.button>
                </div>
              </div>

              {/* Question Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column: Quiz List */}
                <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Quiz List - {activeYear} Year</h2>
                  <div className="flex items-center justify-between mb-2">
                    <span>Lesson name</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <ul className="space-y-2">
                    <li className="bg-indigo-500 text-white p-2 rounded cursor-pointer">
                      Lesson name - lesson number - date created - total quiz
                    </li>
                    <li className="bg-gray-200 p-2 rounded cursor-pointer">
                      Quiz name - 30 questions
                    </li>
                    <li className="bg-gray-200 p-2 rounded cursor-pointer">
                      Quiz name - 30 questions
                    </li>
                  </ul>
                </div>
                {/* Right Column: Question Per Item Placement and Question Success Rate */}
                <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Question Per Item Placement - {activeYear} Year</h2>
                  <div className="h-[200px] bg-gray-200 my-4">
                    <p className="text-gray-600 text-center">Bar Graph</p>
                  </div>
                  <h2 className="text-lg font-bold mb-2">Question Success Rate</h2>
                  <div>
                    <p className="text-gray-600">Highest to Lowest</p>
                    <p className="text-gray-600">Lowest to Highest</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Students Tab */}
          {activeTab === "Students" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8,  ease: "easeOut"}}
            >
              {/* Year Tabs */}
              <div className="mb-8">
                <div className="flex space-x-4 justify-between w-full mt-4">
                  {/* 1st Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("1st")}
                    className={`${
                      activeYear === "1st"
                        ? "bg-yellow-600 text-black"
                        : "bg-yellow-500 text-black"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    1st Year
                  </motion.button>

                  {/* 2nd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("2nd")}
                    className={`${
                      activeYear === "2nd"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    2nd Year
                  </motion.button>

                  {/* 3rd Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("3rd")}
                    className={`${
                      activeYear === "3rd"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    3rd Year
                  </motion.button>

                  {/* 4th Year Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 4000, damping: 400 }}
                    onClick={() => setActiveYear("4th")}
                    className={`${
                      activeYear === "4th"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-500 text-white"
                    } px-25 py-10 rounded-lg font-semibold transition duration-300`}
                  >
                    4th Year
                  </motion.button>
                </div>
              </div>

              {/* Conditional Content Based on Active Year */}
              {activeYear && (
                <div>
                  {/* Top Statistics Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Student List */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Student List - {activeYear} Year</h2>
                      <ul className="space-y-2">
                        <li className="bg-indigo-500 text-white p-2 rounded cursor-pointer">
                          Student Name - ID - Grade Level
                        </li>
                        <li className="bg-gray-200 p-2 rounded cursor-pointer">
                          Student Name - ID - Grade Level
                        </li>
                        <li className="bg-gray-200 p-2 rounded cursor-pointer">
                          Student Name - ID - Grade Level
                        </li>
                      </ul>
                    </div>
                    {/* Score History */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Score History - {activeYear} Year</h2>
                      <p className="text-gray-600">Content goes here...</p>
                    </div>
                    {/* Student Performance Per Item Placement */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Student Performance Per Item Placement - {activeYear} Year</h2>
                      <div className="h-[200px] bg-gray-200 my-4">
                        <p className="text-gray-600 text-center">Bar Graph</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Comparison with Class Average */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Comparison with Class Average - {activeYear} Year</h2>
                      <p className="text-gray-600">Content goes here...</p>
                    </div>
                    {/* Improvement Rate */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Improvement Rate - {activeYear} Year</h2>
                      <p className="text-gray-600">Content goes here...</p>
                    </div>
                    {/* Quiz Completion Rate */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Quiz Completion Rate - {activeYear} Year</h2>
                      <div className="h-[200px] bg-gray-200 my-4">
                        <p className="text-gray-600 text-center">Donut Chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Strongest and Weakest Subject */}
                    <div className="bg-white p-4 rounded shadow border border-gray-300 h-[400px]">
                      <h2 className="text-lg font-bold mb-2">Strongest and Weakest Subject - {activeYear} Year</h2>
                      <p className="text-gray-600">Content goes here...</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.main>
    </AnimatePresence>
  );
};

export default ReportAndAnalyticsPage;