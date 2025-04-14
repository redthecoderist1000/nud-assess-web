import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../elements/InputField";

const CreateManuallyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quizName: "",
    lesson: "",
    course: "",
    class: "Class A",
    timeLimit: "",
    startDate: "",
    endDate: "",
    totalItems: "",
    randomized: false,
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [rows, setRows] = useState([{}]);
  const [questions, setQuestions] = useState([{ id: 1 }]);

  const formFields = [
    { id: "quizName", label: "Quiz Name", placeholder: "Enter quiz name" },
    { id: "lesson", label: "Lesson", placeholder: "Enter lesson number" },
    { id: "course", label: "Course", placeholder: "Enter course" },
    { id: "class", label: "Class", type: "select", options: ["Class A", "Class B"] },
    { id: "timeLimit", label: "Time Limit", placeholder: "Enter time limit" },
    { id: "startDate", label: "Start Date", type: "date" },
    { id: "endDate", label: "End Date", type: "date" },
    { id: "totalItems", label: "Total Items", placeholder: "Enter total items" },
    { id: "randomized", label: "Randomized Questions?", type: "checkbox" },
    { id: "description", label: "Description", placeholder: "Enter quiz description", className: "col-span-3" },
  ];

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1 }]);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-5xl font-semibold mb-2">Create Quiz Manually</h1>
        <p className="text-gray-600">Fill in the details below to create a quiz manually.</p>
      </div>

      <InputField fields={formFields} onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))} errors={errors} formData={formData} />

      <div>
        <h2 className="text-lg">Step 2: Create your Table of Specification</h2>
        <button onClick={addRow} className="bg-[#35408E] text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">+ Add Row</button>
        <div className="rounded-lg shadow-md overflow-hidden mt-4">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-blue-200 text-sm">
                <th className="border border-gray-300 p-2">Lesson*</th>
                <th className="border border-gray-300 p-2">Percentage</th>
                <th className="border border-gray-300 p-2">Easy-Remembering</th>
                <th className="border border-gray-300 p-2">Easy-Understanding</th>
                <th className="border border-gray-300 p-2">Average-Applying</th>
                <th className="border border-gray-300 p-2">Average-Analyzing</th>
                <th className="border border-gray-300 p-2">Difficult-Creating</th>
                <th className="border border-gray-300 p-2">Difficult-Evaluating</th>
                <th className="border border-gray-300 p-2">No. of Items</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((_, index) => (
                <tr key={index} className="text-sm">
                  {[...Array(9)].map((_, col) => (
                    <td key={col} className="border border-gray-300 p-2"><input type="text" className="w-full" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="my-6" />

      <div>
        <h2 className="text-lg mb-4">Step 3: Create questions or choose in question repository.</h2>
        {questions.map((question, index) => (
          <QuestionItem key={question.id} index={index} />
        ))}
<div className="flex justify-between gap-4">
  <button onClick={addQuestion} className="bg-[#35408E] text-white flex-1 py-5 rounded hover:bg-opacity-80 mt-4"> Add Question</button>
  <button onClick={addQuestion} className="bg-[#35408E] text-white flex-1 py-5 rounded hover:bg-opacity-80 mt-4"> Save Questions</button>
  <button onClick={addQuestion} className="bg-[#35408E] text-white flex-1 py-5 rounded hover:bg-opacity-80 mt-4"> Print</button>
  <button onClick={addQuestion} className="bg-[#35408E] text-white flex-1 py-5 rounded hover:bg-opacity-80 mt-4"> Deploy</button>
</div>

      </div>
    </div>
  );
};

const QuestionItem = ({ index }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  
  return (
    <div className="mb-4 p-4 border rounded shadow-md">
      <h2 className="font-semibold">Question {index + 1}: Remembering</h2>
      <div className="mt-2 flex gap-2 text-blue-500">
        <button onClick={() => setSelectedOption("create")} className="underline hover:text-blue-700">Create question</button>
        <span>or</span>
        <button onClick={() => setSelectedOption("repository")} className="underline text-yellow-500 hover:text-yellow-700">Choose in repository</button>
      </div>
      {selectedOption === "create" && (
        <div className="mt-4">
          <input type="text" className="w-full p-2 border rounded" placeholder="Enter your question here" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
          <select className="w-full mt-2 p-2 border rounded" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="identification">Identification</option>
          </select>
          {questionType === "multiple-choice" ? (
            options.map((option, idx) => (
              <input key={idx} type="text" className="w-full p-2 border rounded mt-2" placeholder={`Option ${String.fromCharCode(65 + idx)}`} value={option} onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                setOptions(newOptions);
              }} />
            ))
          ) : (
            <textarea className="w-full p-2 border rounded mt-2" placeholder="Enter answer here"></textarea>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateManuallyPage;
