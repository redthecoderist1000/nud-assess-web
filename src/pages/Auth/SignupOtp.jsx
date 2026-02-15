import React, { useContext, useEffect, useState } from "react";
import { signupContext, userContext } from "../../App";
import { Button, FormControl, Stack, Typography } from "@mui/material";
import { OtpInput } from "reactjs-otp-input";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/logo.png";
import signupImage from "../../assets/images/signup_image.png";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

function SignupOtp() {
  const navigate = useNavigate();
  const { setSnackbar } = useContext(userContext);
  const location = useLocation();
  const email = location.state.email;
  const password = location.state.password;
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const [otp, setOtp] = useState("");

  const changeOtp = (otp) => {
    setOtp(otp);
  };

  const verifyOtp = async () => {
    if (otp.length < 6) {
      setSnackbar({
        open: true,
        message: "Please enter a valid 6-digit OTP.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    let { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email",
    });

    if (error) {
      setSnackbar({
        open: true,
        message: `Error verifying OTP: ${error.message}`,
        severity: "error",
      });
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "OTP verified successfully! You can now log in.",
      severity: "success",
    });
  };

  const resend = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setSnackbar({
        open: true,
        message: `${error.message}`,
        severity: "error",
      });
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: `OTP has been resent to ${email}`,
      severity: "success",
    });
    setSecondsRemaining(60);
    setLoading(false);
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
                  Almost There!
                </Typography>
                <div className="w-3/4">
                  <Typography variant="body1" color="white">
                    We've sent a verification code to your email address. Please
                    enter the 6-digit code to verify your account and complete
                    your registration for NUD Assess.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flex flex-1 justify-center items-center">
          <form className="w-full max-w-md">
            <Stack rowGap={3}>
              {/* bacl tbn */}
              <div className="flex justify-start">
                <Button
                  variant="text"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => navigate("/login", { replace: true })}
                  sx={{
                    textTransform: "none",
                    bgcolor: "transparent",
                    color: "#9CA3AF",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#6B7280",
                    },
                  }}
                >
                  Back to Sign up
                </Button>
              </div>

              {/* verify otp form */}
              <Typography variant="h4">Verify OTP</Typography>
              <Typography className="text-gray-600" variant="body1">
                We've sent a verification code to <br />
                <b>{email}</b>
              </Typography>

              <div>
                <Typography
                  variant="body2"
                  className="text-gray-600"
                  gutterBottom
                >
                  Enter OTP
                </Typography>
                <OtpInput
                  value={otp}
                  numInputs={6}
                  isInputNum={true}
                  onChange={changeOtp}
                  containerStyle={{
                    justifyContent: "space-evenly",
                    gap: "10px",
                  }}
                  inputStyle={{
                    border: "2px solid #d1d5db",
                    borderRadius: "5px",
                    width: "50px",
                    height: "50px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                />
              </div>

              {/* Verify Button */}
              <Button
                variant="contained"
                onClick={verifyOtp}
                loading={loading}
                disableElevation
                fullWidth
                sx={{
                  bgcolor: "#35408E",
                  color: "white",
                  "&:hover": { bgcolor: "#2c347a" },
                }}
              >
                Verify
              </Button>

              {/* Resend Link */}
              <Typography variant="body2" className="text-center text-gray-600">
                Don't have any OTP?{" "}
                <Button
                  variant="text"
                  onClick={resend}
                  disabled={secondsRemaining > 0}
                  loading={loading}
                  sx={{
                    textTransform: "none",
                    padding: "0 4px",
                    color: "#35408E",
                    fontWeight: "bold",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Resend ({secondsRemaining}s)
                </Button>
              </Typography>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupOtp;
