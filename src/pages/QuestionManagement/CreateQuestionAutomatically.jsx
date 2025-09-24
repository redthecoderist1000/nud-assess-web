import React, {
  useState,
  useRef,
  useEffect,
  use,
  useMemo,
  useContext,
} from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "../../helper/Supabase";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import AutoTab from "./genQuestionTabs/AutoTab";
import { userContext } from "../../App";

const CreateQuestionAutomatically = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const repository = searchParams.get("repository");
  const { setSnackbar } = useContext(userContext);
  const [subjectOptions, setSubjectOption] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [subject, setSubject] = useState("");
  const [lesson, setLesson] = useState("");
  const [lessonName, setLessonName] = useState("");

  useEffect(() => {
    const allowedRepo = ["Quiz", "Final Exam", "Private"];

    if (!repository || !allowedRepo.includes(repository)) {
      setSnackbar({
        open: true,
        message: "Invalid repository.",
        severity: "error",
      });
      navigate(-1);
      return;
    }

    if (repository === "Quiz" || repository === "Private") {
      fetchSubjects();
    }
    if (repository === "Final Exam") {
      fetchInchargeSubjects();
    }
  }, [repository]);

  const fetchInchargeSubjects = async () => {
    const { data, error } = await supabase
      .from("vw_inchargesubjects")
      .select("*");

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching subjects. Refresh the page.",
        severity: "error",
      });
      return;
    }

    setSubjectOption(data);
  };

  const fetchSubjects = async () => {
    // fix para assigned subject lang makita
    const { data, error } = await supabase
      .from("vw_assignedsubject")
      .select("*");

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching subjects. Refresh the page.",
        severity: "error",
      });
      return;
    }

    setSubjectOption(data);
  };

  // get lessons
  useEffect(() => {
    fetchLessons();
  }, [subject]);

  const fetchLessons = async () => {
    if (!subject) {
      setLessonOptions([]);
      return;
    }

    try {
      // console.log("Fetching lessons for subject_id:", lesson);
      const { data, error } = await supabase
        .from("tbl_lesson")
        .select("title, id")
        .eq("subject_id", subject);

      if (error) {
        console.error("Error fetching lessons:", error);
        return;
      }

      // console.log("Fetched lessons:", data);
      setLessonOptions(data);
    } catch (err) {
      console.error("Unexpected error fetching lessons:", err);
    }
  };

  return (
    <Container maxWidth="xl">
      <h1 className="text-2xl font-bold mb-1 mt-10">Generate questions</h1>
      <p className="text-xs text-gray-500 mb-6">
        Input basic details and upload your file to generate questions
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* <label className="block text-xs text-gray-700 mb-1">Subject</label> */}
        <FormControl fullWidth size="small">
          <InputLabel id="subjectSelect" required>
            Subject
          </InputLabel>
          <Select
            required
            label="Subject"
            labelId="subjectSelect"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <MenuItem value="" disabled>
              Select a subject
            </MenuItem>
            {subjectOptions.map((subject, index) => (
              <MenuItem key={index} value={subject.subject_id}>
                {subject.subject_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel id="lessonSelect" required>
            Lesson
          </InputLabel>
          <Select
            required
            label="Lesson"
            labelId="lessonSelect"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            disabled={!subject}
          >
            <MenuItem value="" disabled>
              Select a lesson
            </MenuItem>
            {lessonOptions.map((lesson, index) => (
              <MenuItem
                key={index}
                value={lesson.id}
                onClick={() => setLessonName(lesson.title)}
              >
                {lesson.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <AutoTab subject={subject} lesson={lessonName} lessonId={lesson} />
    </Container>
  );
};

export default CreateQuestionAutomatically;
