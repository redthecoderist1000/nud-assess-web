import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import QuizModal from "./components/QuizModal";
import QuestionRepoModal from "../QuestionManagement/components/QuestionRepoModal";
import Tosifier from "./tosPage/Tosifier";
import {
  Box,
  Card,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MyQuizTab from "./quizmanagementTabs/MyQuizTab";
import SharedQuizTab from "./quizmanagementTabs/SharedQuizTab";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <>{children}</>}
    </div>
  );
}

const QuizmanagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const tabParam = searchParams.get("tab") ?? 0;
  const [value, setValue] = useState(parseInt(tabParam, 10));

  const [quizDetail, setQuizDetail] = useState({
    repository: "",
    mode: "",
  });

  const navigate = useNavigate();

  const handleQuizModalSelect = (mode) => {
    setQuizDetail({ ...quizDetail, mode: mode });
    setIsQuizModalOpen(false);
    setIsRepoModalOpen(true);
  };

  const handleRepoModalSelect = (repo) => {
    setQuizDetail({ ...quizDetail, repository: repo });
    setIsRepoModalOpen(false);

    const params = new URLSearchParams({
      mode: quizDetail.mode,
      repository: repo,
    });
    navigate(`/quiz-detail?${params.toString()}`);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
    setSearchParams({ tab: newValue }, { replace: true });
  };

  return (
    <Container maxWidth="xl" sx={{ my: 5 }}>
      <motion.div
        className="flex h-screen overflow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <main className="flex-1 min-h-screen flex flex-col justify-start">
          {/* Top section compact */}
          <div className="bg-white border-b border-gray-200 py-3 mb-6 flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-0">Quizzes</h1>
              <p className="text-sm text-gray-500 mt-1 mb-0">
                Manage your test bank and track student performance
              </p>
            </div>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="flex items-center gap-2 bg-[#4854a3] hover:bg-[#2C388F] text-white font-medium py-1.5 px-3 rounded-lg text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="3"
                  stroke="white"
                />
                <line
                  x1="8"
                  y1="8"
                  x2="16"
                  y2="8"
                  stroke="white"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="12"
                  x2="16"
                  y2="12"
                  stroke="white"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="16"
                  x2="12"
                  y2="16"
                  stroke="white"
                  strokeLinecap="round"
                />
              </svg>
              Create Quiz
            </button>
          </div>

          {/* <Card variant="outlined" sx={{ mt: 3 }}> */}
          {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}> */}

          {/* Custom Tabs */}
          <Stack rowGap={4}>
            <div className="w-full flex justify-center mt-5">
              <div
                className="w-full rounded-full"
                style={{
                  background: "#f3f3f7",
                  padding: "4px",
                  display: "flex",
                  border: "none",
                  boxSizing: "border-box",
                }}
              >
                {[
                  { label: "My Quizzes", key: 0 },
                  { label: "Shared Quizzes", key: 1 },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex-1 py-2 text-center rounded-full font-bold transition-colors
                ${value === tab.key ? "bg-white text-black shadow-sm" : "text-gray-700"}
              `}
                    style={{
                      margin: "2px",
                      background: value === tab.key ? "#fff" : "transparent",
                      border: "none",
                      borderRadius: 9999,
                      boxShadow:
                        value === tab.key
                          ? "0 1px 4px rgba(0,0,0,0.03)"
                          : "none",
                      minWidth: 0,
                    }}
                    onClick={() => handleChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* </Box> */}
            <CustomTabPanel value={value} index={0}>
              <MyQuizTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <SharedQuizTab />
            </CustomTabPanel>
          </Stack>

          {/* </Card> */}
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
    </Container>
  );
};

export default QuizmanagementPage;
