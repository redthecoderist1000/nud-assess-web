import {
  Alert,
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MultipleChoiceArea from "./answerArea/MultipleChoiceArea";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { questionContext } from "../CustomTab";
import TFArea from "./answerArea/TFArea";
import JoditEditor from "jodit-react";
import IndentificationArea from "./answerArea/IndentificationArea";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import axiosInstance from "../../../../helper/axios";

function AnswerCard(props) {
  const { items, setItems } = useContext(questionContext);
  const { index, data, handleChangeItem, handleChangeQuestion, lesson_id } =
    props;
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      toolbarAdaptive: false,
      uploader: { insertImageAsBase64URI: true }, // configure image upalods
      addNewLine: false,
      statusbar: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        // "|",
        // "strikethrough",
        // "superscript",
        // "subscript",
        // "|",
        // "ul",
        // "ol",
        // "|",
        // "font",
        // "align",
        // "|",
        // "link",
        // "image",
      ],
    }),
    []
  );
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkerRes, setCheckerRes] = useState({
    // status: "success",
    // count: 2,
    // results: [
    //   {
    //     id: "eadd683c-e52a-421e-a571-b26f4317d6d5",
    //     question: "What is vulnerability assessment?",
    //     similarity: 0.9507992267608643,
    //   },
    //   {
    //     id: "664ad453-4be5-4cb8-b1fd-8b1b1e6a24fa",
    //     question: "What is the primary goal of vulnerability assessment?",
    //     similarity: 0.8923159837722778,
    //   },
    // ],
  });

  let qType;

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
      qType = <p>nothing</p>;
      break;
  }

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i != index);
    setItems(newItems);
  };

  useEffect(() => {
    if (data.question && data.blooms_category && data.type && lesson_id) {
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
  }, [data.question, data.blooms_category, data.type, lesson_id]);

  const check = () => {
    axiosInstance
      .post("/similarity", {
        question: data.question,
        blooms_category: data.blooms_category,
        repository: items[index].repository,
        lesson_id: lesson_id,
      })
      .then((res) => {
        // console.log("sakses checking:", res.data);
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
    <Stack>
      <Collapse in={checkLoading || checkerRes.count == 0}>
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
                  {/* <JoditEditor
              ref={editor}
              value={data.question}
              config={config}
              onBlur={(e) => handleChangeQuestion(e, index)}
            /> */}
                </Grid>

                <Grid flex={1}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="selectSpecLabel">Specification</InputLabel>
                    <Select
                      labelId="selectSpecLabel"
                      label="Specification"
                      value={data.blooms_category}
                      name="blooms_category"
                      onChange={(e) => handleChangeItem(e, index)}
                    >
                      <MenuItem value="Remembering">Remembering</MenuItem>
                      <MenuItem value="Creating">Creating</MenuItem>
                      <MenuItem value="Analyzing">Analyzing</MenuItem>
                      <MenuItem value="Evaluating">Evaluating</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid flex={1}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="selectTypeLabel">Type</InputLabel>
                    <Select
                      labelId="selectTypeLabel"
                      label="Type"
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
              </Grid>
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
