import React, { useState, useRef } from "react";

const PasteOrUpload = ({ setQuizContent }) => {
  const [activeTab, setActiveTab] = useState("paste");
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Update state in parent for text input
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (setQuizContent) {
      setQuizContent(e.target.value); // Send text content to parent
    }
  };

  // Update state in parent for file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      if (setQuizContent) {
        setQuizContent(file); // Send the entire file to parent (not just the name)
      }
    }
  };

  return (
    <div className="w-full">
      {/* Tabs for Paste or Upload */}
      <div className="flex space-x-6 border-b border-gray-300">
        <button
          className={`pb-2 font-medium transition-all border-b-2 ${
            activeTab === "paste"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("paste")}
        >
          Paste text
        </button>
        <button
          className={`pb-2 font-medium transition-all border-b-2 ${
            activeTab === "upload"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => {
            setActiveTab("upload");
            setTimeout(() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }, 100); // Ensures the tab switches before file input click
          }}
        >
          Upload file
        </button>
      </div>

      {/* Content Box */}
      <div className="w-full mt-4 border border-gray-300 rounded-md bg-gray-100 p-4 h-40 flex items-center justify-center">
        {activeTab === "paste" ? (
          <textarea
            className="w-full h-full p-2 bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md resize-none"
            placeholder="Paste your text here..."
            value={text}
            onChange={handleTextChange}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <p className="text-gray-600">{selectedFile}</p> // Display file name
            ) : (
              <label
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Click to upload a file
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasteOrUpload;
