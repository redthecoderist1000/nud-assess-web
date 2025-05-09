import React, { createContext, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // ← ADD THIS
import "./index.css";

import { createClient } from "@supabase/supabase-js";

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
import CreateClass from "./components/elements/CreateClass.jsx";
import CreateQuestionManually from "./components/section/CreateQuestionManually.jsx";
import CreateQuestionAutomatically from "./components/section/CreateQuestionAutomatically.jsx";
import Courses from "./Admin/Courses.jsx";
import Program from "./Admin/Program.jsx";
import Educator from "./Admin/Educator.jsx";

import ClassPage from "./components/section/ClassPage.jsx";

import ProtectedRoutes from "./helper/ProtectedRoute.jsx";
import SignupOtp from "./components/section/SignupOtp.jsx";
import ProtectedAdmin from "./helper/ProtectedAdmin.jsx";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const userContext = createContext();
export const signupContext = createContext();

// Wrapper to use location inside AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [signupData, setSignupData] = useState({});

  const userVal = { user, setUser };
  const signupVal = { signupData, setSignupData };

  return (
    <signupContext.Provider value={signupVal}>
      <userContext.Provider value={userVal}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Authentication Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup-otp" element={<SignupOtp />} />

            <Route path="/class/:id" element={<ClassPage />} />
            <Route path="/create-class" element={<CreateClass />} />

            {/* Dashboard Routes - Wrapped with Layout */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="QuizManagement" element={<QuizmanagementPage />} />
                <Route
                  path="QuestionManagement"
                  element={<QuestionManagementPage />}
                />
                <Route
                  path="ClassManagement"
                  element={<ClassManagementPage />}
                />
                <Route
                  path="ReportAndAnalytics"
                  element={<ReportAndAnalyticsPage />}
                />
                <Route
                  path="ProfileSettings"
                  element={<ProfileSettingsPage />}
                />
                <Route path="CreateManually" element={<CreateManuallyPage />} />
                <Route
                  path="CreateAutomatically"
                  element={<CreateAutomaticallyPage />}
                />
                <Route
                  path="CreateQuestionManually"
                  element={<CreateQuestionManually />}
                />
                <Route
                  path="CreateQuestionAutomatically"
                  element={<CreateQuestionAutomatically />}
                />
                <Route path="QuestionResult" element={<QuestionResultPage />} />

                <Route element={<ProtectedAdmin />}>
                  {/* admin only */}
                  <Route
                    path="/dashboard/Administration"
                    element={<Program />}
                  />
                  <Route
                    path="/dashboard/Administration/Courses"
                    element={<Courses />}
                  />
                  <Route
                    path="/dashboard/Administration/Educator"
                    element={<Educator />}
                  />
                </Route>
              </Route>
            </Route>

            {/* Catch-All */}
          </Routes>
        </AnimatePresence>
      </userContext.Provider>
    </signupContext.Provider>
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
