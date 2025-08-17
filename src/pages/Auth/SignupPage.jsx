import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/logo.png";
import signupImage from "../../assets/images/signup_image.png";
import microsoftLogo from "../../assets/images/microsoftlogo.png";
import { signupContext, userContext } from "../../App";
import SignUpForm from "./SignUpForm";

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState(""); // State for modal content

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
