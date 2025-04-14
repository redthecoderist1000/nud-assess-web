import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion
import logo from "../../assets/images/logo.png";
import hideIcon from "../../assets/images/hide.png";
import unhideIcon from "../../assets/images/unhide.png";
import setPassImage from "../../assets/images/setpass_image.png";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      alert("Both fields are required");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else if (password.length < 6) {
      alert("Password must be at least 6 characters long");
    } else {
      alert("Password successfully changed!");
      navigate("/"); // Redirect to login page
    }
  };

  return (
    <motion.div
      className="relative w-full h-screen flex p-8 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Logo */}
      <motion.header
        className="absolute top-6 left-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img src={logo} alt="NUD Assess Logo" className="h-10" />
      </motion.header>

      {/* Left Section: Change Password Form */}
      <motion.div
        className="w-1/2 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="w-2/3">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Set a password
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Your previous password has been reset. Please set a new password for your account.
          </motion.p>

          <div className="space-y-4">
            {/* Password Input Field with Floating Label */}
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 placeholder-transparent"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Password
              </label>
              {password && (
                <img
                  src={showPassword ? unhideIcon : hideIcon}
                  alt="Toggle Password Visibility"
                  className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </motion.div>

            {/* Confirm Password Input Field with Floating Label */}
            <motion.div
              className="relative w-full mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="re-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 placeholder-transparent"
                placeholder=" "
              />
              <label
                htmlFor="re-password"
                className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Re-enter Password
              </label>
              {confirmPassword && (
                <img
                  src={showConfirmPassword ? unhideIcon : hideIcon}
                  alt="Toggle Confirm Password Visibility"
                  className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </motion.div>

            {/* Submit Button with Hover Effect */}
            <motion.button
              onClick={handleSubmit}
              className="w-full p-3 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }} // Slight scaling effect on hover
            >
              Set password
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Right Section: Image Display */}
      <motion.div
        className="w-1/2 flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <img src={setPassImage} alt="Set Password Illustration" className="max-w-full h-auto" />
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordPage;
