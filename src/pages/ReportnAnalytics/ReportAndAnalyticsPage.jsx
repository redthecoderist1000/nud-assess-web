import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Class from "./tabs/Class";
import Quiz from "./tabs/Quiz";
import Question from "./tabs/Question";
import FilterAnalytics from "./components/FilterAnalytics";
import TetraBox from "./components/TetraBox";
import { Container } from "@mui/material";

const ReportAndAnalyticsPage = () => {
  // Use "QuizReports" and "QuestionAnalysis" for tab keys
  const [activeTab, setActiveTab] = useState("QuizReports");

  const renderTabContent = () => {
    switch (activeTab) {
      case "QuizReports":
        return <Quiz />;
      case "QuestionAnalysis":
        return <Question />;
      default:
        return <Quiz />;
    }
  };

  return (
    <Container maxWidth="xl" className="my-5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-6 pb-2">
        <h1 className="text-5xl font-bold mb-4">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Analytics and performance insights
        </p>
      </div>

      <FilterAnalytics />
      <TetraBox />

      {/* Custom Tabs */}
      <div className="w-full flex justify-center mt-8">
        <div
          className="w-full"
          style={{
            background: "#f3f3f7",
            borderRadius: 16,
            padding: "4px",
            display: "flex",
            border: "none",
            boxSizing: "border-box",
          }}
        >
          {[
            { label: "Quiz Reports", key: "QuizReports" },
            { label: "Question Analysis", key: "QuestionAnalysis" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 text-center py-2 text-[15px] font-medium transition-colors rounded-full
                ${activeTab === tab.key ? "bg-white text-black" : "text-gray-700"}
              `}
              style={{
                margin: "2px",
                background: activeTab === tab.key ? "#fff" : "transparent",
                border: "none",
                borderRadius: 9999,
                boxShadow:
                  activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.03)" : "none",
                minWidth: 0,
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Container>
  );
};

export default ReportAndAnalyticsPage;
