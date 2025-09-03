import React from "react";

const Personal = ({
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  email,
  setEmail,
  handleUpdatePersonalInfo,
}) => (
  <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-indigo-600">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-1.33-2.67-4-8-4z" fill="currentColor"/>
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      </div>
      <p className="text-gray-500 text-sm">Update your personal details</p>
    </div>
    <form>
      <div className="space-y-4">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="First Name"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Last Name"
          />
        </div>
        <div>
          <label htmlFor="middle-name" className="block text-sm font-medium text-gray-700 mb-1">
            Middle Name
          </label>
          <input
            type="text"
            id="middle-name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Middle Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email Address"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleUpdatePersonalInfo}
        className="mt-6 w-full flex items-center justify-center gap-2 text-white font-medium py-2 rounded-md hover:bg-indigo-800 transition"
        style={{
        backgroundColor: "#2D3B87",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Update Personal Info
      </button>
    </form>
  </div>
);

export default Personal;