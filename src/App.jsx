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

import ClassPage from "./pages/MyClasses/ClassPage/ClassPage.jsx";

import ProtectedRoutes from "./helper/ProtectedRoute.jsx";
import SignupOtp from "./pages/Auth/SignupOtp.jsx";
import ProtectedAdmin from "./helper/ProtectedAdmin.jsx";
import ProtectedLoggedin from "./helper/ProtectedLoggedin.jsx";
import { supabase } from "./helper/Supabase.jsx";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import SetUpAccount from "./pages/Auth/SetUpAccount.jsx";
import QuizInfoPage from "./pages/MyClasses/QuizInfoPage.jsx";
import FacultyInfo from "./pages/Admin/pages/FacultyInfoPage.jsx";
import SubjectInfoPage from "./pages/Admin/pages/SubjectInfoPage.jsx";
import CartPage from "./pages/QuizManagement/manualCreation/CartPage.jsx";
import Tosifier from "./pages/QuizManagement/tosPage/Tosifier.jsx";
import AutoSignOut from "./components/elements/AutoSignOut.jsx";
import { Alert, Snackbar } from "@mui/material";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";

export const userContext = createContext();
export const signupContext = createContext();

// Wrapper to use location inside AnimatePresence
const AnimatedRoutes = () => {
  const env = import.meta.env;

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [signupData, setSignupData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const userVal = { user, setUser, loading, setSnackbar };
  const signupVal = { signupData, setSignupData };

  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds
  // const INACTIVITY_TIMEOUT = 60 * 10000; // 10 minutes in milliseconds
  const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute
  const [autoSignOut, setAutoSignOut] = useState(false);

  const checkSessionAndActivity = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session) return;

      const now = Date.now();
      const timeInactive = now - lastActivity;
      const sessionTimeLeft = session.expires_at * 1000 - now;

      // Sign out if user has been inactive for too long
      if (timeInactive > INACTIVITY_TIMEOUT) {
        // console.log("Signing out due to inactivity");
        // setUser({});
        setAutoSignOut(true);
        if (env.VITE_ENVIRONMENT === "deployed") {
          await supabase.auth.signOut();
        }
        // get env variable

        return;
      }

      // Refresh session if it expires soon and user is active
      if (sessionTimeLeft < 5 * 60 * 1000) {
        // 5 minutes
        console.log("Refreshing session...");
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.log("Failed to refresh session:", refreshError);
          // userCon.setUser({});
          // await supabase.auth.signOut();
        } else {
          console.log("Session refreshed successfully");
        }
      }
    } catch (err) {
      console.log("Error checking session:", err);
    }
  };

  // Track user activity
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    // Activity event listeners
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add activity listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    // Set up session checking interval
    const sessionInterval = setInterval(
      checkSessionAndActivity,
      SESSION_CHECK_INTERVAL
    );

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(sessionInterval);
    };
  }, [lastActivity]);

  const initAuth = async () => {
    // await supabase.auth.signOut();
    const hash = location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const type = params.get("type");

    if (type === "recovery") {
      setLoading(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data, error } = await supabase
        .from("tbl_users")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        setSnackbar({
          open: true,
          message: "Error fetching user data",
          severity: "error",
        });
        setLoading(false);
        return;
      } else if (data === null) {
        navigate("/setup", {
          replace: true,
          state: {
            user_id: session.user.id,
            email: session.user.email,
          },
        });
        return;
      } else if (data.role === "Student") {
        setSnackbar({
          open: true,
          message: "Access denied. Students cannot access this platform.",
          severity: "error",
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      setUser({
        email: session.user.email,
        user_id: session.user.id,
        ...data,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // console.log("Auth event:", _event);
        // console.log("Session:", session);

        if (_event === "PASSWORD_RECOVERY") {
          // console.log("Password recovery event detected");
          return;
        } else if (!session) {
          setUser({});
        } else {
          initAuth();
        }
      }
    );

    const userChannel = supabase
      .channel("public-tbl_users")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_users",
          filter: `id=eq.${user.user_id}`,
        },
        (payload) => {
          // console.log("User channel payload:", payload);
          initAuth();
        }
      )
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(userChannel);
    };
  }, []);

  return (
    <>
      <signupContext.Provider value={signupVal}>
        <userContext.Provider value={userVal}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Authentication Routes */}

              <Route element={<ProtectedLoggedin />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup-otp" element={<SignupOtp />} />
                <Route path="/setup" element={<SetUpAccount />} />

                <Route path="/reset-password" element={<ResetPasswordPage />} />
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
                  <Route path="quizzes" element={<QuizmanagementPage />} />
                  <Route path="QuestionSummary" element={<QuestionSummary />} />
                  <Route
                    path="questions"
                    element={<QuestionManagementPage />}
                  />
                  <Route path="classes" element={<ClassManagementPage />} />
                  <Route
                    path="analytics"
                    element={<ReportAndAnalyticsPage />}
                  />
                  <Route path="profile" element={<ProfileSettingsPage />} />

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
                  <Route path="quiz-detail" element={<Tosifier />} />
                  <Route path="manual-quiz" element={<CartPage />} />
                  <Route path="quizsummary" element={<QuizResultPage />} />

                  <Route element={<ProtectedAdmin />}>
                    {/* admin only */}
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/faculty" element={<FacultyInfo />} />
                    <Route
                      path="/admin/subject"
                      element={<SubjectInfoPage />}
                    />
                  </Route>
                </Route>
              </Route>

              {/* Catch-All */}
            </Routes>
          </AnimatePresence>
        </userContext.Provider>
      </signupContext.Provider>
      <AutoSignOut open={autoSignOut} onClose={() => setAutoSignOut(false)} />

      {/* snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
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
