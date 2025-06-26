import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VerticalBarChart from "../ReportnAnalytics/components/VerticalBarChart";
import QuestionRepoModal from "./components/QuestionRepoModal";
import { Box, Card, Tab, Tabs } from "@mui/material";
import MyQuestionTab from "./questionmanagementTabs/MyQuestionTab";

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

const QuestionManagementPage = () => {
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <motion.div
      className="flex h-screen overflow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <main className="flex-1 p-6 min-h-screen flex flex-col">
        <div>
          <h1 className="text-5xl font-bold mb-4">Question Management</h1>
          <p className="text-gray-600 mb-6">
            Design and customize quizzes with questions, options, and scoring
            rules.
          </p>
        </div>

        <div className="flex items-center justify-end py-3 px-4 rounded-lg">
          <div className="flex space-x-4">
            <button
              className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              onClick={() => setRepoModalOpen(true)}
            >
              <span>Create Questions</span>
            </button>
          </div>
        </div>

        <Card>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs"
              >
                <Tab label="My Questions" />
                <Tab label="Shared Quizzes" />
              </Tabs>
            </Box>
            {/* my question tab */}
            <CustomTabPanel value={value} index={0}>
              <MyQuestionTab />
            </CustomTabPanel>
            {/* shared tab */}
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
          </Box>
        </Card>

        <QuestionRepoModal
          isOpen={repoModalOpen}
          onClose={() => setRepoModalOpen(false)}
          onSelect={(selectedRepo) => {
            setRepoModalOpen(false); // Close the modal
            navigate("/GenerateQuestion", {
              state: { repository: selectedRepo }, // Pass the selected repository
            });
          }}
        />
      </main>
    </motion.div>
  );
};

export default QuestionManagementPage;
