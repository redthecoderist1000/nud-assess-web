import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion
import logo from "../../assets/images/logo.png";
import backIcon from "../../assets/images/backicon.png";
import microsoftLogo from "../../assets/images/microsoftlogo.png";
import verifyImage from "../../assets/images/verify_image.png";

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code) {
      alert("Verification code is required");
    } else if (!/^[0-9]{6}$/.test(code)) {
      alert("Please enter a valid 6-digit code");
    } else {
      alert("Code verified successfully");
      navigate("/change-password"); // Redirect to Change Password Page
    }
  };

  return (
    <motion.div
      className="relative w-full h-screen flex p-20 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Logo */}
      <motion.header
        className="absolute top-6 left-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img src={logo} alt="NUD Assess Logo" className="h-10" />
      </motion.header>

      {/* Left Section: Verify Code Form */}
      <motion.div
        className="w-1/2 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="w-2/3">
          {/* Back to Login Link */}
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center text-black mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <img src={backIcon} alt="Back" className="w-5 h-5 mr-2" />
            <span>Back to login</span>
          </motion.button>

          {/* Page Title and Description */}
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Verify code
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            An authentication code has been sent to your email.
          </motion.p>

          <div className="space-y-4">
            {/* Code Input Field with Floating Label */}
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <input
                type="text"
                id="floating_outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="peer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 placeholder-transparent"
                placeholder=" "
              />
              <label
                htmlFor="floating_outlined"
                className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Code
              </label>
            </motion.div>

            {/* Verify Button with Hover Effect */}
            <motion.button
              onClick={handleVerify}
              className="w-full p-3 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transition duration-200"
              whileHover={{ scale: 1.03 }} // Slight scaling effect on hover
            >
              Verify
            </motion.button>

            {/* Divider with "Or login with" text */}
            <motion.div
              className="flex items-center my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-gray-400 text-sm">Or login with</span>
              <hr className="flex-grow border-t border-gray-300" />
            </motion.div>

            {/* Microsoft Login Button */}
            <motion.button
              className="flex items-center justify-center w-full p-3 border border-[#35408E] text-[#35408E] rounded-md transition duration-200 ease-in-out hover:bg-[#2c357e] hover:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <img src={microsoftLogo} alt="Microsoft Logo" className="w-5 h-5 mr-3" />
              Log in with Microsoft
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Right Section: Image Display */}
      <motion.div
        className="w-1/2 flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <img src={verifyImage} alt="Verify Code Illustration" className="max-w-full h-auto" />
      </motion.div>
    </motion.div>
  );
};

export default VerifyCodePage;
