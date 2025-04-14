import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // ← ADD THIS
import "./index.css";

import LoginPage from "./components/section/LoginPage.jsx";
import SignupPage from "./components/section/SignupPage.jsx";
import ForgotpasswordPage from "./components/section/ForgotpasswordPage.jsx";
import VerifycodePage from "./components/section/VerifycodePage.jsx";
import ChangepasswordPage from "./components/section/ChangepasswordPage.jsx";
import DashboardLayout from "./components/elements/DashboardLayout";
import DashboardPage from "./components/section/DashboardPage.jsx";  
import QuizmanagementPage from "./components/section/QuizmanagementPage.jsx";
import QuestionManagementPage from "./components/section/QuestionManagement.jsx";
import ClassManagementPage from "./components/section/ClassManagementPage.jsx";
import ReportAndAnalyticsPage from "./components/section/ReportAndAnalyticsPage.jsx";
import ProfileSettingsPage from "./components/section/ProfileSettingsPage.jsx";
import CreateAutomaticallyPage from "./components/section/CreateAutomaticallyPage.jsx";
import CreateManuallyPage from "./components/section/CreateManuallyPage.jsx";
import QuestionResultPage from "./components/section/QuestionResultPage.jsx"; 

// Wrapper to use location inside AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Authentication Routes */}
        <Route path="/" element={<LoginPage />} />  
        <Route path="/signup" element={<SignupPage />} />  
        <Route path="/forgot-password" element={<ForgotpasswordPage />} />  
        <Route path="/verify-code" element={<VerifycodePage />} />  
        <Route path="/change-password" element={<ChangepasswordPage />} />  

        {/* Dashboard Routes - Wrapped with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="QuizManagement" element={<QuizmanagementPage />} />
          <Route path="QuestionManagement" element={<QuestionManagementPage />} />
          <Route path="ClassManagement" element={<ClassManagementPage />} />
          <Route path="ReportAndAnalytics" element={<ReportAndAnalyticsPage />} />
          <Route path="ProfileSettings" element={<ProfileSettingsPage />} />
          <Route path="CreateManually" element={<CreateManuallyPage />} />
          <Route path="CreateAutomatically" element={<CreateAutomaticallyPage />} />
          <Route path="QuestionResult" element={<QuestionResultPage />} />  
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
