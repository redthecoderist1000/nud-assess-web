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
  Tooltip,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import MCArea from "./MCArea";
import { supabase } from "../../../../helper/Supabase";
import TFArea from "./TFArea";
import IdArea from "./IdArea";
import { similarityCheck } from "../../../../helper/SimlarityChecker";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import BloomsTextField from "../../../../components/elements/BloomsTextField";

function QuestionBuilder(props) {
  const { items, setItems, index, repository } = props;
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
  const [prevQuestion, setPrevQuestion] = useState({});

  const data = items[index];
  const hasId = data.id ? true : false;

  useEffect(() => {
    if (data.question && !hasId) {
      setCheckLoading(true);
      setCheckerRes({});
      setIsChecked(false);

      const handler = setTimeout(() => {
        check();
        // testCheck();
      }, 5000); // 1000ms = 1 seconds

      return () => {
        clearTimeout(handler);
      }; // Cleanup on next change or unmount
    }
    setCheckerRes({});
    setCheckLoading(false);
  }, [data.question]);

  const check = async () => {
    const { data: similarityData, error: similarityError } =
      await similarityCheck(
        data.question,
        data.specification,
        repository,
        data.lesson_id
      );

    if (similarityError) {
      setIsChecked(false);
      setCheckLoading(false);
      setCheckerRes({ status: "failed" });
      return;
    }
    setCheckLoading(false);
    setCheckerRes({
      status: "success",
      count: similarityData.length,
      results: similarityData,
    });
    setHasSimilar(similarityData.length > 0);
    setIsChecked(true);
  };

  // const testCheck = () => {
  //   setTimeout(() => {
  //     setCheckLoading(false);
  //     setCheckerRes({ count: 0 });
  //     setChecked();
  //   }, 2000);
  // };

  const testCheck = () => {
    setCheckLoading(false);
    setCheckerRes({ count: 0 });
    setIsChecked(true);
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
            <Tooltip title="retry">
              <IconButton color="inherit" size="small" onClick={retryCheck}>
                <RestartAltRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        >
          Error! Failed to check similarities
        </Alert>
      );
    }

    // if wala
  };

  const retryCheck = () => {
    setCheckLoading(true);
    setCheckerRes({});
    setIsChecked(false);
    check();
    // testCheck();
  };

  const handleChangeQuestion = (e) => {
    const { value } = e.target;
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], question: value };
      return next;
    });
  };

  const useSimilar = async (id) => {
    // console.log(id);
    const { data: similarData, error } = await supabase
      .from("tbl_question")
      .select("id, question, type, answers:tbl_answer(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.log("error fetching question:", error);
      return;
    }

    // save original question
    if (!hasId) setPrevQuestion(data);

    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        question: similarData.question,
        id: similarData.id,
        answers: similarData.answers,
        type: similarData.type,
      };
      return next;
    });
    setCheckerRes({});
  };

  const undo = () => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = prevQuestion;
      return next;
    });
  };

  const answerBuilder = (qType) => {
    switch (qType) {
      case "Multiple Choice":
        return (
          <MCArea
            items={data.answers}
            qIndex={index}
            setItems={setItems}
            hasId={hasId}
          />
        );

      case "T/F":
        return (
          <TFArea
            items={data.answers}
            qIndex={index}
            setItems={setItems}
            hasId={hasId}
          />
        );

      case "Identification":
        return (
          <IdArea
            items={data.answers}
            qIndex={index}
            setItems={setItems}
            hasId={hasId}
          />
        );

      default:
        break;
    }
  };

  const setIsChecked = (value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], checked: value };
      return next;
    });
  };

  const setHasSimilar = (value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], hasSimilar: value };
      return next;
    });
  };

  return (
    <>
      <Stack mb={2}>
        <Collapse
          in={
            checkLoading ||
            checkerRes.count == 0 ||
            checkerRes.status == "failed"
          }
        >
          {alertBuilder()}
        </Collapse>
        <Grid container direction="row" columnGap={1}>
          <Grid flex={3}>
            <Card variant="outlined">
              <Box p={3}>
                {/* question */}
                <Grid container spacing={4} mb={2} alignItems="center">
                  <Grid flex={5}>
                    {/* <TextField
                      multiline
                      fullWidth
                      size="small"
                      label={"Question " + (index + 1)}
                      value={data.question}
                      required
                      name="question"
                      onChange={(e) => handleChangeQuestion(e)}
                      disabled={hasId}
                    /> */}
                    <BloomsTextField
                      value={data.question}
                      onChange={handleChangeQuestion}
                      cognitive_level={data.specification}
                      onUseSuggest={handleChangeQuestion}
                      disabled={hasId}
                    />
                  </Grid>
                  <Grid flex={1}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel id="selectSpecLabel">
                        Cognitive Level
                      </InputLabel>
                      <Select
                        labelId="selectSpecLabel"
                        label="Specification"
                        value={data.specification} // ensure not undefined
                        name="blooms_category"
                        disabled
                      >
                        <MenuItem value="Remembering">Remembering</MenuItem>
                        <MenuItem value="Creating">Creating</MenuItem>
                        <MenuItem value="Analyzing">Analyzing</MenuItem>
                        <MenuItem value="Evaluating">Evaluating</MenuItem>
                        <MenuItem value="Understanding">Understanding</MenuItem>
                        <MenuItem value="Applying">Applying</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid flex={1}>
                    <FormControl fullWidth size="small" disabled>
                      <InputLabel id="selectTypeLabel">Type</InputLabel>
                      <Select
                        labelId="selectTypeLabel"
                        label="Type"
                        value={data.type ?? "Multiple Choice"}
                        name="type"
                        onChange={(e) => {}}
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
                  {hasId && (
                    <Grid flex={1}>
                      <IconButton onClick={undo} size="small" color="primary">
                        <Tooltip
                          title="undo to previous question"
                          placement="top"
                          arrow
                        >
                          <RestartAltRoundedIcon />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
                {/* answer */}
                {answerBuilder(data.type ?? "Multiple Choice")}
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
                <Box p={2} maxHeight={400} overflow={"auto"}>
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
                        <Tooltip title="use instead" placement="left" arrow>
                          <Typography
                            variant="caption"
                            sx={{
                              "&:hover": {
                                textDecoration: "underline",
                                cursor: "pointer",
                              },
                            }}
                            onClick={() => useSimilar(data.id)}
                          >
                            {data.question}
                          </Typography>
                        </Tooltip>
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
    </>
  );
}

export default QuestionBuilder;
