import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionRepoModal from "../elements/QuestionRepoModal";
import { supabase } from "../../helper/Supabase";

const QuestionManagementPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState("1st Year");
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [yearSubjects, setYearSubjects] = useState({
    "1st Year": [],
    "2nd Year": [],
    "3rd Year": [],
    "4th Year": [],
  });
  const [lessons, setLessons] = useState({});
  const navigate = useNavigate();

  // Map dropdown values to database year_level values
  const yearLevelMapping = {
    "1st Year": "first-year",
    "2nd Year": "second-year",
    "3rd Year": "third-year",
    "4th Year": "fourth-year",
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from("tbl_subject")
          .select("id, subject_code, name, year_level");

        if (error) throw error;

        const subjectsByYear = data.reduce((acc, subject) => {
          const { year_level, id, name } = subject;
          const mappedYear = Object.keys(yearLevelMapping).find(
            (key) => yearLevelMapping[key] === year_level
          );
          if (!acc[mappedYear]) acc[mappedYear] = [];
          acc[mappedYear].push({ id, name });
          return acc;
        }, {});

        setYearSubjects((prev) => ({
          ...prev,
          ...subjectsByYear,
        }));
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
      }
    };

    fetchSubjects();
  }, []);

  const toggleDropdown = async (index, subjectId) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tbl_lesson")
        .select("id, title")
        .eq("subject_id", subjectId); // Use subject.id here

      if (error) throw error;

      setLessons((prev) => ({
        ...prev,
        [subjectId]: data,
      }));
    } catch (error) {
      console.error("Error fetching lessons:", error.message);
    }

    setOpenDropdown(index);
  };

  const selectYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleLessonClick = (lesson) => {
    navigate("/dashboard/QuestionDetails", {
      state: { lesson },
    });
  };

  return (
    <motion.div
      className="flex h-screen overflow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <main className="flex-1 p-6 min-h-screen flex flex-col">
        <div>
          <h1 className="text-5xl font-bold mb-4">Question Management</h1>
          <p className="text-gray-600 mb-6">
            Design and customize quizzes with questions, options, and scoring rules.
          </p>
        </div>

        <div className="flex items-center justify-between py-3 px-4 rounded-lg">
          <div className="flex space-x-4">
            <button className="text-blue-900 py-2 px-4 rounded-lg hover:bg-gray-400">
              <span>My Questions</span>
            </button>
            <button className="text-blue-900 py-2 px-4 rounded-lg hover:bg-gray-400">
              <span>Shared Questions</span>
            </button>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              onClick={() => setRepoModalOpen(true)}
            >
              <span>Create Questions</span>
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow-lg border mt-1 w-full overflow">
          <div className="bg-blue-900 text-yellow-400 text-xl font-bold p-4 rounded-t-lg flex justify-between items-center">
            <span>{selectedYear}</span>
            <select
              id="yearDropdown"
              value={selectedYear}
              onChange={selectYear}
              className="p-2 border rounded-lg bg-white text-blue-900"
            >
              {Object.keys(yearSubjects).map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4">
            {yearSubjects[selectedYear]?.length > 0 ? (
              yearSubjects[selectedYear].map((subject, index) => (
                <div key={index} className="border-b py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{subject.name}</h3>
                    </div>
                    <button
                      onClick={() => toggleDropdown(index, subject.id)} // Use subject.id here
                      className="text-gray-600"
                    >
                      {openDropdown === index ? "▲" : "▼"}
                    </button>
                  </div>
                  <div
                    className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                      openDropdown === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <div className="py-2 text-gray-700">
                      {lessons[subject.id]?.length > 0 ? ( // Use subject.id here
                        lessons[subject.id].map((lesson) => (
                          <p
                            key={lesson.id}
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() => handleLessonClick(lesson)}
                          >
                            {lesson.title}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500">No lessons in this subject.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No subjects available for this year.</p>
            )}
          </div>
        </div>

        <QuestionRepoModal
          isOpen={repoModalOpen}
          onClose={() => setRepoModalOpen(false)}
          onSelect={() => navigate("/dashboard/CreateQuestionAutomatically")}
        />
      </main>
    </motion.div>
  );
};

export default QuestionManagementPage;