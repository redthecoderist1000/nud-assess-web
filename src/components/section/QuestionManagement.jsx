import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VerticalBarChart from "../elements/VerticalBarChart";
import QuestionRepoModal from "../elements/QuestionRepoModal";
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
            {/* <button
              className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              onClick={() => setRepoModalOpen(true)}
            >
              <span>Create Questions</span>
            </button> */}
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
                {/* <Tab label="Shared Quizzes" /> */}
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <MyQuestionTab />
            </CustomTabPanel>
            {/* <CustomTabPanel value={value} index={1}>
                      Item Two
                    </CustomTabPanel> */}
          </Box>
        </Card>

        {/* <div className="col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 mt-6 w-full overflow">
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
          <div className="p-4">
            {yearSubjects[selectedYear].map((subject, index) => (
              <div key={index} className="border-b border-gray-200 py-2">
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
        </div> */}

        {/* <div className="mt-6">
          <VerticalBarChart />
        </div> */}

        <QuestionRepoModal
          isOpen={repoModalOpen}
          onClose={() => setRepoModalOpen(false)}
          onSelect={(selectedRepo) => {
            setRepoModalOpen(false); // Close the modal
            navigate("/dashboard/CreateQuestionAutomatically", {
              state: { repository: selectedRepo }, // Pass the selected repository
            });
          }}
        />
      </main>
    </motion.div>
  );
};

export default QuestionManagementPage;
