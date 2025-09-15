import { useRef, useState, useCallback, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import FileUpload from "../../../components/elements/FileUpload";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";

import { userContext } from "../../../App";
import relevanceCheck from "../../../helper/RelevanceCheck";
import { aiRun } from "../../../helper/Gemini";
import AutoAnswerCard from "./components/AutoAnswerCard";

export default function AutoTab(props) {
  const { subject, lesson, lessonId } = props;

  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [questions, setQuestions] = useState([
    // {
    //   question:
    //     "If a web application allows an attacker to alter the 'userId' parameter in a URL to view or modify another user's account data without proper authorization, which OWASP Top 10 vulnerability is primarily being exploited?",
    //   answers: [
    //     { answer: "A03:2021 - Injection", is_correct: false },
    //     {
    //       answer: "A01:2021 - Broken Access Control",
    //       is_correct: true,
    //     },
    //     {
    //       answer: "A05:2021 - Security Misconfiguration",
    //       is_correct: false,
    //     },
    //     {
    //       answer: "A07:2021 - Identification and Authentication Failures",
    //       is_correct: false,
    //     },
    //   ],
    //   specification: "Analyzing",
    //   topic: "OWASP Top Vulnerabilities",
    //   lesson_id: "230fc74b-4e69-478a-a0bd-b4d2ce012f87",
    // },
    // {
    //   question:
    //     "A development team decides to use HTTP for transmitting sensitive user data and implements a custom, untested hashing algorithm for passwords. Which two OWASP Top 10 vulnerabilities are directly highlighted by these practices, and how are they related?",
    //   answers: [
    //     {
    //       answer:
    //         "A03:2021 - Injection (custom algorithm) and A10:2021 - Server-Side Request Forgery (HTTP transmission)",
    //       is_correct: false,
    //     },
    //     {
    //       answer:
    //         "A05:2021 - Security Misconfiguration (custom algorithm) and A09:2021 - Security Logging and Monitoring Failures (HTTP transmission)",
    //       is_correct: false,
    //     },
    //     {
    //       answer:
    //         "A02:2021 - Cryptographic Failures (custom algorithm, HTTP transmission) and A07:2021 - Identification and Authentication Failures (password handling)",
    //       is_correct: true,
    //     },
    //     {
    //       answer:
    //         "A01:2021 - Broken Access Control (HTTP transmission) and A08:2021 - Software and Data Integrity Failures (custom algorithm)",
    //       is_correct: false,
    //     },
    //   ],
    //   specification: "Analyzing",
    //   topic: "OWASP Top Vulnerabilities",
    //   lesson_id: "230fc74b-4e69-478a-a0bd-b4d2ce012f87",
    // },
  ]);
  const [formData, setFormData] = useState({
    total_items: "",
    cognitive_level: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!subject || !lesson) {
      setSnackbar({
        open: true,
        message: "Please select a subject and lesson.",
        severity: "error",
      });
      return;
    }

    if (files.length === 0) {
      setSnackbar({
        open: true,
        message: "Please upload at least one file.",
        severity: "error",
      });
      return;
    }

    //  const topics = rows.map((data) => ({
    //   text: `${data.totalItems} questions in the topic of ${data.topic}`,
    // }));

    const topicPrompt = [
      {
        text: `${formData.total_items} questions in the topic of ${lesson}`,
      },
    ];

    try {
      setStatus("Reviewing uploaded files...");
      setLoading(true);
      const result = await relevanceCheck(files, topicPrompt);

      if (!result.status) {
        setLoading(false);
        setStatus(null);
        setSnackbar({
          open: true,
          message:
            "The uploaded documents are irrelevant to the topics. Please review and try again.",
          severity: "error",
        });
        return;
      }
    } catch (error) {
      setLoading(false);
      setStatus(null);
      setSnackbar({
        open: true,
        message: "There seems to be a problem on our side. Please try again.",
        severity: "error",
      });
      return;
    }

    const prompt = [
      {
        text: `In the topic of ${lesson} with a lesson_id of ${lessonId}, generate ${formData.total_items} question/s at the '${formData.cognitive_level}' level.`,
      },
    ];

    try {
      setStatus("Generating questions. This may take a while...");
      const result = await aiRun(files, prompt);
      setStatus(null);
      setSnackbar({
        open: true,
        message: "Questions generated successfully!",
        severity: "success",
      });
      setLoading(false);
      setQuestions(result.questions);
      console.log(result.questions);
    } catch (error) {
      setLoading(false);
      setStatus(null);
      setSnackbar({
        open: true,
        message: "There seems to be a problem on our side. Please try again.",
        severity: "error",
      });
    }
  };

  const cognitive_levels = [
    "Remembering",
    "Understanding",
    "Applying",
    "Analyzing",
    "Evaluating",
    "Creating",
  ];

  if (questions.length <= 0) {
    return (
      <Box component="form" onSubmit={submit}>
        <FileUpload files={files} setFiles={setFiles} />
        <Stack direction={"row"} spacing={2} mt={2} mb={2}>
          <TextField
            fullWidth
            size="small"
            label="Total Items"
            type="number"
            required
            inputProps={{ min: 1, max: 10 }}
            value={formData.total_items}
            onChange={(e) =>
              setFormData({ ...formData, total_items: e.target.value })
            }
          />
          <FormControl fullWidth size="small">
            <InputLabel id="cognitive-label">Cognitive Level</InputLabel>
            <Select
              required
              labelId="cognitive-label"
              label="Cognitive Level"
              defaultValue=""
              value={formData.cognitive_level}
              onChange={(e) =>
                setFormData({ ...formData, cognitive_level: e.target.value })
              }
            >
              <MenuItem value="" disabled />
              {cognitive_levels.map((level, index) => (
                <MenuItem key={index} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {loading ? (
          <>
            <LinearProgress />
            <Typography
              color="text.secondary"
              fontStyle="italic"
              alignSelf={"center"}
            >
              {status}
            </Typography>
          </>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disableElevation
            loading={loading}
            startIcon={<AddCircleOutlineRoundedIcon />}
          >
            Submit
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box component="form">
      <Button
        size="small"
        variant="contained"
        color="error"
        disableElevation
        startIcon={<DriveFolderUploadRoundedIcon />}
        onClick={() => setQuestions([])}
      >
        Upload Again
      </Button>
      <Stack rowGap={3} mt={2} mb={2}>
        {questions.map((q, index) => (
          <AutoAnswerCard key={index} question={q} index={index} />
        ))}
      </Stack>
    </Box>
  );
}
