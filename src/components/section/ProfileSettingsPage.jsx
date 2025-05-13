import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import sampleProfile from "../../assets/images/sample_profile.png";
import classpagePicture from "../../assets/images/ClasspagePicture.png";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { userContext } from "../../App";
import { supabase } from "../../helper/Supabase";

const ProfileSettingsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const userCon = useContext(userContext);
  const [avatarUrl, setAvatarUrl] = useState(sampleProfile);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;

    // Check for common domain typos
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
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

  const validatePrivacy = () => {
    if (currentPassword.trim()) {
      if (!newPassword.trim()) {
        alert("New Password is required when Current Password is provided.");
        return false;
      }
      if (newPassword.length < 6) {
        alert("New Password must be at least 6 characters long.");
        return false;
      }
      if (newPassword !== confirmPassword) {
        alert("New Password and Confirm Password do not match.");
        return false;
      }
    } else {
      if (newPassword.trim() || confirmPassword.trim()) {
        alert("Please provide the Current Password to update your password.");
        return false;
      }
    }
    return true;
  };

  const handleUpdatePersonalInfo = () => {
    if (!validatePersonalInfo()) return;
    setModalMessage(
      "Are you sure you want to update your personal information?"
    );
    setOnConfirmAction(() => () => {
      console.log("Updating personal information...");
      alert("Personal information updated successfully!");
      navigate("/dashboard");
    });
    setIsModalOpen(true);
  };
  // Function to handle profile update and redirect to DashboardPage or LoginPage
  const handleUpdate = () => {
    // Check if all fields are empty
    const isPersonalInfoEmpty =
      !firstName.trim() &&
      !middleName.trim() &&
      !lastName.trim() &&
      !email.trim();
    const isPrivacyEmpty =
      !currentPassword.trim() && !newPassword.trim() && !confirmPassword.trim();
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
      confirmationMessage =
        "Are you sure you want to change your personal info?";
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
          setModalMessage(
            "You have updated your password. Are you sure you want to log out?"
          );
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
  };
  const handleUpdatePrivacy = () => {
    if (!validatePrivacy()) return;
    setModalMessage("Are you sure you want to update your password?");
    setOnConfirmAction(() => () => {
      console.log("Updating password...");
      alert("Password updated successfully!");
      navigate("/dashboard");
    });
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setModalMessage("Are you sure you want to log out?");
    setOnConfirmAction(() => async () => {
      console.log("Logging out...");

      const { error } = await supabase.auth.signOut();

      userCon.setUser({});

      // navigate("/"); // Route to LoginPage.jsx
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-full">
          <div
            className="w-full h-48 bg-cover bg-center mb-5 rounded-t-lg"
            style={{
              backgroundImage: `url(${classpagePicture})`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className="absolute top-35 right-0 mt-[-2rem] mr-4 z-10">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-30 h-30 rounded-full"
            />
          </div>
        </div>
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
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={handleUpdatePersonalInfo}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                  >
                    Update Personal Info
                  </button>
                </div>
              </form>
            </div>
          </div>
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
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={handleUpdatePrivacy}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                >
                  Update Privacy
                </button>
              </div>
            </div>
          </div>
          <hr className="border-gray-300 my-8" />
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
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
