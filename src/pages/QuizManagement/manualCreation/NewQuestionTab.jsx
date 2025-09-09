import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import axiosInstance from "../../../helper/axios";

function NewQuestionTab({ hidden, lessonOptions, addToExam, repository }) {
  const [newItem, setNewItem] = useState({
    question: "",
    cognitive_level: "",
    question_type: "Multiple Choice",
    lesson_id: "",
    lesson_name: "",
    image: null,
    answer: [],
  });
  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkerRes, setCheckerRes] = useState({});

  const handleChangeItem = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setSnackbar({
        open: true,
        message: "Image must be less than 1MB",
        severity: "error",
      });
      e.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setNewItem((prev) => ({
        ...prev,
        image: file,
      }));

      setImgPreview(base64);

      e.target.value = null; // Reset input to allow re-selection
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setNewItem((prev) => ({
      ...prev,
      image: null,
    }));
    setImgPreview(null);
    fileInputRef.current.value = null;
  };

  const resetForm = () => {
    setNewItem({
      question: "",
      cognitive_level: "",
      question_type: "",
      image: null,
      lesson_id: "",
      lesson_name: "",
      answer: [],
    });
    setImgPreview(null);
    fileInputRef.current.value = null;
    setCheckLoading(false);
    setCheckerRes({});
  };

  const setTFAns = (e) => {
    const value = e.target.value;
    setNewItem((prev) => ({
      ...prev,
      answer: [{ answer: value }],
    }));
  };

  const addAnswer = () => {
    const newAnswer = { answer: "", is_correct: false };
    setNewItem((prev) => ({
      ...prev,
      answer: [...(prev.answer ?? []), newAnswer],
    }));
  };

  const changeOption = (e, index) => {
    const value = e.target.value;

    const updatedAnswers = newItem.answer.map((ans, i) =>
      i === index ? { ...ans, answer: value } : ans
    );
    setNewItem((prev) => ({
      ...prev,
      answer: updatedAnswers,
    }));
  };

  const changeSelected = (index) => {
    const updatedAnswers = newItem.answer.map((ans, i) =>
      i === index
        ? { ...ans, is_correct: !ans.is_correct }
        : { ...ans, is_correct: false }
    );
    setNewItem((prev) => ({
      ...prev,
      answer: updatedAnswers,
    }));
  };

  const removeOption = (index) => {
    const updatedAnswers = newItem.answer.filter((_, i) => i !== index);
    setNewItem((prev) => ({
      ...prev,
      answer: updatedAnswers,
    }));
  };

  useEffect(() => {
    if (newItem.question_type === "Multiple Choice") {
      setNewItem((prev) => ({
        ...prev,
        answer: [
          { answer: "", is_correct: true },
          { answer: "", is_correct: false },
        ],
      }));
    } else if (newItem.question_type === "Identification") {
      setNewItem((prev) => ({
        ...prev,
        answer: [{ answer: "" }],
      }));
    } else if (newItem.question_type === "T/F") {
      setNewItem((prev) => ({
        ...prev,
        answer: [{ answer: "True" }],
      }));
    }
  }, [newItem.question_type]);

  const answerBuilder = () => {
    if (!newItem.question_type) {
      return <></>;
    }

    if (newItem.question_type === "Multiple Choice") {
      return (
        <Stack rowGap={1}>
          {newItem.answer.map((data, index) => (
            <Stack key={index} direction="row" alignItems={"center"} gap={1}>
              <Radio
                checked={data.is_correct}
                onClick={(e) => changeSelected(index)}
                size="small"
                color="success"
                checkedIcon={<CheckCircleRoundedIcon />}
                // disabled={hasId}
              />
              <TextField
                multiline
                fullWidth
                required
                label={"option " + (index + 1)}
                size="small"
                value={data.answer}
                onChange={(e) => changeOption(e, index)}
                sx={{ maxWidth: "50%" }}
                // disabled={hasId}
              />
              <IconButton size="small" onClick={() => removeOption(index)}>
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>
          ))}
          <div>
            <Button
              onClick={addAnswer}
              size="small"
              sx={{ textTransform: "none" }}
            >
              + Add Option
            </Button>
          </div>
        </Stack>
      );
    } else if (newItem.question_type === "Identification") {
      return (
        <TextField
          multiline
          fullWidth
          required
          label={"Answer"}
          size="small"
          value={newItem.answer[0]?.answer || ""}
          onChange={(e) => changeOption(e, 0)}
          sx={{ maxWidth: "50%" }}
          // disabled={hasId}
        />
      );
    } else if (newItem.question_type === "T/F") {
      return (
        <RadioGroup value={newItem.answer[0]?.answer || ""} onClick={setTFAns}>
          <Stack direction="row" justifyContent="space-evenly">
            <FormControlLabel
              value="True"
              control={
                <Radio
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label="True"
            />
            <FormControlLabel
              value="False"
              control={
                <Radio
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label="False"
            />
          </Stack>
        </RadioGroup>
      );
    }
  };

  const submit = (e) => {
    e.preventDefault();
    addToExam(newItem);
    resetForm();
  };

  useEffect(() => {
    if (
      newItem.question &&
      newItem.cognitive_level &&
      newItem.question_type &&
      newItem.lesson_id
    ) {
      // all required fields are filled
      setCheckLoading(true);
      setCheckerRes({});
      // console.log("checking...");
      const handler = setTimeout(() => {
        check();
      }, 5000); // 1000ms = 1 seconds

      return () => {
        clearTimeout(handler);
      }; // Cleanup on next change or unmount
    }
  }, [
    newItem.question,
    newItem.cognitive_level,
    newItem.question_type,
    newItem.lesson_id,
  ]);

  const check = () => {
    axiosInstance
      .post("/similarity", {
        question: newItem.question,
        blooms_category: newItem.cognitive_level,
        repository: repository,
        lesson_id: newItem.lesson_id,
      })
      .then((res) => {
        console.log("sakses checking:", res.data);
        setCheckLoading(false);
        setCheckerRes(res.data);
      })
      .catch((err) => {
        console.log("error checking:", err);
      });
  };

  const alertBuilder = () => {
    // if loading pa
    if (checkLoading) {
      return (
        <Alert
          severity="warning"
          icon={<CircularProgress color="warning" size={20} />}
          sx={{
            py: 0.5,
            px: 1,
            fontSize: "0.875rem",
          }}
        >
          Checking for similar question
        </Alert>
      );
    }

    if (checkerRes.count == 0) {
      return (
        <Alert
          severity="success"
          sx={{
            py: 0.5,
            px: 1,
            fontSize: "0.875rem",
          }}
        >
          Nice! No similar question.
        </Alert>
      );
    }

    // if wala
  };

  return (
    <div hidden={hidden} style={{ paddingTop: "20px" }}>
      <Typography variant="h6">Create a new question</Typography>
      <form onSubmit={submit}>
        <Stack rowGap={5} mt={1}>
          <Grid container columnGap={1}>
            {/* question */}
            <Grid flex={5}>
              <TextField
                fullWidth
                size="small"
                label="Question"
                value={newItem.question}
                required
                name="question"
                onChange={(e) => handleChangeItem(e)}
              />
            </Grid>
            {/* lesson */}
            <Grid flex={1}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="selectLessonLabel">Lesson</InputLabel>
                <Select
                  labelId="selectLessonLabel"
                  label="Lesson"
                  value={newItem.lesson_id}
                  name="lesson_id"
                >
                  <MenuItem value="" disabled>
                    Select Lesson
                  </MenuItem>
                  {lessonOptions.map((lesson, index) => (
                    <MenuItem
                      key={index}
                      value={lesson.lesson_id}
                      onClick={() =>
                        setNewItem((prev) => ({
                          ...prev,
                          lesson_id: lesson.lesson_id,
                          lesson_name: lesson.lesson_name,
                        }))
                      }
                    >
                      {lesson.lesson_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* cognitive level */}
            <Grid flex={1}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="selectSpecLabel">Cognitive Level</InputLabel>
                <Select
                  labelId="selectSpecLabel"
                  label="Cognitive Level"
                  value={newItem.cognitive_level}
                  name="cognitive_level"
                  onChange={(e) => handleChangeItem(e)}
                >
                  <MenuItem value="" disabled>
                    Select Cognitive Level
                  </MenuItem>
                  <MenuItem value="Remembering">Remembering</MenuItem>
                  <MenuItem value="Creating">Creating</MenuItem>
                  <MenuItem value="Analyzing">Analyzing</MenuItem>
                  <MenuItem value="Evaluating">Evaluating</MenuItem>
                  <MenuItem value="Applying">Applying</MenuItem>
                  <MenuItem value="Understanding">Understanding</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* type */}
            <Grid flex={1}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="selectTypeLabel">Type</InputLabel>
                <Select
                  labelId="selectTypeLabel"
                  label="Type"
                  value={newItem.question_type}
                  name="question_type"
                  onChange={(e) => handleChangeItem(e)}
                >
                  <MenuItem value="" disabled>
                    Select Type
                  </MenuItem>
                  <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                  <MenuItem value="T/F">True or False</MenuItem>
                  <MenuItem value="Identification">Indentification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* image upload */}
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Tooltip title="Add Image" arrow placement="top">
                <IconButton onClick={handleImageClick} color="success">
                  <AddPhotoAlternateRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          </Grid>
          {/* image */}
          {imgPreview && (
            <Stack
              direction={"row"}
              alignItems="flex-start"
              gap={1}
              justifyContent={"center"}
              maxHeight={300}
              overflow={"auto"}
            >
              <img
                src={imgPreview}
                alt="Preview"
                style={{
                  maxWidth: "50%",
                  height: "auto",
                  borderRadius: 8,
                }}
              />
              <IconButton size="small" onClick={removeImage}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          )}
          {/* answers */}
          {answerBuilder()}
          {/* similarity checker */}
          {alertBuilder()}

          {!!checkerRes && checkerRes.count > 0 && (
            <Grid flex={1}>
              <Card
                variant="outlined"
                sx={(theme) => {
                  const bg = alpha(theme.palette.info.main, 0.08);
                  return {
                    bgcolor: bg,
                    // color: theme.palette.getContrastText(bg), // compute readable text color
                    border: "none",
                  };
                }}
              >
                <Box p={2}>
                  <Typography variant="body2">Similar Question/s:</Typography>
                  <Stack
                    direction="row"
                    width="100%"
                    columnGap={2}
                    mt={1}
                    justifyContent="space-between"
                  >
                    <Typography variant="caption" fontWeight="bold">
                      Question
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      Similarity %
                    </Typography>
                  </Stack>
                  {checkerRes.results.map((data, index) => {
                    return (
                      <Stack
                        key={index}
                        direction="row"
                        width="100%"
                        columnGap={2}
                        justifyContent="space-between"
                      >
                        <Typography variant="caption">
                          {data.question}
                        </Typography>
                        <Typography variant="caption">
                          {(data.similarity * 100).toFixed(0)}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Box>
              </Card>
            </Grid>
          )}

          {/* action button */}
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Button
              size="small"
              variant="contained"
              disableElevation
              color="error"
              onClick={resetForm}
              sx={{ textTransform: "none", mt: 2 }}
            >
              Reset
            </Button>
            <Button
              size="small"
              variant="contained"
              disableElevation
              color="success"
              sx={{ textTransform: "none", mt: 2 }}
              type="submit"
            >
              Add Question
            </Button>
          </Stack>
        </Stack>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default NewQuestionTab;
