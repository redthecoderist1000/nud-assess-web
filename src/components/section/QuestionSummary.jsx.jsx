import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../helper/Supabase";

const QuestionSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};
  const repository = location.state?.repository || "";
  const questions = formData.questions || [];

  const handleSave = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User is not logged in. Please log in to save questions.");
        return;
      }

      const questionsToInsert = questions.map((q) => ({
        question: q.question || "No question text available",
        lesson_id: formData.course || null,
        type: "Multiple Choice",
        blooms_category: q.tosCategory,
        repository: repository,
      }));

      console.log(questions);

      // console.log("Inserting questions into tbl_question:", questionsToInsert);

      // const { data, error } = await supabase
      //   .from("tbl_question")
      //   .insert(questionsToInsert)
      //   .select();

      // if (error) {
      //   console.error("Error inserting questions:", error);
      //   alert("Failed to save questions. Please try again.");
      //   return;
      // }

      // console.log("Questions inserted successfully:", data);
      // alert("Questions have been saved to the bank!");
    } catch (err) {
      console.error("Unexpected error saving questions:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // console.log("Location State in QuestionSummary:", location.state);
  // console.log("Form Data in QuestionSummary:", formData);
  // console.log("Questions in QuestionSummary:", questions);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(questions.map((q) => q.tosCategory || "Uncategorized")),
  ];

  const filteredQuestions =
    selectedCategory === "All"
      ? questions
      : questions.filter((q) => q.tosCategory === selectedCategory);

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="w-full p-6 shadow-lg">
        <h1 className="text-5xl font-bold mb-2">Question Summary</h1>
        <p className="text-gray-600">
          No questions were generated. Please try again.
        </p>
      </div>
    );
  }

  const handleCancel = () => {
    navigate("/dashboard/QuestionManagement");
  };

  return (
    <div className="w-full p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-5xl font-bold mb-2">Question Summary</h1>
        <p className="text-gray-600">
          Here are the details and generated questions.
        </p>
      </div>

      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Question Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              value={formData.lesson || "N/A"}
              readOnly
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lesson
            </label>
            <input
              type="text"
              value={formData.course || "N/A"}
              readOnly
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Filter by TOS Category */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Filter by TOS Category</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Display Questions */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Generated Questions</h2>
        {filteredQuestions.map((q, index) => (
          <div key={q.id || index} className="mb-6 border-b pb-4 shadow-sm">
            <p className="text-lg font-bold">
              {index + 1}. {q.question || "No question text available"}
            </p>
            <ul className="mt-2 list-disc pl-6">
              {q.choices && q.choices.length > 0 ? (
                q.choices.map((choice, i) => (
                  <li key={i} className="text-gray-700">
                    {String.fromCharCode(65 + i)}. {choice}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No choices available</li>
              )}
            </ul>
            <p className="mt-2 font-bold text-blue-600">
              Correct Answer: {q.answer || "N/A"}
            </p>
            <p className="mt-2 font-bold text-green-600">
              TOS Category: {q.tosCategory || "Uncategorized"}
            </p>
          </div>
        ))}
      </div>

      {/* Save and Cancel Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          Save in the Bank
        </button>
      </div>
    </div>
  );
};

export default QuestionSummary;
