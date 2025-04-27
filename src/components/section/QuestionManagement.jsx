import React, { useState } from "react";
import { Link } from "react-router-dom";
import manuallyIcon from "../../assets/images/manually.png";
import automaticallyIcon from "../../assets/images/automatically.png";
import firstYearIcon from "../../assets/images/1st.png";
import secondYearIcon from "../../assets/images/2nd.png";
import thirdYearIcon from "../../assets/images/3rd.png";
import fourthYearIcon from "../../assets/images/4th.png";
import VerticalBarChart from "../elements/VerticalBarChart";
import { motion } from "framer-motion";

const QuestionManagementPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState("1st Year");

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const selectYear = (year) => {
    setSelectedYear(year);
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

  const yearButtons = [
    { year: "1st Year", color: "bg-gray-600", icon: firstYearIcon },
    { year: "2nd Year", color: "bg-blue-900", icon: secondYearIcon },
    { year: "3rd Year", color: "bg-gray-600", icon: thirdYearIcon },
    { year: "4th Year", color: "bg-[#2D3B87]", icon: fourthYearIcon },
  ];

  return (
    <motion.div
      className="flex h-screen overflow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <main className="flex-1 p-6 min-h-screen flex flex-col justify-between">
        <div>
          <h1 className="text-5xl font-bold mb-4">Question Management</h1>
          <p className="text-gray-600 mb-6">
            Design and customize quizzes with questions, options, and scoring
            rules.
          </p>
        </div>

        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gradient-to-r from-gray-500 to-yellow-300">
          <span className="text-lg font-semibold text-gray-900">
            Create new question?
          </span>
          <div className="flex space-x-4">
            {/* <Link
              to="/dashboard/CreateManually"
              className="flex items-center space-x-2 text-gray-800 font-medium hover:text-gray-900"
            >
              <span>Create manually</span>
              <motion.img
                src={manuallyIcon}
                className="w-10"
                alt="Manual"
                whileHover={{ scale: 1.2, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </Link> */}
            <Link
              to="/dashboard/CreateAutomatically"
              className="flex items-center space-x-2 text-gray-800 font-medium hover:text-gray-900"
            >
              <span>Create automatically</span>
              <motion.img
                src={automaticallyIcon}
                className="w-10"
                alt="Auto"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          {yearButtons.map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all duration-300 ${item.color} hover:scale-110 hover:shadow-2xl ${selectedYear === item.year ? "ring-4 ring-yellow-300" : ""}`}
              whileHover={{ scale: 1.1, rotate: 1 }}
              onClick={() => selectYear(item.year)}
            >
              <h2 className="text-xl font-bold text-yellow-400">{item.year}</h2>
              <img src={item.icon} alt={item.year} className="w-40 mt-2" />
            </motion.div>
          ))}
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow-lg border mt-6 w-full overflow">
          <div className="bg-blue-900 text-yellow-400 text-xl font-bold p-4 rounded-t-lg">
            {selectedYear}
          </div>
          <div className="p-4">
            {yearSubjects[selectedYear].map((subject, index) => (
              <div key={index} className="border-b py-2">
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
                  className={`transition-max-height duration-300 ease-in-out overflow-hidden ${openDropdown === index ? "max-h-40" : "max-h-0"}`}
                >
                  <div className="py-2 text-gray-700">
                    <p>Lesson 1 - Introduction</p>
                    <p>Lesson 2 - Fundamentals</p>
                    <p>Lesson 3 - Advanced Topics</p>
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
    </motion.div>
  );
};

export default QuestionManagementPage;
