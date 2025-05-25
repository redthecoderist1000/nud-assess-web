import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialRow = {
  lesson: "",
  percentage: "",
  easyRemembering: "",
  easyUnderstanding: "",
  averageApplying: "",
  averageAnalyzing: "",
  difficultCreating: "",
  difficultEvaluating: "",
  numItems: "",
};

const lessonOptions = [
  { value: "", label: "-" },
  { value: "Lesson 1", label: "Lesson 1" },
  { value: "Lesson 2", label: "Lesson 2" },
];

const TOS = () => {
  const [rows, setRows] = useState([{ ...initialRow }, { ...initialRow }]);
  const navigate = useNavigate();

  const handleChange = (idx, field, value) => {
    const updated = rows.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    setRows(updated);
  };

  const handleAddRow = () => {
    setRows([...rows, { ...initialRow }]);
  };

  const handleNext = () => {
    navigate("/dashboard/CreateAutomatically");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start p-6">
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Table of Specification</h1>
        <p className="mb-6 text-gray-600">
          Create Table of Specification to create a quiz.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#e6eaff]">
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E] rounded-tl-lg">
                  Lesson<span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Hours
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Percentage
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Easy-Remembering
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Easy-Understanding
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Average-Applying
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Average-Analyzing
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Difficult-Creating
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E]">
                  Difficult-Evaluating
                </th>
                <th className="px-4 py-2 text-left font-semibold text-sm text-[#35408E] rounded-tr-lg">
                  No. of items
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="px-2 py-2">
                    <select
                      className="border rounded px-2 py-1 w-28"
                      value={row.lesson}
                      onChange={(e) =>
                        handleChange(idx, "lesson", e.target.value)
                      }
                    >
                      {lessonOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-20 text-center"
                      value={row.percentage}
                      onChange={(e) =>
                        handleChange(idx, "percentage", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28 text-center"
                      value={row.easyRemembering}
                      onChange={(e) =>
                        handleChange(idx, "easyRemembering", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28 text-center"
                      value={row.easyUnderstanding}
                      onChange={(e) =>
                        handleChange(idx, "easyUnderstanding", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28 text-center"
                      value={row.averageApplying}
                      onChange={(e) =>
                        handleChange(idx, "averageApplying", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28 text-center"
                      value={row.averageAnalyzing}
                      onChange={(e) =>
                        handleChange(idx, "averageAnalyzing", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28 text-center"
                      value={row.difficultCreating}
                      onChange={(e) =>
                        handleChange(idx, "difficultCreating", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28 text-center"
                      value={row.difficultEvaluating}
                      onChange={(e) =>
                        handleChange(idx, "difficultEvaluating", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-20 text-center"
                      value={row.numItems}
                      onChange={(e) =>
                        handleChange(idx, "numItems", e.target.value)
                      }
                      placeholder="-"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-2">
            <button
              className="bg-[#35408E] text-white px-4 py-2 rounded hover:bg-[#2c357e] transition"
              onClick={handleAddRow}
            >
              + Add row
            </button>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-[#35408E] text-white px-8 py-2 rounded hover:bg-[#2c357e] transition text-lg font-semibold shadow">
            Generate
          </button>
          <button
            className="bg-[#35408E] text-white px-8 py-2 rounded hover:bg-[#2c357e] transition text-lg font-semibold shadow"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TOS;
