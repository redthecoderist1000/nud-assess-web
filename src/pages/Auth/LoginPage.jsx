import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import loginImage from "../../assets/images/login_image.png";
import hideIcon from "../../assets/images/hide.png";
import unhideIcon from "../../assets/images/unhide.png";
import { motion } from "framer-motion";

import { userContext } from "../../App";
import { supabase } from "../../helper/Supabase";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TermsDialog from "./components/TermsDialog";
import PolicyDialog from "./components/PolicyDialog";
import ForgotPasswordDialog from "./components/ForgotPasswordDialog";

const LoginPage = () => {
  const env = import.meta.env;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setSnackbar } = useContext(userContext);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [signUp, setSignUp] = useState(false);
  const [formSignUp, setFormSignUp] = useState({
    email: "",
    password: "",
    cpassword: "",
    terms: false,
  });
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  useEffect(() => {
    document.title = signUp ? "Sign Up - NUD Assess" : "Sign In - NUD Assess";
    setEmail("");
    setPassword("");
    setFormSignUp({
      email: "",
      password: "",
      cpassword: "",
    });
  }, [signUp]);

  const handleChangeSignUpForm = (e) => {
    setFormSignUp({ ...formSignUp, [e.target.name]: e.target.value });
  };

  const checkPasswordStrength = () => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
    return regex.test(formSignUp.password);
  };

  const passwordRequirements = (
    <div className="text-xs">
      <p>Password must be at least:</p>
      <ul className="list-disc list-inside">
        <li>8 characters</li>
        <li>One uppercase letter (A-Z)</li>
        <li>One lowercase letter (a-z)</li>
        <li>One number (0-9)</li>
        <li>One special character (@$#!%*?&)</li>
      </ul>
    </div>
  );

  const sendConfirmation = async (e) => {
    e.preventDefault();
    if (!checkPasswordStrength() && env.VITE_ENVIRONMENT === "deployed") {
      setSnackbar({
        open: true,
        message: "Password must satisfy the requirements.",
        severity: "error",
      });
      return;
    }

    const domain = formSignUp.email.split("@")[1];
    // uncomment on final
    if (domain != "nu-dasma.edu.ph" && env.VITE_ENVIRONMENT === "deployed") {
      setSnackbar({
        open: true,
        message: "Please use your valid NUD Employee email",
        severity: "error",
      });
      setIsLoading(false);
      return;
    }
    if (formSignUp.password != formSignUp.cpassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: formSignUp.email,
      password: formSignUp.password,
    });

    if (error) {
      setSnackbar({
        open: true,
        message: "Error: " + error.message,
        severity: "error",
      });
      setIsLoading(false);
      return;
    }

    if (user.identities.length <= 0) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Email already in use",
        severity: "error",
      });
      return;
    }

    setSnackbar({
      open: true,
      message: "OTP was successfully sent to: " + formSignUp.email,
      severity: "success",
    });

    navigate("/signup-otp", {
      replace: true,
      state: { email: formSignUp.email, password: formSignUp.password },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // correct na
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.log("error code:", error.code);
      if (error.code === "email_not_confirmed") {
        setSnackbar({
          open: true,
          message: "Email not yet confirmed. Please sign up again.",
          severity: "warning",
        });
      } else if (error.code === "validation_failed") {
        setSnackbar({
          open: true,
          message: "Invalid email or password.",
          severity: "error",
        });
      } else if (error.code === "user_banned") {
        setSnackbar({
          open: true,
          message: "This account no longer has access to the system.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Error: " + error.message,
          severity: "error",
        });
      }

      setIsLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "Successfully Logged In",
      severity: "success",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-white relative"
    >
      <motion.header
        className="absolute top-6 left-10"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={logo} alt="NUD Assess Logo" className="h-10" />
      </motion.header>

      <div className="flex flex-grow items-center justify-center p-10">
        <motion.div
          className="w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {signUp ? (
            <form className="w-full max-w-md" onSubmit={sendConfirmation}>
              {/* sign up form */}
              <motion.h1
                className="text-4xl font-bold mb-3"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Sign Up
              </motion.h1>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Enter your valid NU faculty email to recieve a confirmation link
              </motion.p>
              <Stack rowGap={1}>
                <TextField
                  required
                  size="small"
                  label="Email"
                  type="text"
                  name="email"
                  value={formSignUp.email}
                  fullWidth
                  onChange={handleChangeSignUpForm}
                />
                <Tooltip title={passwordRequirements} arrow placement="right">
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                  >
                    <InputLabel htmlFor="password_input">Password</InputLabel>
                    <OutlinedInput
                      id="password_input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formSignUp.password}
                      onChange={handleChangeSignUpForm}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 20 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Tooltip>
                <FormControl variant="outlined" size="small" fullWidth required>
                  <InputLabel htmlFor="cpassword_input">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="cpassword_input"
                    name="cpassword"
                    value={formSignUp.cpassword}
                    onChange={handleChangeSignUpForm}
                    type={showCPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCPassword(!showCPassword)}
                          edge="end"
                        >
                          {showCPassword ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    value={formSignUp.terms}
                    onChange={() =>
                      setFormSignUp({
                        ...formSignUp,
                        terms: !formSignUp.terms,
                      })
                    }
                    required
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-600">
                    I agree to all the{" "}
                    <button
                      type="button"
                      onClick={() => setTerms(true)}
                      className="text-amber-300 hover:underline focus:outline-none"
                    >
                      Terms
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setPrivacy(true)}
                      className="text-amber-300 hover:underline focus:outline-none"
                    >
                      Privacy Policies
                    </button>
                  </label>
                </div>
                {/* Send Confirmation Button */}
                <Button
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                  disableElevation
                  fullWidth
                  sx={{
                    bgcolor: "#35408E",
                    "&:hover": { bgcolor: "#2c347a" },
                  }}
                >
                  send confirmation
                </Button>
                {/* Login Link */}
                <motion.p
                  className="text-center text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Already have an account?{" "}
                  <span
                    onClick={() => setSignUp(false)}
                    className="text-amber-400 cursor-pointer hover:underline"
                  >
                    Sign In here.
                  </span>
                </motion.p>
              </Stack>
            </form>
          ) : (
            <form className="w-full max-w-md" onSubmit={handleLogin}>
              {/* login form */}
              <motion.h1
                className="text-4xl font-bold mb-3"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Sign In
              </motion.h1>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Sign in to access your NUD Assess account
              </motion.p>

              <Stack rowGap={1}>
                <TextField
                  required
                  label="Email"
                  type="email"
                  fullWidth
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormControl variant="outlined" size="small" fullWidth required>
                  <InputLabel htmlFor="password_input">Password</InputLabel>
                  <OutlinedInput
                    id="password_input"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>

                {/* Login Button */}
                <Typography
                  variant="body2"
                  textAlign="right"
                  sx={{
                    cursor: "pointer",
                    color: "#35408E",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password?
                </Typography>

                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  sx={{
                    bgcolor: "#35408E",
                    color: "white",
                    "&:hover": { bgcolor: "#2c347a" },
                  }}
                >
                  Sign In
                </Button>
              </Stack>

              {/* Signup Link */}
              <motion.p
                className="text-center mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Don't have an account?{" "}
                <span
                  onClick={() => setSignUp(true)}
                  className="text-amber-400 cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </motion.p>
            </form>
          )}
        </motion.div>

        <motion.div
          className="w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-3/4 h-auto"
          />
        </motion.div>
      </div>

      <TermsDialog open={terms} onClose={() => setTerms(false)} />

      <PolicyDialog open={privacy} onClose={() => setPrivacy(false)} />

      <ForgotPasswordDialog
        open={forgotPassword}
        onClose={() => setForgotPassword(false)}
      />
    </motion.div>
  );
};

export default LoginPage;
