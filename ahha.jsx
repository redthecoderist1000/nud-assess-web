import React, { useState } from "react";
import SampleIcon from "../../assets/images/sampleicon.png";
import PerformanceChart from "../elements/PerformanceChart";

const ReportAndAnalyticsPage = () => {
  // State for active tab (Overall, Class, Quiz, etc.)
  const [activeTab, setActiveTab] = useState("Overall");

  // State for active year in YearTabs
  const [activeYear, setActiveYear] = useState(null);

  return (
    <main className="flex-1 p-6 mt-12 md:mt-0">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-2">Reports And Analytics</h1>
        <p className="text-gray-600">
          Monitor quiz performance and student engagement.
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex space-x-4 mt-8">
        {["Overall", "Class", "Quiz", "Question", "Students"].map((tab) => (
          <a
            key={tab}
            href="#"
            className={`cursor-pointer ${
              activeTab === tab ? "text-yellow-500 font-bold" : ""
            } hover:text-amber-500`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </a>
        ))}
      </nav>

      {/* Content based on active tab */}
      <div className="mt-8">
        {activeTab === "Overall" && (
          <div>
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
              <h2 className="text-xl font-bold mb-4">
                Overall performance overview
              </h2>
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
          </div>
        )}

        {activeTab === "Class" && (
          <div>
            {/* Year Tabs */}
            <div className="mb-8">
              <div className="flex space-x-4 justify-between w-full mt-4">
                {/* 1st Year Button */}
                <button
                  onClick={() => setActiveYear("1st")}
                  className={`${
                    activeYear === "1st"
                      ? "bg-yellow-600 text-black"
                      : "bg-yellow-500 hover:bg-yellow-400 text-black"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  1st Year
                </button>

                {/* 2nd Year Button */}
                <button
                  onClick={() => setActiveYear("2nd")}
                  className={`${
                    activeYear === "2nd"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  2nd Year
                </button>

                {/* 3rd Year Button */}
                <button
                  onClick={() => setActiveYear("3rd")}
                  className={`${
                    activeYear === "3rd"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-500 hover:bg-gray-400 text-white"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  3rd Year
                </button>

                {/* 4th Year Button */}
                <button
                  onClick={() => setActiveYear("4th")}
                  className={`${
                    activeYear === "4th"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500 hover:bg-purple-400 text-white"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  4th Year
                </button>
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
          </div>
        )}

        {activeTab === "Quiz" && (
          <div>
            {/* YearTabs */}
            <div className="mb-8">
              <div className="flex space-x-4 justify-between w-full mt-4">
                {/* 1st Year Button */}
                <button
                  onClick={() => setActiveYear("1st")}
                  className={`${
                    activeYear === "1st"
                      ? "bg-yellow-600 text-black"
                      : "bg-yellow-500 hover:bg-yellow-400 text-black"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  1st Year
                </button>

                {/* 2nd Year Button */}
                <button
                  onClick={() => setActiveYear("2nd")}
                  className={`${
                    activeYear === "2nd"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  2nd Year
                </button>

                {/* 3rd Year Button */}
                <button
                  onClick={() => setActiveYear("3rd")}
                  className={`${
                    activeYear === "3rd"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-500 hover:bg-gray-400 text-white"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  3rd Year
                </button>

                {/* 4th Year Button */}
                <button
                  onClick={() => setActiveYear("4th")}
                  className={`${
                    activeYear === "4th"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500 hover:bg-purple-400 text-white"
                  } px-6 py-3 rounded-lg font-semibold transition duration-300`}
                >
                  4th Year
                </button>
              </div>
            </div>

            {/* Quiz Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lesson List */}
              <div className="bg-white p-4 rounded shadow h-[400px]">
                <h2 className="text-lg font-bold mb-2">Lesson List</h2>
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

              {/* Right Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quiz Average Score */}
                <div className="bg-white p-4 rounded shadow h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Quiz Average Score</h2>
                  {/* Placeholder content */}
                  <p className="text-gray-600">Content goes here...</p>
                </div>

                {/* Quiz Pass Rate */}
                <div className="bg-white p-4 rounded shadow h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Quiz Pass Rate</h2>
                  {/* Placeholder content */}
                  <p className="text-gray-600">Content goes here...</p>
                </div>

                {/* Hardest and Easiest Quiz */}
                <div className="bg-white p-4 rounded shadow h-[400px]">
                  <h2 className="text-lg font-bold mb-2">Hardest and Easiest Quiz</h2>
                  {/* Placeholder content */}
                  <p className="text-gray-600">Content goes here...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ReportAndAnalyticsPage;