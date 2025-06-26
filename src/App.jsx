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
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // ← ADD THIS
import "./index.css";

import DashboardLayout from "./helper/DashboardLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import QuizmanagementPage from "./pages/QuizManagement/QuizmanagementPage.jsx";
import QuestionManagementPage from "./pages/QuestionManagement/QuestionManagement.jsx";
import ClassManagementPage from "./pages/MyClasses/ClassManagementPage.jsx";
import ReportAndAnalyticsPage from "./pages/ReportnAnalytics/ReportAndAnalyticsPage.jsx";
import ProfileSettingsPage from "./pages/Profile/ProfileSettingsPage.jsx";
import CreateAutomaticallyPage from "./pages/QuestionManagement/CreateAutomaticallyPage.jsx";
import QuizResultPage from "./pages/QuizManagement/QuizResultPage.jsx";
import CreateQuestionManually from "./pages/QuestionManagement/CreateQuestionManually.jsx";
import CreateQuestionAutomatically from "./pages/QuestionManagement/CreateQuestionAutomatically.jsx";
import QuestionSummary from "./pages/QuestionManagement/QuestionSummary.jsx.jsx";
// import QuestionDetails from "./components/section/QuestionDetails.jsx";
// import Courses from "./pages/Admin/Courses.js";
// import Program from "./pages/Admin/Program.js";
// import Educator from "./pages/Admin/Educator.js";

import ClassPage from "./pages/MyClasses/ClassPage.jsx";

import ProtectedRoutes from "./helper/ProtectedRoute.jsx";
import SignupOtp from "./pages/Auth/SignupOtp.jsx";
import ProtectedAdmin from "./helper/ProtectedAdmin.jsx";
import ProtectedLoggedin from "./helper/ProtectedLoggedin.jsx";
import { supabase } from "./helper/Supabase.jsx";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import SetUpAccount from "./pages/Auth/SetUpAccount.jsx";
import QuizInfoPage from "./pages/MyClasses/QuizInfoPage.jsx";

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
        navigate("/login");
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
              <Route path="/login" element={<AuthPage />} />
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
              <Route path="/quiz" element={<QuizInfoPage />} />

              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="QuizManagement" element={<QuizmanagementPage />} />
                <Route path="QuestionSummary" element={<QuestionSummary />} />
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
                  path="GenerateQuestion"
                  element={<CreateQuestionAutomatically />}
                />
                <Route path="QuizResult" element={<QuizResultPage />} />

                <Route element={<ProtectedAdmin />}>
                  {/* admin only */}
                  <Route
                    path="/dashboard/Administration"
                    element={<AdminPage />}
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
