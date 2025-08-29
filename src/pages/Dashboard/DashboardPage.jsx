import React, { useContext, useState, useEffect } from "react";
import { Container } from "@mui/material";
import DashboardLead from "./component/DashboardLead";
import PerfOverview from "./component/PerfOverview/PerfOverview";
import QuizModal from "../QuizManagement/components/QuizModal";
import ExamCompletionRate from "./component/ExamCompletionRate/ExamCompletionRate";
import TOSPlacement from "../ReportnAnalytics/components/TOSPlacement";
import QuestionRepoModal from "../QuestionManagement/components/QuestionRepoModal";
import CreateClass from "../MyClasses/components/CreateClass";
import { userContext } from "../../App";
import { supabase } from "../../helper/Supabase";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const userCon = useContext(userContext);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [createClassOpen, setCreateClassOpen] = useState(false);
  const [modalSource, setModalSource] = useState(null);

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalStudents: 0,
    totalClasses: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userCon?.user?.user_id) {
        setStatsError("User is not logged in.");
        setLoadingStats(false);
        return;
      }

      try {
        setLoadingStats(true);

        const { data: quizzes, error: quizzesError } = await supabase
          .from("tbl_exam")
          .select("id")
          .eq("created_by", userCon.user.user_id);
        if (quizzesError) throw new Error(quizzesError.message);

        const { data: questions, error: questionsError } = await supabase
          .from("tbl_question")
          .select("id")
          .eq("created_by", userCon.user.user_id);
        if (questionsError) throw new Error(questionsError.message);

        const { data: classes, error: classesError } = await supabase
          .from("tbl_class")
          .select("id")
          .eq("created_by", userCon.user.user_id);
        if (classesError) throw new Error(classesError.message);

        const classIds = classes.map((cls) => cls.id);

        const { data: students, error: studentsError } = await supabase
          .from("tbl_class_members")
          .select("id")
          .in("class_id", classIds);
        if (studentsError) throw new Error(studentsError.message);

        setStats({
          totalQuizzes: quizzes.length || 0,
          totalQuestions: questions.length || 0,
          totalClasses: classes.length || 0,
          totalStudents: students.length || 0,
        });
      } catch (err) {
        setStatsError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [userCon?.user?.user_id]);

  const handleCreateQuiz = () => {
    navigate("/quizzes");
  };

  const handleCreateQuestions = () => {
    setModalSource("question");
    setRepoModalOpen(true);
  };

  const handleCreateClass = () => {
    setCreateClassOpen(true);
  };

  const handleQuizOption = () => {
    navigate("/quizzes");
  };

  const handleRepoSelect = () => {
    setRepoModalOpen(false);
    setModalSource(null);
    navigate("/CreateQuestionAutomatically");
  };

  const handleCreateClassSave = () => {
    setCreateClassOpen(false);
  };

  if (!userCon?.user?.user_id) {
    return (
      <p className="text-red-500">
        User is not logged in. Please log in to access the dashboard.
      </p>
    );
  }

  const leadStats = [
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
          <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" />
        </svg>
      ),
      value: stats.totalQuizzes,
      label: "Total Quizzes",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <path d="M12 16v-4" stroke="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
      value: stats.totalQuestions,
      label: "Total Questions",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-8 0v2" stroke="currentColor" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" />
          <path d="M5.5 17a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" />
          <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" />
        </svg>
      ),
      value: stats.totalStudents,
      label: "Total Students",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
          <path d="M7 17v-6M12 17v-2M17 17v-8" stroke="currentColor" />
        </svg>
      ),
      value: stats.totalClasses,
      label: "Total Classes",
    },
  ];

  return (
    <Container maxWidth="xl" className="my-5">
      <div className="bg-white border-b border-gray-200 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Manage your test bank and track student performance
        </p>
      </div>

      <div className="mt-6">
        <DashboardLead
          userName={userCon?.user?.full_name || "User"}
          activeExams={stats.totalQuizzes}
          newSubmissions={stats.totalStudents}
          classCount={stats.totalClasses}
          stats={leadStats}
          onCreateQuiz={handleCreateQuiz}
          onCreateQuestions={handleCreateQuestions}
          onCreateClass={handleCreateClass}
        />
      </div>

      <PerfOverview />

      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <TOSPlacement />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span>
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" />
                    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-semibold text-blue-700 text-sm">TOS Recommendation</span>
              </div>
              <div className="text-xs text-blue-700 ml-6">
                Consider adding more higher-order thinking questions (Analyzing, Evaluating, Creating) to challenge students and meet Bloom's taxonomy distribution goals.
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <ExamCompletionRate />
          </div>
        </div>
      </div>

      <QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        onSelectOption={handleQuizOption}
      />

      <QuestionRepoModal
        isOpen={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        onSelect={handleRepoSelect}
      />

      {createClassOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
            <CreateClass
              onSave={handleCreateClassSave}
              onCancel={() => setCreateClassOpen(false)}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default DashboardPage;