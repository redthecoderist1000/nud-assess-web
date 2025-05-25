import React, { useState, useRef, useEffect, use } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../helper/Supabase";

const env = import.meta.env;

const CreateQuestionAutomatically = () => {
  const location = useLocation();
  const repository = location.state?.repository || "";
  const [tab, setTab] = useState("paste");
  const [lesson, setLesson] = useState("");
  const [course, setCourse] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Selected Repository:", repository);
  }, [repository]);

  useEffect(() => {
    const fetchSubjects = async () => {
      // fix para assigned subject lang makita
      const { data, error } = await supabase
        .from("vw_assignedsubject")
        .select("*");

      if (error) {
        console.error("Error fetching subjects:", error);
        return;
      }

      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!lesson) {
        setLessons([]);
        return;
      }

      try {
        // console.log("Fetching lessons for subject_id:", lesson);
        const { data, error } = await supabase
          .from("tbl_lesson")
          .select("title, id")
          .eq("subject_id", lesson);

        if (error) {
          console.error("Error fetching lessons:", error);
          return;
        }

        // console.log("Fetched lessons:", data);
        setLessons(data);
      } catch (err) {
        console.error("Unexpected error fetching lessons:", err);
      }
    };

    fetchLessons();
  }, [lesson]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const selectedSubject = subjects.find(
        (subject) => subject.subject_id === lesson
      );

      if (!selectedSubject) {
        alert("Please select a valid subject.");
        setIsLoading(false);
        return;
      }

      // console.log("Selected Subject:", selectedSubject);

      let inputData = "";

      if (tab === "paste") {
        inputData = text;
      } else if (tab === "upload" && file) {
        inputData = await readFileContent(file);
      }

      if (!inputData) {
        alert("Please provide input data by pasting text or uploading a file.");
        setIsLoading(false);
        return;
      }

      // console.log("Input data being sent to Gemini API:", inputData);

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          env.VITE_GEMINI_API_SHAMIAH, // Replace with your API key
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a teacher creating a quiz for the subject "${lesson}" and the lesson "${lessonTitle}". Based on the following content, generate exactly 5 multiple-choice questions. Each question must have 4 choices (A, B, C, D) and specify the correct answer. Ensure that the questions are evenly distributed across the following Table of Specification (TOS) categories:
                  - "Remembering"
                  - "Understanding"
                  - "Applying"
                  - "Analyzing"
                  - "Creating"
                  - "Evaluating"
                  
                  The output MUST be a valid JSON array of objects, where each object has the following keys:
                  - "question": The text of the question.
                  - "choices": An array of 4 strings representing the choices.
                  - "correctAnswer": The correct answer (e.g., "A", "B", "C", or "D").
                  - "tosCategory": The TOS category of the question.
                  
                  Here is the content to base the questions on:\n\n${inputData}
                  Return ONLY a valid JSON array. Do not include any explanation, markdown, or text outside the JSON.`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Raw AI Response Data:", response.data);

      if (!response.data.candidates || response.data.candidates.length === 0) {
        alert(
          "No questions were generated. Please try again with different input."
        );
        setIsLoading(false);
        return;
      }

      const rawText = response.data.candidates[0].content.parts[0].text;

      // console.log("Raw Text from Gemini API:", rawText);

      let cleanedText = rawText.trim();

      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText
          .replace(/```(?:json)?/, "")
          .replace(/```$/, "")
          .trim();
      }

      if (!cleanedText.startsWith("[")) {
        cleanedText = `[${cleanedText}`;
      }

      cleanedText = cleanedText.replace(/,\s*\]$/, "]");

      let parsedQuestions = [];
      try {
        parsedQuestions = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", e);
        // console.log("Cleaned Text:", cleanedText);
        alert(
          "Failed to parse the generated questions. Please check the format."
        );
        setIsLoading(false);
        return;
      }

      const groupedQuestions = parsedQuestions.reduce((acc, question) => {
        const category = question.tosCategory || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(question);
        return acc;
      }, {});

      const allCategories = [
        "Remembering",
        "Understanding",
        "Applying",
        "Analyzing",
        "Creating",
        "Evaluating",
      ];
      allCategories.forEach((category) => {
        if (!groupedQuestions[category]) {
          groupedQuestions[category] = [];
        }
      });

      allCategories.forEach((category) => {
        if (groupedQuestions[category].length === 0) {
          groupedQuestions[category].push({
            id: `placeholder-${category}`,
            type: "Generated",
            question: `Placeholder question for ${category}`,
            choices: ["A", "B", "C", "D"],
            answer: "A",
            tosCategory: category,
          });
        }
      });

      const generatedQuestions = parsedQuestions.map((q, index) => ({
        id: index + 1,
        type: "Generated",
        question: q.question,
        choices: q.choices,
        answer: q.correctAnswer,
        tosCategory: q.tosCategory,
      }));

      // console.log("Generated Questions:", generatedQuestions);
      // console.log("Lesson ID being passed:", lesson);

      navigate("/dashboard/QuestionSummary", {
        state: {
          formData: {
            lesson: selectedSubject.subject_name,
            lessonId: selectedSubject.subject_id,
            course,
            lessonTitle,
            lessonId: course,
            questions: generatedQuestions,
          },
          repository: repository,
        },
      });
    } catch (error) {
      console.error(
        "Error generating questions:",
        error.response?.data || error.message
      );
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-12 py-8">
      <h1 className="text-2xl font-bold mb-1">Generate questions</h1>
      <p className="text-xs text-gray-500 mb-6">
        Input basic details and upload your file to generate questions
      </p>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-xs text-gray-700 mb-1">Subject</label>
          <select
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="" disabled>
              Select a subject
            </option>
            {subjects.map((subject, index) => (
              <option key={subject.index} value={subject.subject_id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-700 mb-1">Lesson</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              !lesson
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            disabled={!lesson}
          >
            <option value="" disabled>
              Select a lesson
            </option>
            {lessons.map((lesson, index) => (
              <option key={index} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-b border-gray-300 mb-2 flex">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "paste"
              ? "border-b-2 border-blue-900 text-blue-900"
              : "text-gray-500"
          }`}
          onClick={() => setTab("paste")}
        >
          Paste text
        </button>
        {/* <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "upload"
              ? "border-b-2 border-blue-900 text-blue-900"
              : "text-gray-500"
          }`}
          onClick={() => setTab("upload")}
        >
          Upload file
        </button> */}
      </div>
      {tab === "paste" ? (
        <textarea
          className="w-full h-52 bg-[#D9DCEE] rounded p-3 text-sm text-gray-700 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          placeholder="Paste your text here and we will do the rest..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div
          className="w-full mb-8 bg-[#D9DCEE] rounded-lg flex flex-col items-center justify-center py-8 relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <svg
            className="w-10 h-10 mb-2 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0l-4 4m4-4l4 4M20 16.5A2.5 2.5 0 0017.5 14H17v-2a5 5 0 00-10 0v2h-.5A2.5 2.5 0 004 16.5v2A2.5 2.5 0 006.5 21h11a2.5 2.5 0 002.5-2.5v-2z"
            />
          </svg>
          <div className="text-center">
            <div className="font-semibold">Drag and drop your file.</div>
            <div className="text-xs text-gray-700 mb-4">
              Supported file types are pdf, docs, etc
            </div>
            <button
              type="button"
              className="bg-blue-900 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
              onClick={handleBrowseClick}
            >
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <div className="mt-2 text-sm text-gray-800">
                Selected file: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button className="bg-red-600 text-white px-8 py-2 rounded font-semibold hover:bg-red-700 transition">
          Cancel
        </button>
        <button
          className="bg-blue-900 text-white px-8 py-2 rounded font-semibold hover:bg-blue-800 transition"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate questions"}
        </button>
      </div>
    </div>
  );
};

export default CreateQuestionAutomatically;
