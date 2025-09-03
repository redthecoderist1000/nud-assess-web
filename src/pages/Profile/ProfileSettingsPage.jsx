import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleProfile from "../../assets/images/sample_profile.png";
import { userContext } from "../../App";
import Header from "./component/Header";
import Personal from "./component/Personal";
import Privacy from "./component/Privacy";
import Container from "@mui/material/Container";
import { supabase } from "../../helper/Supabase";

const ProfileSettingsPage = () => {
  const navigate = useNavigate();
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

  // Populate form fields with current user info from context
  useEffect(() => {
    if (userCon?.user) {
      setFirstName(userCon.user.f_name || "");
      setMiddleName(userCon.user.m_name || "");
      setLastName(userCon.user.l_name || "");
      setEmail(userCon.user.email || "");
    }
  }, [userCon?.user]);

  const validatePersonalInfo = () => {
    if (!firstName || !lastName || !email) {
      setModalMessage("Please fill in all required personal info fields.");
      setIsModalOpen(true);
      return false;
    }
    return true;
  };

  const validatePrivacy = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setModalMessage("Please fill in all password fields.");
      setIsModalOpen(true);
      return false;
    }
    if (newPassword !== confirmPassword) {
      setModalMessage("New password and confirm password do not match.");
      setIsModalOpen(true);
      return false;
    }
    return true;
  };

  const handleUpdatePersonalInfo = () => {
    if (!validatePersonalInfo()) return;
    setModalMessage("Personal info updated successfully!");
    setIsModalOpen(true);
  };

  const handleUpdatePrivacy = () => {
    if (!validatePrivacy()) return;
    setModalMessage("Password updated successfully!");
    setIsModalOpen(true);
  };

const handleLogout = () => {
  setModalMessage("Are you sure you want to log out? Any unsaved changes will be lost.");
  setIsModalOpen(true);
  setOnConfirmAction(() => async () => {
    await supabase.auth.signOut();
    window.location.replace("/login");
  });
};

 //not yet working
  const handleDeleteAccount = () => {
    setModalMessage("Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, settings, and history will be permanently removed.");
    setIsModalOpen(true);
    setOnConfirmAction(() => async () => {
      await supabase.auth.signOut();
      navigate("/goodbye");
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOnConfirmAction(null);
  };

  const handleModalConfirm = async () => {
    if (onConfirmAction) await onConfirmAction();
    closeModal();
  };

  const userId = userCon?.user?.user_id;

  return (
    <>
      <Container maxWidth="xl" className="my-5">
        <div className="bg-white border-b border-gray-200 pt-6 pb-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-0">Profile Setting</h1>
        </div>
        <Header avatarUrl={avatarUrl} userId={userId} />
        <div className="flex flex-col md:flex-row gap-5 mt-6">
          <div className="flex-1">
            <Personal
              firstName={firstName}
              setFirstName={setFirstName}
              middleName={middleName}
              setMiddleName={setMiddleName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              handleUpdatePersonalInfo={handleUpdatePersonalInfo}
            />
          </div>
          <div className="flex-1">
            <Privacy
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleUpdatePrivacy={handleUpdatePrivacy}
              handleLogout={handleLogout}
              handleDeleteAccount={handleDeleteAccount}
            />
          </div>
        </div>
      </Container>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-10"
          style={{
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.15)",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <p className="mb-4">{modalMessage}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded text-white"
                style={{
                  backgroundColor: "#2D3B87",
                }}
                onClick={closeModal}
              >
                Close
              </button>
              {onConfirmAction && (
                <button
                  className="px-4 py-2 rounded text-white"
                  style={{
                    backgroundColor: "#2D3B87",
                  }}
                  onClick={handleModalConfirm}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;