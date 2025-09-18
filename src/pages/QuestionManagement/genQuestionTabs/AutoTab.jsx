import { useState, useContext, createContext } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  TextField,
  FormControl,
  Divider,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FileUpload from "../../../components/elements/FileUpload";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

import { userContext } from "../../../App";
import { relevanceCheck, relevanceAbort } from "../../../helper/RelevanceCheck";
import { aiRun, aiAbort } from "../../../helper/Gemini";
import AnswerCard from "./components/AnswerCard";
import { useLocation, useNavigate } from "react-router-dom";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { supabase } from "../../../helper/Supabase";
import GenQuestionDialog from "./GenQuestionDialog";

export const questionContext = createContext();

export default function AutoTab(props) {
  const navigate = useNavigate();
  const { subject, lesson, lessonId } = props;
  const { setSnackbar } = useContext(userContext);

  const location = useLocation();
  const repository = location.state.repository;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [cognitive_levels, setCognitiveLevels] = useState([
    { label: "Remembering", isSelected: false },
    { label: "Understanding", isSelected: false },
    { label: "Applying", isSelected: false },
    { label: "Analyzing", isSelected: false },
    { label: "Evaluating", isSelected: false },
    { label: "Creating", isSelected: false },
  ]);
  const [items, setItems] = useState([
    {
      question: "",
      type: "Multiple Choice",
      specification: "",
      repository: repository,
      ai_generated: false,
      answers: [
        {
          answer: "",
          is_correct: true,
        },
      ],
    },
  ]);
  const [formData, setFormData] = useState({
    total_items: "",
    cognitive_level: "",
  });
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  const generateQuestion = async (e) => {
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

    if (!cognitive_levels.some((level) => level.isSelected)) {
      setSnackbar({
        open: true,
        message: "Please select at least one cognitive level.",
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

    // relevance check
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
      console.log(error);
      setLoading(false);
      setStatus(null);
      setSnackbar({
        open: true,
        message: "There seems to be a problem on our side. Please try again.",
        severity: "error",
      });
      return;
    }

    // generate question

    const prompt = cognitive_levels
      .filter((level) => level.isSelected)
      .map((level) => ({
        text: `In the topic of ${lesson} with a lesson_id of ${lessonId}, generate ${formData.total_items} question/s at the '${level.label}' level.`,
      }));

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

      const newitems = result.questions.map((q) => ({
        ...q,
        lesson_id: lessonId,
        type: "Multiple Choice",
        repository: repository,
      }));
      setItems((prev) => [...prev, ...newitems]);
      //

      // setItems(result.questions);
      // console.log(result.questions);
    } catch (error) {
      console.log(error);
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted by the user.");
        setLoading(false);
        setStatus(null);
        setSnackbar({
          open: true,
          message: "Question generation was aborted.",
          severity: "info",
        });
        return;
      }
      console.error(error);
      setLoading(false);
      setStatus(null);
      setSnackbar({
        open: true,
        message: "There seems to be a problem on our side. Please try again.",
        severity: "error",
      });
    }
  };

  const stopAi = () => {
    relevanceAbort();
    aiAbort();
    //
    console.log("aborting request...");
    // setLoading(false);
    // setStatus(null);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        question: "",
        type: "Multiple Choice",
        specification: "",
        repository: repository,
        ai_generated: false,
        answers: [
          {
            answer: "",
            is_correct: true,
          },
        ],
      },
    ]);
  };

  const handleCognitiveLevelChange = (index) => {
    // only  one can be selected

    const updatedLevels = cognitive_levels.map((level, i) =>
      i === index
        ? { ...level, isSelected: !level.isSelected }
        : { ...level, isSelected: false }
    );

    // const updatedLevels = cognitive_levels.map((level, i) =>
    //   i === index ? { ...level, isSelected: !level.isSelected } : level
    // );
    setCognitiveLevels(updatedLevels);
  };

  const isAllChecked = () => {
    const checked = items.filter((item) => item.is_checked);
    return checked.length === items.length;
  };

  const hasSimilar = () => {
    const similar = items.filter((item) => item.is_checked && item.has_similar);

    return similar.length > 0;
  };

  const validate = (e) => {
    e.preventDefault();
    if (!subject || !lesson) {
      setSnackbar({
        open: true,
        message: "Please select a subject and lesson.",
        severity: "error",
      });

      return;
    }

    if (items.length === 0) {
      setSnackbar({
        open: true,
        message: "No questions to upload.",
        severity: "error",
      });
      return;
    }

    if (!isAllChecked()) {
      setDialog({
        open: true,
        title: "Unverified Questions",
        content:
          "Some questions haven't been checked. Do you want to continue?",
        action: () => {
          uploadQuestion();
        },
      });
      return;
    }

    if (hasSimilar()) {
      setDialog({
        open: true,
        title: "Similar Questions",
        content:
          "Some questions have similar content. Do you want to continue?",
        action: () => {
          uploadQuestion();
        },
      });
      return;
    }
  };

  const uploadQuestion = () => {
    // console.log("items to upload:", items);

    setLoading(true);
    items.map(async (d, i) => {
      // check if it has image
      const hasImage = d.image && d.image != null;

      if (hasImage) {
        const fileName = `${Math.random()}-${d.image.name}`;
        const { data: storageData, error: storageErr } = await supabase.storage
          .from("question_image")
          .upload(fileName, d.image);
        if (storageErr) {
          console.error("error uploading image:", storageErr);
        } else {
          d.image_url = storageData.path;
        }
      }

      const { data: question_id, error: questionError } = await supabase
        .from("tbl_question")
        .insert({
          question: d.question,
          type: d.type,
          blooms_category: d.specification,
          repository: d.repository,
          lesson_id: lessonId,
          image: d.image_url ?? null,
          ai_generated: d.ai_generated ?? false,
        })
        .select("id")
        .single();

      if (questionError) {
        console.error("error inserting question:", questionError);
      }

      if (Array.isArray(d.answers)) {
        d.answers.map(async (ans, _) => {
          await supabase.from("tbl_answer").insert({
            question_id: question_id.id,
            answer: ans.answer,
            is_correct: ans.is_correct,
          });
        });
      } else {
        await supabase
          .from("tbl_answer")
          .insert({ question_id: question_id.id, answer: d.answers.answer });
      }
    });

    setSnackbar({
      open: true,
      message: "Questions uploaded successfully.",
      severity: "success",
    });
    setDialog({ ...dialog, open: false });
    setItems([]);

    setLoading(false);
  };

  return (
    <>
      <Box component="form" onSubmit={generateQuestion}>
        <FileUpload files={files} setFiles={setFiles} />
        <Stack
          direction={"row"}
          spacing={2}
          mt={2}
          mb={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <TextField
            fullWidth
            size="small"
            label="Total Items"
            type="number"
            required
            inputProps={{ min: 1, max: 100 }}
            value={formData.total_items}
            sx={{ maxWidth: "150px" }}
            onChange={(e) =>
              setFormData({ ...formData, total_items: e.target.value })
            }
          />
          <FormControl
            component={"fieldset"}
            variant="filled"
            size="small"
            required
          >
            <FormLabel>Cognitive Levels</FormLabel>
            <FormGroup row>
              {cognitive_levels.map((level, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={level.isSelected}
                      onClick={() => handleCognitiveLevelChange(index)}
                    />
                  }
                  label={
                    <Typography variant="caption">{level.label}</Typography>
                  }
                  labelPlacement="bottom"
                />
              ))}
            </FormGroup>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            disableElevation
            disabled={loading}
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{ textTransform: "none", minWidth: "200px" }}
          >
            {loading ? "Generating..." : "Generate with AI"}
          </Button>
        </Stack>
        {loading && (
          <>
            <Typography
              color="text.secondary"
              fontStyle="italic"
              alignSelf={"center"}
            >
              {status}
            </Typography>
          </>
        )}
        <Divider sx={{ my: 5 }}>
          <Typography variant="caption" color="text.secondary">
            or add manually
          </Typography>
        </Divider>
      </Box>
      <Box component="form" onSubmit={validate}>
        <Stack rowGap={3} mt={2} mb={2}>
          <questionContext.Provider value={{ items, setItems, lessonId }}>
            {items.map((_, index) => {
              return <AnswerCard key={index} index={index} />;
            })}
          </questionContext.Provider>
          {/* <Stack> */}
          <div>
            <Tooltip title="Add a new question" placement="top" arrow>
              <IconButton size="small" onClick={addItem}>
                <AddCircleOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          {/* </Stack> */}
          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              loading={loading}
              disableElevation
              onClick={() => navigate(-1)}
            >
              cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={loading}
              disableElevation
              sx={{
                backgroundColor: "#1E3A8A",
                "&:hover": { backgroundColor: "#1E40AF" },
              }}
            >
              upload questions
            </Button>
          </Stack>
        </Stack>
      </Box>

      <GenQuestionDialog dialog={dialog} setDialog={setDialog} />
    </>
  );
}
