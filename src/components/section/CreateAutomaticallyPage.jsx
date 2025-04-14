import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure this import is included
import InputField from "../elements/InputField"; // Ensure this import is included
import PasteOrUpload from "../elements/PasteOrUpload"; // Ensure this import is included

// Inline CSS for floating labels
const styles = `
  .input-container {
    position: relative;
    margin-bottom: 1rem;
  }
  .input-container input,
  .input-container select,
  .input-container textarea {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: transparent;
    outline: none;
    transition: border-color 0.3s ease;
  }
  .input-container input:focus,
  .input-container select:focus,
  .input-container textarea:focus {
    border-color: #35408E;
  }
  .input-container input::placeholder,
  .input-container textarea::placeholder {
    color: #999;
  }
  .input-container label {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    font-size: 1rem;
    color: #999;
    pointer-events: none;
    transition: all 0.3s ease;
  }
  .input-container input:focus + label,
  .input-container input:not(:placeholder-shown) + label {
    top: -0.5rem;
    left: 0.5rem;
    font-size: 0.75rem;
    color: #35408E;
    background-color: white;
    padding: 0 0.25rem;
  }
`;

const CreateAutomaticallyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quizName: "",
    lesson: "",
    course: "",
    class: "Class A", // Default value
    timeLimit: "",
    startDate: "",
    endDate: "",
    totalItems: "",
    randomized: false,
    description: "",
    uploadedFile: null,
    pastedText: "",
  });

  const [errors, setErrors] = useState({});

  const formFields = [
    { id: "quizName", label: "Quiz Name" },
    { id: "lesson", label: "Lesson" },
    { id: "course", label: "Course" },
    { id: "class", label: "Class", type: "select", options: ["Class A", "Class B"] },
    { id: "timeLimit", label: "Time Limit" },
    { id: "startDate", label: "Start Date", type: "date" },
    { id: "endDate", label: "End Date", type: "date" },
    { id: "totalItems", label: "Total Items" },
    { id: "randomized", label: "Randomized Questions?", type: "checkbox" },
    { id: "description", label: "Description", className: "col-span-3" },
  ];

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDeploy = () => {
    console.log("🔄 Validating form data before submission...", formData);

    let newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "randomized" &&
        key !== "uploadedFile" &&
        key !== "pastedText" &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        newErrors[key] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("⚠️ Please fill in all required fields before deploying.");
      return;
    }

    // 📌 Sample Questions
    const sampleQuestions = [
      {
        id: 1,
        type: "multiple choice",
        question: "What is the area of a triangle with a base of 12 cm and a height of 5 cm?",
        choices: ["30 cm²", "60 cm²", "25 cm²", "20 cm²"],
        answer: "30 cm²",
        difficulty: "Applying",
      },
      {
        id: 2,
        type: "true/false",
        question: "The solution to the equation 2(x-3)=10 is x=8.",
        answer: "False",
        difficulty: "Understanding",
      },
      {
        id: 3,
        type: "identification",
        question: "Solve for x in the equation 3x+9=21.",
        answer: "x=4",
        difficulty: "Applying",
      },
    ];

    let finalFormData = { ...formData };
    if (!formData.uploadedFile && !formData.pastedText) {
      finalFormData.sampleQuestions = sampleQuestions;
    }

    console.log("✅ Form is valid! Navigating to QuestionResultPage...", finalFormData);
    navigate("/dashboard/QuestionResult", { state: { formData: finalFormData } });
  };

  return (
    <>
      {/* Inline Styles for Floating Labels */}
      <style>{styles}</style>

      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-5xl font-bold mb-2">Generate Quiz Automatically</h1>
          <p className="text-gray-600">Input basic details and upload your file to generate a quiz.</p>
        </div>

        {/* 📌 Input Fields */}
        <InputField
          fields={formFields}
          onChange={handleInputChange}
          errors={errors}
          formData={formData}
        />

        {/* 📌 Paste or Upload Section */}
        <PasteOrUpload onChange={handleInputChange} />

        {/* 📌 Buttons */}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={() => navigate("/dashboard/QuizManagement")}
            className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            className="bg-[#35408E] text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Deploy
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateAutomaticallyPage;