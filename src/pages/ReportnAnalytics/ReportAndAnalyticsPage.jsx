import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Class from "./tabs/Class";
import Quiz from "./tabs/Quiz";
import Question from "./tabs/Question";
import { Container } from "@mui/material";

const ReportAndAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("Class");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Class":
        return <Class />;
      case "Quiz":
        return <Quiz />;
      case "Question":
        return <Question />;
      default:
        return <Class />;
    }
  };

  return (
    <Container maxWidth="xl" className="my-5">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-2">Reports And Analytics</h1>
        <p className="text-gray-600">
          Monitor quiz performance and student engagement.
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex space-x-4 mt-8">
        {["Class", "Quiz", "Question"].map((tab) => (
          <button
            key={tab}
            className={`cursor-pointer ${
              activeTab === tab ? "text-yellow-500 font-bold" : ""
            } hover:text-amber-500`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

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
