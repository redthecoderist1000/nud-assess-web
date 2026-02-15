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
    <div className="h-screen flex flex-col bg-white relative">
      <div className="flex flex-grow">
        {/* left side */}
        <div className="flex-1 bg-[url('/src/assets/images/nu_facade.webp')] bg-cover bg-center relative">
          {/*blue bg overlay*/}
          <div className="absolute inset-0 bg-[rgba(53,64,142,0.8)]"></div>
          <div className="relative h-full p-15 z-10">
            <div className="h-full flex ">
              <div className="absolute ">
                {/* logo */}
                <img src={logo} alt="logo" className="w-50" />
              </div>
              <div className="self-center flex flex-col gap-10">
                {/* title */}
                <Typography variant="h3" color="white">
                  {signUp ? "Join the Future of" : "Streamline Faculty"}
                  <br />
                  {signUp ? "Faculty Assessment" : "Assessments & Analytics"}
                </Typography>
                <div className="w-3/4">
                  <Typography variant="body1" color="white">
                    {signUp
                      ? "Create your NUD Assess account and unlock powerful tools for creating assessments, tracking student progress, and making data-driven educational decisions. Join our community of innovative educators."
                      : "Empower educators with intelligent assessment tools. Create quizzes, track student performance, analyze learning outcomes, and make data-driven decisions—all in one comprehensive platform designed for NU Dasmarinas."}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flex flex-1 justify-center items-center">
          {signUp ? (
            <form className="w-full max-w-md" onSubmit={sendConfirmation}>
              <Stack rowGap={3}>
                {/* sign up form */}
                <Typography variant="h4">Sign Up</Typography>
                <Typography className="text-gray-600" variant="body1">
                  Enter your valid NU faculty email to recieve a confirmation
                  link
                </Typography>
                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-600"
                    gutterBottom
                  >
                    Email
                  </Typography>
                  <TextField
                    required
                    placeholder="Email *"
                    size="small"
                    type="text"
                    name="email"
                    value={formSignUp.email}
                    fullWidth
                    onChange={handleChangeSignUpForm}
                  />
                </div>
                <Tooltip title={passwordRequirements} arrow placement="right">
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-600"
                      gutterBottom
                    >
                      Password
                    </Typography>
                    <FormControl
                      variant="outlined"
                      size="small"
                      fullWidth
                      required
                    >
                      <OutlinedInput
                        id="password_input"
                        placeholder="Password *"
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
                      />
                    </FormControl>
                  </div>
                </Tooltip>
                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-600"
                    gutterBottom
                  >
                    Confirm Password
                  </Typography>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                  >
                    <OutlinedInput
                      id="cpassword_input"
                      placeholder="Confirm Password *"
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
                    />
                  </FormControl>
                </div>

                <div className="flex items-center gap-2">
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
                  <Typography variant="body2" className="text-gray-600">
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
                  </Typography>
                </div>
                {/* Send Confirmation Button */}
                <Button
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  sx={{
                    bgcolor: "#35408E",
                    color: "white",
                    "&:hover": { bgcolor: "#2c347a" },
                  }}
                  disableElevation
                >
                  Send Confirmation
                </Button>

                {/* Login Link */}
                <Typography
                  variant="body2"
                  className="text-center mt-3 text-gray-600"
                >
                  Already have an account?{" "}
                  <span
                    onClick={() => setSignUp(false)}
                    className="text-amber-400 cursor-pointer hover:underline"
                  >
                    Sign In here.
                  </span>
                </Typography>
              </Stack>
            </form>
          ) : (
            <form className="w-full max-w-md" onSubmit={handleLogin}>
              <Stack rowGap={3}>
                {/* login form */}
                <Typography variant="h4">Sign In</Typography>
                <Typography className="text-gray-600" variant="body1">
                  Sign in to access your NUD Assess account
                </Typography>

                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-600"
                    gutterBottom
                  >
                    Email
                  </Typography>
                  <TextField
                    required
                    placeholder="Email *"
                    type="email"
                    fullWidth
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-600"
                    gutterBottom
                  >
                    Password
                  </Typography>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                  >
                    <OutlinedInput
                      id="password_input"
                      placeholder="Password *"
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
                    />
                  </FormControl>
                </div>

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

                {/* Signup Link */}
                <Typography
                  variant="body2"
                  className="text-center mt-3 text-gray-600"
                >
                  Don't have an account?{" "}
                  <span
                    onClick={() => setSignUp(true)}
                    className="text-amber-400 cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </Typography>
              </Stack>
            </form>
          )}
        </div>
      </div>

      <TermsDialog open={terms} onClose={() => setTerms(false)} />

      <PolicyDialog open={privacy} onClose={() => setPrivacy(false)} />

      <ForgotPasswordDialog
        open={forgotPassword}
        onClose={() => setForgotPassword(false)}
      />
    </div>
  );
};

export default LoginPage;
