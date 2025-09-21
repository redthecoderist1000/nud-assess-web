import React, { useContext, useEffect, useState } from "react";
import { signupContext, userContext } from "../../App";
import { Button, FormControl } from "@mui/material";
import { OtpInput } from "reactjs-otp-input";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/logo.png";
import signupImage from "../../assets/images/signup_image.png";
import { useLocation } from "react-router-dom";
import { supabase } from "../../helper/Supabase";

function SignupOtp() {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex items-center justify-center bg-white relative"
    >
      <header className="absolute top-6 left-10">
        <motion.img
          src={logo}
          alt="NUD Assess Logo"
          className="h-10 "
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />
      </header>
      <div className="h-screen flex ">
        <motion.div
          className="flex justify-center items-center "
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={signupImage}
            alt="Sign up image"
            className="max-w-full h-auto "
          />
        </motion.div>
        <motion.div
          className="w-3/5 flex items-center justify-center p-8 "
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      <FormControl className="w-1/4">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Verify OTP
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-3"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          We already sent an OTP to your email <b>{email}</b> . Please verify
          the OTP.
        </motion.p>
        <OtpInput
          value={otp}
          numInputs={6}
          // separator={<span>-</span>}
          isInputNum={true}
          onChange={changeOtp}
          containerStyle={{
            justifyContent: "space-evenly",
            gap: "20px",
          }}
          inputStyle={{
            border: "2px solid gray",
            borderRadius: "5px",
            width: "100%",
            height: "50px",
            fontSize: "20px",
          }}
        />
        <motion.p
          className="text-gray-600 mb-10 test-red-500 text-center align-middle"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Don't have any OTP?
          <Button
            variant="text"
            onClick={resend}
            disabled={secondsRemaining > 0}
            loading={loading}
            sx={{
              textTransform: "none",
              marginLeft: "8px",
              color: "#35408E",
              fontWeight: "bold",
            }}
          >
            Resend ({secondsRemaining}s)
          </Button>
        </motion.p>
        <Button
          variant="contained"
          onClick={verifyOtp}
          loading={loading}
          size="large"
          disableElevation
          sx={{
            color: "white",
            bgcolor: "#35408E",
            "&:hover": { backgroundColor: "#2c357e" },
            textTransform: "none",
          }}
        >
          Submit
        </Button>
      </FormControl>
    </motion.div>
  );
}

export default SignupOtp;
