import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import createIcon from "../../assets/images/create_icon.png";
import profilePic from "../../assets/images/sample_profile.png";
import bookmarkIcon from "../../assets/images/bookmark.png";
import LineChart from "../elements/LineChart";
import HorizontalLineChart from "../elements/HorizontalLineChart";
import DoughnutChart from "../elements/DoughnutChart";
import { userContext } from "../../App";
import QuizModal from "../elements/QuizModal";
import QuestionRepoModal from "../elements/QuestionRepoModal";
import CreateClass from "../elements/CreateClass";
import TOS from "./TOS";

const DashboardPage = () => {
  const navigate = useNavigate();
  const userCon = useContext(userContext);

  // State for modals
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [createClassOpen, setCreateClassOpen] = useState(false);
  const [modalSource, setModalSource] = useState(null); // "quiz" or "question"
  const [showTOS, setShowTOS] = useState(false); // State to show TOS

  const handleButtonClick = (buttonName) => {
    if (buttonName === "Create Quiz") {
      setModalSource("quiz");
      setQuizModalOpen(true);
    } else if (buttonName === "Create Questions") {
      setModalSource("question");
      setRepoModalOpen(true);
    } else if (buttonName === "Create Class") {
      setCreateClassOpen(true);
    }
  };

  const handleQuizOption = (option) => {
    setQuizModalOpen(false);
    if (modalSource === "quiz") {
      setRepoModalOpen(true);
    }
  };

  const handleRepoSelect = (selectedOption) => {
    setRepoModalOpen(false);
    if (modalSource === "quiz") {
      setShowTOS(true); // Show TOS first
    } else if (modalSource === "question") {
      setModalSource(null);
      navigate("/dashboard/CreateQuestionAutomatically");
    }
  };

  const handleTOSNext = () => {
    setShowTOS(false); // Hide TOS
    navigate("/dashboard/CreateAutomatically"); // Navigate to CreateAutomatically
  };

  const handleCreateClassSave = (newClassData) => {
    setCreateClassOpen(false);
  };

  if (showTOS) {
    return <TOS onNext={handleTOSNext} />;
  }

  return (
    <motion.main
      className="flex-1 p-6 mt-12 md:mt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="mb-6 flex justify-between items-center w-full px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Monitor quiz performance and student engagement.
          </p>
        </div>
        <div className="inline-flex items-center px-6 p-2 border border-gray-300 rounded-full shadow-sm">
          <img
            src={profilePic}
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div className="flex flex-col">
            <span className="text-black font-semibold text-sm">
              {userCon.user.f_name + " " + userCon.user.l_name}
            </span>
            <span className="text-gray-400 text-xs">{userCon.user.role}</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4 px-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {["Create Quiz", "Create Questions", "Create Class"].map((text, index) => (
          <motion.button
            key={index}
            onClick={() => handleButtonClick(text)}
            className="flex items-center justify-center w-52 h-15 bg-[#35408E] text-white px-4 py-2 rounded hover:bg-[#2c357e] transition duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
          >
            <img src={createIcon} alt="Create Icon" className="w-5 h-5 mr-2" />
            <span>{text}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-4 gap-4 p-4 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {[
          "Total Quizzes",
          "Active Quizzes",
          "Total Questions",
          "Total Students",
        ].map((label, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-start justify-center p-8 rounded-lg border border-gray-300 shadow-xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.2 }}
          >
            <span className="text-gray-500 flex items-center gap-2 mb-2">
              <img src={bookmarkIcon} alt="Icon" className="w-5 h-5" />
              {label}
            </span>
            <span className="text-2xl font-bold">
              {[25, 30, 2940, 100][index]}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="p-4 w-full mt-6 bg-white shadow-lg rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Performance Overview</h2>
        <LineChart />
      </motion.div>

      <motion.div
        className="mt-6 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <HorizontalLineChart />
        <DoughnutChart />
      </motion.div>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        onSelectOption={handleQuizOption}
      />

      {/* Question Repo Modal */}
      <QuestionRepoModal
        isOpen={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        onSelect={handleRepoSelect}
      />

      {/* Create Class Modal */}
      {createClassOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
            <CreateClass
              onSave={handleCreateClassSave}
              onCancel={() => setCreateClassOpen(false)}
            />
          </div>
        </div>
      )}
    </motion.main>
  );
};

export default DashboardPage;