import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import loginImage from "../../assets/images/login_image.png";
import microsoftLogo from "../../assets/images/microsoftlogo.png";
import hideIcon from "../../assets/images/hide.png";
import unhideIcon from "../../assets/images/unhide.png";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      alert("Email and password are required.");
    } else {
      const allowedDomains = ["@gmail.com", "@yahoo.com", "@outlook.com"];
      const emailDomain = email.substring(email.lastIndexOf("@"));

      if (!allowedDomains.includes(emailDomain)) {
        setError("Please enter a valid Email address (e.g., example@gmail.com).");
        alert("Please enter a valid Email address (e.g., example@gmail.com).");
      } else if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        setError("Please enter a valid email.");
        alert("Please enter a valid email.");
      } else {
        setError("");
        console.log("Logging in...");
        navigate("/dashboard");
      }
    }
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
          <div className="w-full max-w-md">
            <motion.h1
              className="text-4xl font-bold mb-3"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Login
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Login to access your NUD Assess account
            </motion.p>

            <div className="space-y-4">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Email
                </label>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Password
                </label>
                <img
                  src={showPassword ? hideIcon : unhideIcon}
                  alt="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                />
              </motion.div>
            </div>

            <motion.button
              onClick={handleLogin}
              className="w-full mt-4 p-3 bg-[#35408E] text-white rounded-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Login
            </motion.button>
          </div>
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
    </motion.div>
  );
};

export default LoginPage;