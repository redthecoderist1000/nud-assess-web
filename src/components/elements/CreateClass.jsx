import React, { useState } from "react";

const CreateClass = ({ onSave, onCancel }) => {
  const [classData, setClassData] = useState({
    code: "",
    name: "",
    section: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setClassData({ ...classData, image: file });
  };

  const handleSubmit = () => {
    if (!classData.code || !classData.name || !classData.section) {
      alert("Please fill in all required fields.");
      return;
    }

    const newClassData = {
      title: `${classData.code} - ${classData.section}`, // Format: Class Code - Section
      desc: classData.name, // Class Name
      image: classData.image || null, 
    };

    onSave(newClassData);
  };

  return (
    <div className="p-4 rounded-md shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Create Class</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Class Code</label>
        <input
          type="text"
          name="code"
          value={classData.code}
          onChange={handleInputChange}
          placeholder="Enter class code (CCTVLAOP)"
          className="mt-1 p-2 block w-full h-10 border-gray-300 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Class Name</label>
        <input
          type="text"
          name="name"
          value={classData.name}
          onChange={handleInputChange}
          placeholder="Enter class name (Introduction to Computing)"
          className="mt-1 p-2 block w-full h-10 border-gray-300 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Section</label>
        <input
          type="text"
          name="section"
          value={classData.section}
          onChange={handleInputChange}
          placeholder="Enter section (INF221)"
          className="mt-1 p-2 block w-full h-10 border-gray-300 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Display Picture (Optional)</label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {classData.image && (
          <p className="mt-2 text-sm text-gray-500">Selected file: {classData.image.name}</p>
        )}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateClass;