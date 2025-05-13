import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/logo.png";
import signupImage from "../../assets/images/signup_image.png";
import microsoftLogo from "../../assets/images/microsoftlogo.png";
import { signupContext } from "../../App";
import SignUpForm from "../elements/SignUpForm";

import Container from "@mui/material/Container";
import { Stack } from "@mui/material";

const SignupPage = (props) => {
  const signupData = useContext(signupContext);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState(""); // State for modal content

  const navigate = useNavigate(); // Initialize useNavigate

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

    console.log("Account creation successful", formData);
    signupData.setSignupData(formData);
    navigate("/");
    // navigate("/signup-otp");
  };

  // Function to open modal with specific content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
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
      {/* <Stack direction="column"> */}
      <SignUpForm />
      {/* <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => props.setIsRegister(false)}
              className="text-amber-400 cursor-pointer hover:underline"
            >
              Log In
            </span>
          </p>
        </motion.div> */}
      {/* </Stack> */}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
            >
              <h2 className="text-xl font-bold mb-4">Information</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {modalContent}
              </p>
              <button
                onClick={closeModal}
                className="mt-6 w-full p-2 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transform transition duration-300 hover:scale-105"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SignupPage;
