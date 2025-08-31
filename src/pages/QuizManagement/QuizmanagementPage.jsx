import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuizModal from "./components/QuizModal";
import QuestionRepoModal from "../QuestionManagement/components/QuestionRepoModal";
import TetraBox from "./components/TetraBox";
import Tosifier from "./components/Tosifier";
import { Box, Card, Container, Tab, Tabs, Typography } from "@mui/material";
import MyQuizTab from "./quizmanagementTabs/MyQuizTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const QuizmanagementPage = () => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [value, setValue] = useState(0);

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
    setShowTOS(true);
  };

  if (showTOS) {
    return (
      <Tosifier quizDetail={quizDetail} onCancel={() => setShowTOS(false)} />
    );
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl" className="my-5">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-0">Exams</h1>
              <p className="text-sm text-gray-500 mt-1 mb-0">
                Manage your test bank and track student performance
              </p>
            </div>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="flex items-center gap-2 bg-[#4854a3] hover:bg-[#2C388F] text-white font-medium py-1.5 px-3 rounded-lg text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="3" stroke="white" />
                <line x1="8" y1="8" x2="16" y2="8" stroke="white" strokeLinecap="round" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeLinecap="round" />
                <line x1="8" y1="16" x2="12" y2="16" stroke="white" strokeLinecap="round" />
              </svg>
              Create Quiz
            </button>
          </div>

          <TetraBox />

          <Card variant="outlined" sx={{ mt: 3 }}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#2C388F" strokeWidth="2" />
                          <path d="M8 10h8M8 14h5" stroke="#2C388F" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#222" }}>
                          My Exams
                        </Typography>
                      </Box>
                    }
                  />
                  {/* <Tab label="Shared Quizzes" /> */}
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <MyQuizTab />
              </CustomTabPanel>
              {/* <CustomTabPanel value={value} index={1}>
                Item Two
              </CustomTabPanel> */}
            </Box>
          </Card>
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