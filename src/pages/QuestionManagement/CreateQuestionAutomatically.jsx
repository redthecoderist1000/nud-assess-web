import React, { useState, useRef, useEffect, use } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
import CustomTab from "./genQuestionTabs/CustomTab";
import AutoTab from "./genQuestionTabs/AutoTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CreateQuestionAutomatically = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [subjectOptions, setSubjectOption] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [subject, setSubject] = useState("");
  const [lesson, setLesson] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      setSubjectOption(data);
    };

    fetchSubjects();
  }, []);

  // get lessons
  useEffect(() => {
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

    fetchLessons();
  }, [subject]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <h1 className="text-2xl font-bold mb-1 mt-10">Generate questions</h1>
      <p className="text-xs text-gray-500 mb-6">
        Input basic details and upload your file to generate questions
      </p>

      <div className="grid grid-cols-2 gap-4 mb-2">
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
              <MenuItem key={index} value={lesson.id}>
                {lesson.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="Custom" />
            <Tab label="Auto" />
          </Tabs>
        </Box>

        {/* custom */}
        <CustomTabPanel value={tab} index={0}>
          <CustomTab />
        </CustomTabPanel>
        {/* ai */}
        <CustomTabPanel value={tab} index={1}>
          <AutoTab />
        </CustomTabPanel>
      </Box>
    </Container>
  );
};

export default CreateQuestionAutomatically;
