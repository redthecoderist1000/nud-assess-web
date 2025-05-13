import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { motion, AnimatePresence } from "framer-motion";
import signupImage from "../../assets/images/signup_image.png";
import { authContext } from "../section/AuthPage";
import { OtpInput } from "reactjs-otp-input";

import { Button, FormControl, Stack } from "@mui/material";

function SignUpForm() {
  const setIsRegister = useContext(authContext);
  const [otpForm, setOtpForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    otp: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState(""); // State for modal content

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic field validations
    if (!formData.firstName.trim()) {
      setErrorMessage("First Name is required.");

      return;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage("Last Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!formData.password.trim()) {
      setErrorMessage("Password is required.");
      return;
    }
    if (!formData.confirmPassword.trim()) {
      alsetErrorMessageert("Please confirm your password.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage(
        "You must agree to Terms and Privacy Policies to continue."
      );
      return;
    }

    // List of allowed domains
    const allowedDomains = ["@nu-dasma.edu.ph"];

    // Extract the domain from the email
    const emailDomain = formData.email.substring(
      formData.email.lastIndexOf("@")
    );

    // Check if the email domain is in the allowed list
    if (!allowedDomains.includes(emailDomain)) {
      setErrorMessage(
        "Please enter a valid Email address (e.g., example@nu-dasma.edu.ph)."
      );
      return;
    }

    // console.log("Account creation successful", formData);
    // signupData.setSignupData(formData);
    // navigate("/");
    // navigate("/signup-otp");
    setOtpForm(true);
  };

  const changeOtp = (otp) => {
    // otp.preventDefault();
    setFormData({ ...formData, otp: otp });
  };

  const verifyOtp = () => {
    console.log("sakses", formData);
  };

  // Function to open modal with specific content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return otpForm ? (
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
        We already sent an OTP to your email <b>{formData.email}</b> . Please
        verify the OTP.
      </motion.p>
      <OtpInput
        value={formData.otp}
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
        className="text-gray-600 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Don't have any OTP?
        <span className="text-blue-900 cursor-pointer hover:underline">
          {"  "}
          Resend (25s)
        </span>
      </motion.p>
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
  ) : (
    <form onSubmit={handleSubmit} className="w-1/3 ">
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Signup
      </motion.h1>
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Let's get you all set up so you can access your personal account.
      </motion.p>
      <div className="space-y-4">
        {/* First Name */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            id="firstName"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="firstName"
            className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            First Name
          </label>
        </motion.div>
        {/* Middle Name and Last Name */}
        <div className="flex space-x-4">
          <motion.div
            className="relative w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              id="middleName"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="middleName"
              className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Middle Name
            </label>
          </motion.div>
          <motion.div
            className="relative w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              id="lastName"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="lastName"
              className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Last Name
            </label>
          </motion.div>
        </div>
        {/* Email */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            id="email"
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
        {/* Password */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            id="password"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Password
          </label>
        </motion.div>
        {/* Confirm Password */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            id="confirmPassword"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="confirmPassword"
            className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Confirm Password
          </label>
        </motion.div>
      </div>
      {/* Terms and Privacy Policies */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          className="w-4 h-4 border-gray-300 rounded"
        />
        <label className="ml-2 text-gray-600">
          I agree to all the{" "}
          <button
            type="button"
            onClick={() =>
              openModal(
                "Terms and Conditions:\n" +
                  "1. Acceptance of Terms:\n" +
                  "   By accessing or using our services, you agree to comply with and be bound by these Terms and Conditions.\n" +
                  "2. User Responsibilities:\n" +
                  "   You are responsible for maintaining the confidentiality of your account credentials.\n" +
                  "3. Use of Services:\n" +
                  "   Our services are intended for personal and lawful use only.\n" +
                  "4. Intellectual Property:\n" +
                  "   All content, trademarks, logos, and intellectual property on this platform.\n"
              )
            }
            className="text-amber-300 hover:underline focus:outline-none"
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() =>
              openModal(
                "Privacy Policy:\n" +
                  "1. We collect personal data for security purposes.\n" +
                  "2. Your information is kept confidential.\n" +
                  "3. We do not share your data with third parties."
              )
            }
            className="text-amber-300 hover:underline focus:outline-none"
          >
            Privacy Policies
          </button>
        </label>
      </div>
      {/* error message */}
      <p className="text-red-500 mt-4">{errorMessage}</p>
      {/* Submit Button */}
      <motion.button
        type="submit"
        className="w-full mt-4 p-3 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transform transition duration-300 hover:scale-105"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Continue
      </motion.button>
      {/* Additional Feature */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => setIsRegister(false)}
            className="text-amber-400 cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>
        {/* <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-2 text-sm text-gray-500">
                  or login with
                </span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div> */}
        {/* <button
                type="button"
                className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md hover:bg-[#35408E] hover:text-white transition-colors duration-200"
              >
                <img src={microsoftLogo} alt="Microsoft" className="w-5 h-5 mr-2" />
                Log in with Microsoft
              </button> */}
      </motion.div>
    </form>
  );
}

export default SignUpForm;
