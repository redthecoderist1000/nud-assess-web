import React, { useState } from "react";
import LogoutDialog from "./LogoutDialog";

const Privacy = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleUpdatePrivacy,
  handleLogout,
  handleDeleteAccount,
}) => {
  const [logout, setLogout] = useState(false);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Privacy Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-indigo-600">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-1.33-2.67-4-8-4z"
                fill="currentColor"
              />
            </svg>
          </span>
          <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Update your password and manage account access
        </p>
      </div>
      <form>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your new password"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm your new password"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleUpdatePrivacy}
          className="mt-6 w-full flex items-center justify-center gap-2 text-white font-medium py-2 rounded-md hover:bg-indigo-800 transition"
          style={{
            backgroundColor: "#2D3B87",
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M5 13l4 4L19 7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Update Password
        </button>
      </form>
      <hr className="border-gray-300 my-6" />
      {/* Log Out Section */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-900 mb-1">Log Out</h3>
        <p className="text-gray-500 text-sm mb-2">
          Sign out of your TestBank Pro account on this device
        </p>
        <button
          type="button"
          onClick={() => setLogout(true)}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-medium py-2 rounded-md hover:bg-gray-100 transition"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log Out Account
        </button>
      </div>
      {/* Delete Account Section */}
      <div>
        <h3 className="text-md font-semibold text-red-600 mb-1">
          Delete Account
        </h3>
        <p className="text-gray-500 text-sm mb-2">
          Permanently delete your account and all associated data
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M6 7h12M9 7V5a3 3 0 016 0v2m-9 0v10a2 2 0 002 2h6a2 2 0 002-2V7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Delete Account
        </button>
      </div>

      <LogoutDialog open={logout} onClose={() => setLogout(false)} />
    </div>
  );
};

export default Privacy;
