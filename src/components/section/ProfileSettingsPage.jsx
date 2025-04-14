import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import sampleProfile from "../../assets/images/sample_profile.png";
import classpagePicture from "../../assets/images/ClasspagePicture.png";
import { motion } from "framer-motion"; // Import motion from framer-motion

const ProfileSettingsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [avatarUrl, setAvatarUrl] = useState(sampleProfile);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null); // Function to execute on confirm

  // Function to handle file upload for avatar
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation for Personal Info Section
  const validatePersonalInfo = () => {
    if (!firstName.trim()) {
      alert("First Name is required.");
      return false;
    }
    if (!lastName.trim()) {
      alert("Last Name is required.");
      return false;
    }
    if (!email.trim()) {
      alert("Email is required.");
      return false;
    }

    // Enhanced Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Check for common domain typos
    const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    const emailParts = email.trim().split("@");
    if (emailParts.length === 2) {
      const domain = emailParts[1].toLowerCase();
      const isDomainValid = commonDomains.some((commonDomain) =>
        domain.includes(commonDomain)
      );
      if (!isDomainValid) {
        alert(
          "The email domain seems incorrect. Please double-check the domain (e.g., gmail.com)."
        );
        return false;
      }
    }

    return true; // All validations passed
  };

  // Validation for Privacy Section
  const validatePrivacy = () => {
    if (currentPassword.trim()) {
      // Check if New Password is provided
      if (!newPassword.trim()) {
        alert("New Password is required when Current Password is provided.");
        return false;
      }

      // Check if New Password is at least 6 characters long
      if (newPassword.length < 6) {
        alert("New Password must be at least 6 characters long.");
        return false;
      }

      // Check if New Password and Confirm Password match
      if (newPassword !== confirmPassword) {
        alert("New Password and Confirm Password do not match.");
        return false;
      }
    } else {
      // If Current Password is not provided, ensure no other password fields are filled
      if (newPassword.trim() || confirmPassword.trim()) {
        alert("Please provide the Current Password to update your password.");
        return false;
      }
    }
    return true; // All validations passed
  };

  // Function to handle profile update and redirect to DashboardPage or LoginPage
  const handleUpdate = () => {
    // Check if all fields are empty
    const isPersonalInfoEmpty =
      !firstName.trim() && !middleName.trim() && !lastName.trim() && !email.trim();
    const isPrivacyEmpty =
      !currentPassword.trim() &&
      !newPassword.trim() &&
      !confirmPassword.trim();
    const isAvatarUpdated = avatarUrl !== sampleProfile;

    // If all fields are empty and no avatar change, show an alert
    if (isPersonalInfoEmpty && isPrivacyEmpty && !isAvatarUpdated) {
      alert("No changes detected. Please provide information to update.");
      return;
    }

    let isPersonalInfoValid = true;
    let isPrivacyValid = true;

    // Validate Personal Info only if any field is filled
    if (!isPersonalInfoEmpty) {
      isPersonalInfoValid = validatePersonalInfo();
    }

    // Validate Privacy only if any password field is filled
    if (!isPrivacyEmpty) {
      isPrivacyValid = validatePrivacy();
    }

    // Stop execution if any validation fails
    if (!isPersonalInfoValid || !isPrivacyValid) {
      return;
    }

    // Determine which sections have been updated
    const isPersonalInfoUpdated = !isPersonalInfoEmpty;
    const isPrivacyUpdated = !isPrivacyEmpty;

    // Prepare confirmation messages
    let confirmationMessage = "";
    if (isPersonalInfoUpdated && isPrivacyUpdated && isAvatarUpdated) {
      confirmationMessage =
        "Are you sure you want to change your personal info, password, and avatar?";
    } else if (isPersonalInfoUpdated && isPrivacyUpdated) {
      confirmationMessage =
        "Are you sure you want to change your personal info and password?";
    } else if (isPersonalInfoUpdated && isAvatarUpdated) {
      confirmationMessage =
        "Are you sure you want to change your personal info and avatar?";
    } else if (isPrivacyUpdated && isAvatarUpdated) {
      confirmationMessage =
        "Are you sure you want to change your password and avatar?";
    } else if (isPersonalInfoUpdated) {
      confirmationMessage = "Are you sure you want to change your personal info?";
    } else if (isPrivacyUpdated) {
      confirmationMessage = "Are you sure you want to change your password?";
    } else if (isAvatarUpdated) {
      confirmationMessage = "Are you sure you want to change your avatar?";
    }

    // Show custom modal if any section is updated
    if (confirmationMessage) {
      setModalMessage(confirmationMessage);
      setOnConfirmAction(() => () => {
        console.log("Updating user profile...");
        alert("Profile updated successfully!");

        // Special handling for password updates
        if (isPrivacyUpdated) {
          setIsModalOpen(false); // Close the modal before showing the next one
          setModalMessage("You have updated your password. Are you sure you want to log out?");
          setOnConfirmAction(() => () => navigate("/login"));
          setIsModalOpen(true); // Open the logout confirmation modal
        } else {
          navigate("/dashboard");
        }
      });
      setIsModalOpen(true);
      return;
    }

    // Log update and prepare redirection logic
    console.log("Updating user profile...");
    alert("Profile updated successfully!");

    // Default redirection to DashboardPage.jsx
    navigate("/dashboard");
  };

  // Function to handle logout and redirect to LoginPage
  const handleLogout = () => {
    setModalMessage("Are you sure you want to log out?");
    setOnConfirmAction(() => () => {
      console.log("Logging out...");
      navigate("/login"); // Route to LoginPage.jsx
    });
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Background Image and Profile Picture Container */}
      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide up from 20px
        animate={{ opacity: 1, y: 0 }} // Animate to full opacity and no vertical offset
        transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
      >
        <div className="relative w-full">
          <div
            className="w-full h-48 bg-cover bg-center mb-5 rounded-t-lg"
            style={{ backgroundImage: `url(${classpagePicture})`, backgroundSize: "cover" }}
          ></div>
          <div className="absolute top-35 right-0 mt-[-2rem] mr-4 z-10">
            <img src={avatarUrl} alt="Profile" className="w-30 h-30 rounded-full" />
          </div>
        </div>
        {/* Main Content Container */}
        <div className="px-4 md:px-10 py-8">
          {/* Personal Info Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <section>
                <h3 className="text-lg font-bold mb-2">Personal Info</h3>
                <p className="text-gray-600 mb-4">
                  You can change your personal settings here.
                </p>
              </section>
            </div>
            <div className="w-full md:w-2/3">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="first-name"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                    >
                      First Name
                    </label>
                  </div>
                  {/* Last Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="last-name"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                    >
                      Last Name
                    </label>
                  </div>
                  {/* Middle Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="middle-name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="middle-name"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                    >
                      Middle Name
                    </label>
                  </div>
                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                    >
                      Email
                    </label>
                  </div>
                </div>
                {/* Avatar Upload */}
                <div className="mt-4">
                  <label htmlFor="avatar-upload" className="block mb-1">
                    Change Avatar
                  </label>
                  <div className="flex items-center justify-center w-full h-24 border border-dashed border-gray-300 rounded-md cursor-pointer">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span>Click here to upload your file</span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Separator line for new section */}
          <hr className="border-gray-300 my-8" />
          {/* Privacy Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <section>
                <h3 className="text-lg font-bold mb-2">Privacy</h3>
                <p className="text-gray-600 mb-4">
                  You can change your password here.
                </p>
              </section>
            </div>
            <div className="w-full md:w-2/3">
              {/* Current Password */}
              <div className="relative mt-4">
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="current-password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                >
                  Current Password
                </label>
              </div>
              {/* New Password */}
              <div className="relative mt-4">
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="new-password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                >
                  Enter New Password
                </label>
              </div>
              {/* Confirm Password */}
              <div className="relative mt-4">
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="confirm-password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                >
                  Confirm Password
                </label>
              </div>
              {/* Update Button */}
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
          {/* Separator line for log out section */}
          <hr className="border-gray-300 my-8" />
          {/* Log Out Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <section>
                <h3 className="text-lg font-bold mb-2">Log out</h3>
                <p className="text-gray-600 mb-4">
                  You can log out your account here.
                </p>
              </section>
            </div>
            <div className="mt-4 text-right md:w-2/3">
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-3 text-sm rounded-md hover:bg-red-600"
              >
                Log out account
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                if (onConfirmAction) onConfirmAction();
              }}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;