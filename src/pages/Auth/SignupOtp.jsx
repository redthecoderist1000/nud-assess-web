import React, { useContext, useState } from "react";
import { signupContext, userContext } from "../../App";
import { FormControl } from "@mui/material";
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
    }
  };

  const resend = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      // console.error("Error resending OTP:", error);
      setSnackbar({
        open: true,
        message: `Error resending OTP: ${error.message}`,
        severity: "error",
      });

      // setError(error.message);
    }
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
          className="text-gray-600 mb-10 test-red-500"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Don't have any OTP?
          <span
            className="text-blue-900 cursor-pointer hover:underline"
            onClick={resend}
          >
            {"  "}
            Resend
          </span>
        </motion.p>
        <p>{error}</p>
        <motion.button
          className="w-full p-3 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transform transition duration-300 hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={verifyOtp}
        >
          Submit
        </motion.button>
      </FormControl>
    </motion.div>
  );
}

export default SignupOtp;
