import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";
import backIcon from "../../assets/images/backicon.png";
import microsoftLogo from "../../assets/images/microsoftlogo.png";
import forgotPassImage from "../../assets/images/forgotpass_image.png";

const ForgotpasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      alert("Email is required");
    } 
    // List of allowed domains
    else {
      const allowedDomains = ["@gmail.com", "@yahoo.com", "@outlook.com"];
  
      // Extract the domain from the email
      const emailDomain = email.substring(email.lastIndexOf("@"));
  
      // Check if the email domain is in the allowed list
      if (!allowedDomains.includes(emailDomain)) {
        alert(
          "Please enter a valid Email address (e.g., example@gmail.com)."
        );
      } 
      // General email validation using regex
      else if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email");
      } 
      else {
        alert("Password recovery instructions sent to your email");
        navigate("/verify-code"); // Redirect to Verify Code Page
      }
    }
  };
  return (
    <motion.div
      className="relative w-full h-screen flex p-8 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }} // Faster page fade-in
    >
      {/* Header with Logo */}
      <motion.header
        className="absolute top-6 left-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }} // Faster slide-in for logo
      >
        <img src={logo} alt="NUD Assess Logo" className="h-10" />
      </motion.header>

      {/* Left Section: Forgot Password Form */}
      <div className="w-1/2 flex items-center justify-center">
        <motion.div
          className="w-2/3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} // Faster form entrance
        >
          {/* Back to Login Link */}
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center text-black mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }} // Faster back button animation
          >
            <img src={backIcon} alt="Back" className="w-5 h-5 mr-2" />
            <span>Back to login</span>
          </motion.button>

          {/* Page Title and Description */}
          <motion.h1
            className="text-4xl font-bold mb-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }} // Faster title fade-in
          >
            Forgot your password?
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }} // Faster description fade-in
          >
            Don’t worry, happens to all of us. Enter your email below to recover your password.
          </motion.p>

          <div className="space-y-4">
            {/* Email Input Field with Floating Label */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }} // Faster input animation
            >
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Email
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              className="w-full p-3 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transform transition duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }} // Faster submit button animation
            >
              Submit
            </motion.button>

            {/* Divider with "Or login with" text */}
            <motion.div
              className="flex items-center my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }} // Faster divider animation
            >
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-gray-400 text-sm">Or login with</span>
              <hr className="flex-grow border-t border-gray-300" />
            </motion.div>

            {/* Microsoft Login Button */}
            <motion.button
              className="flex items-center justify-center w-full p-3 border border-[#35408E] text-[#35408E] rounded-md transition duration-300 ease-in-out hover:bg-[#2c357e] hover:text-white"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1}} // Faster Microsoft login button animation
            >
              <img src={microsoftLogo} alt="Microsoft Logo" className="w-5 h-5 mr-3" />
              Log in with Microsoft
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Right Section: Image Display */}
      <motion.div
        className="w-1/2 flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }} // Faster image fade-in from right
      >
        <img
          src={forgotPassImage}
          alt="Forgot Password Illustration"
          className="max-w-full h-auto"
        />
      </motion.div>
    </motion.div>
  );
};

export default ForgotpasswordPage;
