import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionRepoModal from "./components/QuestionRepoModal";

import { Box, Card, Container, Tab, Tabs } from "@mui/material";

import MyQuestionTab from "./questionmanagementTabs/MyQuestionTab";
import TetraBox from "./components/TetraBox";
import { supabase } from "../../helper/Supabase";

const QuestionManagementPage = () => {
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("MyQuestions");

  // Backend stats for TetraBox
  const [tetraStats, setTetraStats] = useState({
    myQuestions: 0,
    myQuestionsDelta: 0,
    sharedQuestions: 0,
    totalUsage: 0,
    avgUsage: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // My Questions count
      const { data: myQuestions } = await supabase
        .from("questions")
        .select("id", { count: "exact" })
        .eq("owner_id", supabase.auth.user()?.id);

      // Shared Questions count
      const { data: sharedQuestions } = await supabase
        .from("questions")
        .select("id", { count: "exact" })
        .eq("is_shared", true);

      // Total Usage (sum of usage_count column)
      const { data: usageData } = await supabase
        .from("questions")
        .select("usage_count");

      // Calculate stats
      const myQuestionsCount = myQuestions?.length || 0;
      const sharedQuestionsCount = sharedQuestions?.length || 0;
      const totalUsage = usageData ? usageData.reduce((sum, q) => sum + (q.usage_count || 0), 0) : 0;
      const avgUsage = myQuestionsCount > 0
        ? Math.round(totalUsage / myQuestionsCount)
        : 0;

      const myQuestionsDelta = 3;

      setTetraStats({
        myQuestions: myQuestionsCount,
        myQuestionsDelta,
        sharedQuestions: sharedQuestionsCount,
        totalUsage,
        avgUsage,
      });
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="xl" className="my-5" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <motion.div
        className="flex flex-col h-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%" }}
      >
        <main className="flex-1 min-h-0 flex flex-col">
          {/* Top section styled like the image, with button at top right */}
          <Box
            sx={{
              mb: 2,
              pt: 4,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <h1 className="text-2xl font-bold text-gray-900 mb-0">Questions</h1>
              <p className="text-sm text-gray-500 mt-1 mb-0">
                Manage your test bank and track student performance
              </p>
            </Box>
            <button
              type="button"
              className="flex items-center gap-2 bg-[#4854a3] hover:bg-[#2C388F] text-white font-medium py-1.5 px-3 rounded-lg text-sm"
              style={{
                border: "none",
                cursor: "pointer",
                boxShadow: "none",
                transition: "background 0.2s",
              }}
              onClick={() => setRepoModalOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="3" stroke="white" />
                <line x1="8" y1="8" x2="16" y2="8" stroke="white" strokeLinecap="round" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeLinecap="round" />
                <line x1="8" y1="16" x2="12" y2="16" stroke="white" strokeLinecap="round" />
              </svg>
              Create Questions
            </button>
          </Box>
          <Box sx={{ borderBottom: "1px solid #e5e7eb", mx: 2, mb: 2 }} />

          {/* Pass backend stats to TetraBox */}
          <TetraBox stats={tetraStats} />

          {/* Custom Tabs (styled like ReportAndAnalytics) */}
          <div className="w-full flex justify-center mb-2 mt-5">
            <div
              className="w-full"
              style={{
                background: "#f3f4f6",
                borderRadius: 16,
                padding: "4px",
                display: "flex",
                border: "none",
                boxSizing: "border-box",
              }}
            >
              {[
                { label: "MY QUESTIONS", key: "MyQuestions" },
                { label: "SHARED QUESTIONS", key: "SharedQuestions" },
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
                    boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.03)" : "none",
                    minWidth: 0,
                  }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content: Make table scrollable, page fixed */}
          <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {activeTab === "MyQuestions" && (
              <Card sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <MyQuestionTab />
                </Box>
              </Card>
            )}
            {activeTab === "SharedQuestions" && (
              <Card variant="outlined" sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {/* Replace with your shared questions tab component */}
                  Item Two
                </Box>
              </Card>
            )}
          </Box>


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
    </Container>
  );
};

export default QuestionManagementPage;