import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Class from "./tabs/Class";
import Quiz from "./tabs/Quiz";
import Question from "./tabs/Question";
import FilterAnalytics from "./components/FilterAnalytics";
import TetraBox from "./components/TetraBox";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { supabase } from "../../helper/Supabase";
import { userContext } from "../../App";

const ReportAndAnalyticsPage = () => {
  const { setSnackbar } = useContext(userContext);
  const [activeTab, setActiveTab] = useState("quiz");
  const [filter, setFilter] = useState({
    // class_id: "",
    start_time: "all",
  });
  const [generalData, setGeneralData] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const [generalLoading, setGeneralLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasGeneral, setHasGeneral] = useState(true);
  const [hasResult, setHasResult] = useState(true);

  useEffect(() => {
    if (filter.class_id == "") {
      return;
    }
    fetchGeneralData();
  }, [filter]);

  useEffect(() => {
    if (filter.class_id == "") {
      return;
    }

    if (activeTab == "quiz") fetchQuizData();
    if (activeTab == "question") fetchQuestionData();

    // distribution, bloom_tax, perf_by_quiz
  }, [filter, activeTab]);

  const fetchGeneralData = async () => {
    setGeneralLoading(true);
    const exists = await checkHasResult();
    setHasGeneral(exists);
    if (!exists) {
      setGeneralLoading(false);
      return;
    }

    if (filter.start_time == "all") {
      const { data, error } = await supabase
        .rpc("get_general_analytics", {
          p_class_id: filter.class_id,
        })
        .single();

      if (error) {
        console.log("error fetching analytics:", error);
        return;
      }
      setGeneralData(data);
    } else {
      const days7 = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      const days30 = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      const { data, error } = await supabase
        .rpc("get_general_analytics", {
          p_class_id: filter.class_id,
          p_start_time: filter.start_time == "7" ? days7 : days30,
        })
        .single();

      if (error) {
        console.log("error fetching analytics:", error);
        return;
      }
      setGeneralData(data);
    }

    setGeneralLoading(false);
  };

  const fetchQuizData = async () => {
    // setAnalyticsData({});
    setLoading(true);

    const exists = await checkHasResult();
    setHasResult(exists);
    if (!exists) {
      setLoading(false);
      return;
    }

    if (filter.start_time == "all") {
      const { data, error } = await supabase
        .rpc("get_quiz_analytics", {
          p_class_id: filter.class_id,
        })
        .single();

      if (error) {
        setSnackbar({
          open: true,
          message: "Error fetching quiz analytics.",
          severity: "error",
        });
        return;
      }
      setAnalyticsData(data);
    } else {
      const days7 = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      const days30 = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      const { data, error } = await supabase
        .rpc("get_quiz_analytics", {
          p_class_id: filter.class_id,
          p_start_time: filter.start_time == "7" ? days7 : days30,
        })
        .single();

      if (error) {
        setSnackbar({
          open: true,
          message: "Error fetching quiz analytics.",
          severity: "error",
        });
        return;
      }
      setAnalyticsData(data);
    }
    setLoading(false);
  };

  const fetchQuestionData = async () => {
    setLoading(true);
    const exists = await checkHasResult();
    setHasResult(exists);
    if (!exists) {
      setLoading(false);
      return;
    }

    //
    if (filter.start_time == "all") {
      const { data, error } = await supabase
        .rpc("get_question_analytics", {
          p_class_id: filter.class_id,
        })
        .single();

      if (error) {
        setSnackbar({
          open: true,
          message: "Error fetching question analytics.",
          severity: "error",
        });
        return;
      }
      setAnalyticsData(data);
    } else {
      const days7 = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      const days30 = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      const { data, error } = await supabase
        .rpc("get_question_analytics", {
          p_class_id: filter.class_id,
          p_start_time: filter.start_time == "7" ? days7 : days30,
        })
        .single();

      if (error) {
        setSnackbar({
          open: true,
          message: "Error fetching question analytics.",
          severity: "error",
        });
        return;
      }
      setAnalyticsData(data);
    }

    setLoading(false);
  };

  const checkHasResult = async () => {
    if (filter.class_id == "" || !filter.class_id) {
      return false;
    }

    const { data: classExamId, error: classExamErr } = await supabase
      .from("tbl_class_exam")
      .select("id")
      .eq("class_id", filter.class_id);

    const ids = (classExamId || []).map((e) => e.id);
    if (ids.length === 0) {
      /* no matches */
      return false;
    }

    const { data: resultData, error } = await supabase
      .from("tbl_result")
      .select("id")
      .in("class_exam_id", ids)
      .limit(1);

    if (error) {
      setSnackbar({
        open: true,
        message: "Error checking results.",
        severity: "error",
      });
      return false;
    }

    return (resultData?.length || 0) > 0;
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
          <CircularProgress />
        </Box>
      );
    }
    if (!hasResult) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
          <Typography color="textDisabled">
            No data available for the selected class and time range.
          </Typography>
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
    <Container maxWidth="xl" sx={{ my: 5 }}>
      {/* Header */}

      <div className="w-full bg-white border-b border-gray-200 py-3 mb-3 flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-0">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-0">
            Analytics and performance insights
          </p>
        </div>
      </div>

      <FilterAnalytics
        filter={filter}
        setFilter={setFilter}
        generalData={generalData}
        analyticsData={analyticsData}
        hasResult={checkHasResult}
      />
      {generalLoading ? (
        <></>
      ) : hasGeneral ? (
        <TetraBox generalData={generalData} />
      ) : (
        <></>
      )}

      {/* Custom Tabs */}
      <div className="w-full flex justify-center mt-5">
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
            { label: "Quiz Reports", key: "quiz" },
            { label: "Question Analysis", key: "question" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 py-2 text-center rounded-full font-bold transition-colors
                ${activeTab === tab.key ? "bg-white text-black shadow-sm" : "text-gray-700"}
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
