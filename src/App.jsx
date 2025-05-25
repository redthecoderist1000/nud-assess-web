import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
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
import QuizResultPage from "./components/section/QuizResultPage.jsx";
import CreateClass from "./components/elements/CreateClass.jsx";
import CreateQuestionManually from "./components/section/CreateQuestionManually.jsx";
import CreateQuestionAutomatically from "./components/section/CreateQuestionAutomatically.jsx";
import QuestionSummary from "./components/section/QuestionSummary.jsx";
import QuestionDetails from "./components/section/QuestionDetails.jsx";
import QuizDetails from "./components/section/QuizDetails.jsx";
import Courses from "./Admin/Courses.jsx";
import Program from "./Admin/Program.jsx";
import Educator from "./Admin/Educator.jsx";

import ClassPage from "./components/section/ClassPage.jsx";

import ProtectedRoutes from "./helper/ProtectedRoute.jsx";
import SignupOtp from "./components/section/SignupOtp.jsx";
import ProtectedAdmin from "./helper/ProtectedAdmin.jsx";
import ProtectedLoggedin from "./helper/ProtectedLoggedin.jsx";
import { supabase } from "./helper/Supabase.jsx";
import AuthPage from "./components/section/AuthPage.jsx";
import AdminPage from "./Admin/AdminPage.jsx";
import SetUpAccount from "./components/section/SetUpAccount.jsx";

export const userContext = createContext();
export const signupContext = createContext();

// Wrapper to use location inside AnimatePresence
const AnimatedRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [signupData, setSignupData] = useState({});

  const userVal = { user, setUser };
  const signupVal = { signupData, setSignupData };

  useEffect(() => {
    // supabase.auth.signOut();
    supabase.auth.onAuthStateChange((event, session) => {
      // console.log(event, session);
      // console.log("is_verified: ", session.user.user_metadata.email_verified);
      if (session == null) {
        navigate("/");
        return;
      }

      if (event === "SIGNED_IN") {
        if (!user.email && !user.user_id) {
          // setUser({ email: session.user.email, user_id: session.user.id });

          (async () => {
            let { data, error } = await supabase
              .from("tbl_users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              // console.log("error ewan", error);
              // navigate to set up
              navigate("setup", {
                state: { email: session.user.email, user_id: session.user.id },
              });
              return;
            }

            // console.log("setup done:", data);
            setUser({
              ...user.user,
              email: session.user.email,
              user_id: session.user.id,
              suffix: data.suffix,
              role: data.role,
              f_name: data.f_name,
              m_name: data.m_name,
              l_name: data.l_name,
              department_id: data.department_id,
            });
          })();
        }
      }
    });
  }, [user]);

  return (
    <signupContext.Provider value={signupVal}>
      <userContext.Provider value={userVal}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Authentication Routes */}

            <Route element={<ProtectedLoggedin />}>
              <Route path="/" element={<AuthPage />} />
              <Route path="/signup-otp" element={<SignupOtp />} />
              <Route path="/setup" element={<SetUpAccount />} />

              {/* di pa ayos */}
              {/* <Route path="/class/:id" element={<ClassPage />} /> */}
              {/* <Route path="/create-class" element={<CreateClass />} /> */}
              {/* <Route path="/question-summary" element={<QuestionSummary />} /> */}
            </Route>

            {/* Dashboard Routes - Wrapped with Layout */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/class" element={<ClassPage />} />

              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="QuizManagement" element={<QuizmanagementPage />} />
                <Route path="QuestionSummary" element={<QuestionSummary />} />
                <Route path="QuestionDetails" element={<QuestionDetails />} />
                <Route path="QuizDetails" element={<QuizDetails />} />
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

                {/* <Route path="/class/:id" element={<ClassPage />} />
                <Route path="/create-class" element={<CreateClass />} /> */}
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
                <Route path="QuizResult" element={<QuizResultPage />} />

                <Route element={<ProtectedAdmin />}>
                  {/* admin only */}
                  {/* <Route
                    path="/dashboard/Administration"
                    element={<Program />}
                  /> */}
                  <Route
                    path="/dashboard/Administration"
                    element={<AdminPage />}
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
