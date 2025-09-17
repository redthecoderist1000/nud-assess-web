import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MultipleChoiceArea from "./answerArea/MultipleChoiceArea";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { questionContext as AutoContext } from "../AutoTab";

import TFArea from "./answerArea/TFArea";
import IndentificationArea from "./answerArea/IndentificationArea";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { userContext } from "../../../../App";
import { similarityCheck } from "../../../../helper/SimlarityChecker";

function AnswerCard(props) {
  const { setSnackbar } = useContext(userContext);

  const context = useContext(AutoContext);
  const { items, setItems, lessonId } = context;

  const { index } = props;
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkerRes, setCheckerRes] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);

  let qType;
  const data = items[index];

  // for answer area
  switch (data.type) {
    case "Multiple Choice":
      qType = <MultipleChoiceArea index={index} />;
      break;
    case "Identification":
      qType = <IndentificationArea index={index} />;
      break;
    case "T/F":
      qType = <TFArea index={index} />;
      break;
    default:
      qType = <MultipleChoiceArea index={index} />;
      break;
  }

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i != index);
    setItems(newItems);
  };

  useEffect(() => {
    if (data.question && data.specification && data.type && lessonId) {
      setCheckLoading(true);
      setCheckerRes({});

      const handler = setTimeout(() => {
        check();
      }, 5000); // 1000ms = 1 seconds

      return () => {
        clearTimeout(handler);
      }; // Cleanup on next change or unmount
    }
    setCheckerRes({});
    setCheckLoading(false);
  }, [data.question, data.specification, data.type, lessonId]);

  const handleChangeItem = (e, index) => {
    let newItems = items;

    // if type ung changes
    if (e.target.name == "type") {
      let newAnswer;
      switch (e.target.value) {
        case "T/F":
          newAnswer = {
            answer: "True",
          };
          break;
        case "Multiple Choice":
          newAnswer = [
            {
              answer: "",
              is_correct: true,
            },
          ];
          break;
        case "Identification":
          newAnswer = {
            answer: "",
          };
          break;
        default:
          break;
      }

      newItems = items.map((d, i) =>
        index == i
          ? {
              ...d,
              type: e.target.value,
              answers: newAnswer,
            }
          : d
      );

      setItems(newItems);
      return;
    }

    // not type
    newItems = items.map((d, i) =>
      index == i ? { ...d, [e.target.name]: e.target.value } : d
    );
    setItems(newItems);
  };

  const check = async () => {
    const { data: similarityData, error: similarityError } =
      await similarityCheck(
        data.question,
        data.specification,
        data.repository,
        lessonId
      );

    if (similarityError) {
      setCheckerRes({ status: "failed" });
      setCheckLoading(false);
      return;
    }
    setCheckLoading(false);
    setCheckerRes({
      status: "success",
      count: similarityData.length,
      results: similarityData,
    });
    // set is_checked to true in the item
    setItems((prev) => {
      const hasSimilar = similarityData.length > 0;
      const updated = [...(Array.isArray(prev) ? prev : [])];
      updated[index] = {
        ...updated[index],
        is_checked: true,
        has_similar: hasSimilar,
      };
      return updated;
    });
  };

  const retryCheck = () => {
    setCheckLoading(true);
    setCheckerRes({});
    check();
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

    if (checkerRes.status == "failed") {
      return (
        <Alert
          severity="error"
          sx={{
            py: 0.5,
            px: 1,
            fontSize: "0.875rem",
          }}
          action={
            <IconButton color="inherit" size="small" onClick={retryCheck}>
              <RestartAltRoundedIcon size="small" />
            </IconButton>
          }
        >
          Error! Failed to check for similar question.
        </Alert>
      );
    }

    // if wala
  };

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

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
      setItems((prev) => {
        const updated = [...(Array.isArray(prev) ? prev : [])];
        updated[index] = { ...updated[index], image: file };
        return updated;
      });

      setImgPreview(base64);

      e.target.value = null; // Reset input to allow re-selection
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setItems((prev) => {
      const updated = [...(Array.isArray(prev) ? prev : [])];
      updated[index] = { ...updated[index], image: null };
      return updated;
    });
    setImgPreview(null);
    fileInputRef.current.value = null;
  };

  return (
    <Stack>
      <Collapse
        in={
          checkLoading || checkerRes.status == "failed" || checkerRes.count >= 0
        }
      >
        {alertBuilder()}
      </Collapse>
      <Grid container direction="row" columnGap={1}>
        <Grid flex={3}>
          <Card key={index} variant="outlined">
            <Box p={3}>
              <Stack direction="row" justifyContent="end">
                {/* <Typography variant="h6">{index + 1}.</Typography> */}
                <IconButton size="small" onClick={() => deleteItem(index)}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Stack>
              <Grid container spacing={4} mb={2}>
                <Grid flex={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Question"
                    value={data.question}
                    required
                    name="question"
                    onChange={(e) => handleChangeItem(e, index)}
                  />
                </Grid>
                <Grid flex={1}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="selectSpecLabel">
                      Cognitive Level
                    </InputLabel>
                    <Select
                      labelId="selectSpecLabel"
                      label="Cognitive Level"
                      value={data.specification}
                      name="specification"
                      onChange={(e) => handleChangeItem(e, index)}
                    >
                      <MenuItem value="Remembering">Remembering</MenuItem>
                      <MenuItem value="Creating">Creating</MenuItem>
                      <MenuItem value="Analyzing">Analyzing</MenuItem>
                      <MenuItem value="Evaluating">Evaluating</MenuItem>
                      <MenuItem value="Applying">Applying</MenuItem>
                      <MenuItem value="Understanding">Understanding</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid flex={1}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="selectTypeLabel">Type</InputLabel>
                    <Select
                      labelId="selectTypeLabel"
                      label="Type"
                      defaultValue="Multiple Choice"
                      value={data.type}
                      name="type"
                      onChange={(e) => handleChangeItem(e, index)}
                    >
                      <MenuItem value="Multiple Choice">
                        Multiple Choice
                      </MenuItem>
                      <MenuItem value="T/F">True or False</MenuItem>
                      <MenuItem value="Identification">
                        Indentification
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid flex={1 / 2}> */}
                {/* hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <IconButton onClick={handleImageClick}>
                  <AddPhotoAlternateRoundedIcon color="success" />
                </IconButton>

                {/* </Grid> */}
              </Grid>
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
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Stack>
              )}
              {/* answer area */}
              {qType}
            </Box>
          </Card>
        </Grid>
        {!!checkerRes && checkerRes.count > 0 && (
          <Grid flex={1}>
            <Card
              variant="outlined"
              sx={(theme) => {
                const bg = alpha(theme.palette.info.main, 0.08);
                return {
                  bgcolor: bg,
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
                      <Typography variant="caption">{data.question}</Typography>
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
      </Grid>
    </Stack>
  );
}

export default AnswerCard;
