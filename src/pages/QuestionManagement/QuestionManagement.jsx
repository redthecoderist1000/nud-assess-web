import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Box, Container, Stack } from "@mui/material";

import MyQuestionTab from "./questionmanagementTabs/MyQuestionTab";
import SharedQuestionTab from "./questionmanagementTabs/SharedQuestionTab";
import CreateDialog from "../../components/elements/CreateDialog";

const QuestionManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createDialog, setCreateDialog] = useState(false);
  const tabParam = searchParams.get("tab") ?? 0;

  const [activeTab, setActiveTab] = useState(parseInt(tabParam, 10));

  const changeTab = (event) => {
    setActiveTab(event);
    setSearchParams({ tab: event }, { replace: true });
  };

  return (
    <Container maxWidth="xl" className="my-5">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-0">
                Questions
              </h1>
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
              onClick={() => setCreateDialog(true)}
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
              Create Questions
            </button>
          </Box>
          <Box sx={{ borderBottom: "1px solid #e5e7eb", mx: 2, mb: 2 }} />

          {/* Pass backend stats to TetraBox */}
          {/* <TetraBox stats={tetraStats} /> */}
          <Stack rowGap={4}>
            {/* Custom Tabs (styled like ReportAndAnalytics) */}
            <div className="w-full flex justify-center mb-2 mt-5">
              <div
                className="w-full rounded-full"
                style={{
                  background: "#f3f4f6",
                  padding: "4px",
                  display: "flex",
                  border: "none",
                  boxSizing: "border-box",
                }}
              >
                {[
                  { label: "My Questions", key: 0 },
                  { label: "Shared Questions", key: 1 },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex-1 py-2 text-center rounded-full font-bold transition-colors
                    ${activeTab === tab.key ? "bg-white text-black shadow-sm" : "text-gray-700"}
                  `}
                    style={{
                      margin: "2px",
                      background:
                        activeTab === tab.key ? "#fff" : "transparent",
                      border: "none",
                      borderRadius: 9999,
                      boxShadow:
                        activeTab === tab.key
                          ? "0 1px 4px rgba(0,0,0,0.03)"
                          : "none",
                      minWidth: 0,
                    }}
                    onClick={() => changeTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content: Make table scrollable, page fixed */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {activeTab === 0 && <MyQuestionTab />}
              {activeTab === 1 && <SharedQuestionTab />}
            </Box>
          </Stack>
        </main>
      </motion.div>

      <CreateDialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        type="question"
      />
    </Container>
  );
};

export default QuestionManagementPage;
