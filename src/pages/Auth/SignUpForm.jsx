import { useContext, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useNavigate for redirection
import { motion } from "framer-motion";

import { CircularProgress, MenuItem, Select } from "@mui/material";
import { userContext } from "../../App";
import { supabase } from "../../helper/Supabase";

function SignUpForm() {
  const location = useLocation();
  const { user, setUser } = useContext(userContext);
  const [formData, setFormData] = useState({
    user_id: location.state.user_id,
    email: location.state.email,
    suffix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    agreeTerms: false,
    department: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState(""); // State for modal content

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Basic field validations
    if (formData.department == "") {
      setErrorMessage("Please choose the department you belong.");
      setLoading(false);
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage(
        "You must agree to Terms and Privacy Policies to continue."
      );
      setLoading(false);
      return;
    }

    let { data, error } = await supabase
      .from("tbl_users")
      .insert({
        id: formData.user_id,
        suffix: formData.suffix,
        f_name: formData.firstName,
        m_name: formData.middleName,
        l_name: formData.lastName,
        email: formData.email,
        role: "Faculty",
        department_id: formData.department,
      })
      .select("*")
      .single();

    if (error) {
      setErrorMessage("Setup account unsuccessful");
      setLoading(false);
      return;
    }

    setUser({
      ...user,
      email: data.email,
      user_id: data.id,
      suffix: data.suffix,
      role: data.role,
      f_name: data.f_name,
      m_name: data.m_name,
      l_name: data.l_name,
      department_id: data.department_id,
    });
    setLoading(false);
  };

  // Function to open modal with specific content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/3 ">
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Account Setup
      </motion.h1>
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Finish you account creation by setting up your profile.
      </motion.p>
      <div className="space-y-4">
        <div className="flex space-x-4">
          {/* Suffix */}
          <motion.div
            className="relative w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              id="suffix"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="suffix"
              className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Suffix
            </label>
          </motion.div>
          {/* First Name */}
          <motion.div
            className="relative w-1/2"
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
        </div>

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
        {/* <InputLabel id="dept_label">Age</InputLabel> */}
        <Select
          fullWidth
          required
          labelId="dept_label"
          id="dept_select"
          // value={formData.department}
          defaultValue={0}
          name="department"
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={0} disabled>
            --Select Department--
          </MenuItem>
          <MenuItem value="06a33d27-1c14-46b4-ade3-4be2d0a0c20a">
            Information Technology Department
          </MenuItem>
        </Select>
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
        disabled={loading}
        className="w-full mt-4 p-3 bg-[#35408E] text-white rounded-md hover:bg-[#2c357e] transform transition duration-300 hover:scale-105"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? <CircularProgress /> : "Continue"}
      </motion.button>
    </form>
  );
}

export default SignUpForm;
