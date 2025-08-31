import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Class from "./tabs/Class";
import Quiz from "./tabs/Quiz";
import Question from "./tabs/Question";
import FilterAnalytics from "./components/FilterAnalytics";
import TetraBox from "./components/TetraBox";
import { Box, CircularProgress, Container } from "@mui/material";
import { supabase } from "../../helper/Supabase";

const ReportAndAnalyticsPage = () => {
  // Use "QuizReports" and "QuestionAnalysis" for tab keys
  const [activeTab, setActiveTab] = useState("quiz");
  const [filter, setFilter] = useState({
    class_id: "",
    start_time: "2025-07-15 06:30:15.928965+00",
    end_time: "2025-08-19 11:36:47.1426+00",
  });
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    if (filter.class_id == "") {
      return;
    }

    if (activeTab == "quiz") fetchQuizData();
    // distribution, bloom_tax, perf_by_quiz
  }, [filter, activeTab]);

  const fetchQuizData = async () => {
    setAnalyticsData({});

    const { data, error } = await supabase
      .rpc("get_quiz_analytics", {
        p_class_id: filter.class_id,
        p_start_time: filter.start_time,
        p_end_time: filter.end_time,
      })
      .single();

    if (error) {
      console.log("error fetching analytics:", error);
      return;
    }
    console.log(data);
    setAnalyticsData(data);
  };

  const renderTabContent = () => {
    if (!analyticsData || Object.keys(analyticsData).length === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
          <CircularProgress />
        </Box>
      );
    }

    switch (activeTab) {
      case "quiz":
        return <Quiz analyticsData={analyticsData} />;
      case "question":
        return <Question analyticsData={analyticsData} />;
      default:
        return <Quiz analyticsData={analyticsData} />;
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

      <FilterAnalytics filter={filter} setFilter={setFilter} />
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
