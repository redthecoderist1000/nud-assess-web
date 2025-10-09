import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "../../../helper/Supabase";

function StudentSummary(props) {
  const { open, close, result_id } = props;
  const [lessonFilter, setLessonFilter] = useState("All");
  const [resultDetails, setResultDetails] = useState({});
  const [lessonList, setLessonList] = useState([]);

  useEffect(() => {
    if (open && result_id) {
      setLessonFilter("All");
      fetchData();
    }
  }, [open, result_id]);

  const fetchData = async () => {
    const { data: resultData, eror: resultErr } = await supabase
      .from("tbl_result")
      .select(
        " tbl_users(f_name, l_name), correct_items, total_items, created_at, tbl_class_exam(tbl_exam(name))"
      )
      .eq("id", result_id)
      .single();

    // console.log("result:", resultData);
    setResultDetails({
      student_name: `${resultData.tbl_users.f_name} ${resultData.tbl_users.l_name}`,
      exam_name: resultData.tbl_class_exam.tbl_exam.name,
      total_score: resultData.correct_items,
      total_items: resultData.total_items,
      average_score: (resultData.correct_items / resultData.total_items) * 100,
      created_at: new Date(resultData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });

    const { data: lessonData, error: lessonErr } = await supabase
      .from("vw_lessonanalysisperstud")
      .select("*")
      .eq("result_id", result_id);

    if (lessonErr) {
      console.log("Lesson fetch error:", lessonErr);
      return;
    }

    console.log("lessonData:", lessonData);

    // console.log("lesson:", lessonData);

    // const newLessonList = lessonData.reduce((acc, cur) => {
    //   // Find if this title already exists in acc
    //   let found = acc.find((item) => item.title === cur.title);
    //   if (!found) {
    //     // If not found, add new group
    //     acc.push({
    //       title: cur.title,
    //       score: cur.is_correct, // start with current score
    //       questions: [
    //         {
    //           question: cur.question,
    //           is_correct: cur.is_correct == 1 ? true : false,
    //         },
    //       ],
    //     });
    //   } else {
    //     // If found, push question and add score
    //     found.questions.push({
    //       question: cur.question,
    //       is_correct: cur.is_correct == 1 ? true : false,
    //     });
    //     found.score += cur.is_correct;
    //   }
    //   return acc;
    // }, []);

    const lessonMap = new Map();

    lessonData.forEach((cur) => {
      if (!lessonMap.has(cur.title)) {
        lessonMap.set(cur.title, {
          title: cur.title,
          score: cur.is_correct,
          questions: [
            {
              question: cur.question,
              is_correct: cur.is_correct == 1,
            },
          ],
        });
      } else {
        const group = lessonMap.get(cur.title);
        group.questions.push({
          question: cur.question,
          is_correct: cur.is_correct == 1,
        });
        group.score += cur.is_correct;
      }
    });

    const newLessonList = Array.from(lessonMap.values());
    console.log(newLessonList);

    setLessonList(newLessonList);
  };
  const visibleLesson = useMemo(
    () =>
      lessonList.filter((l) => {
        const matchTitle = l.title == lessonFilter;

        return matchTitle || lessonFilter == "All";
      }),
    [open, lessonFilter, lessonList]
  );

  return (
    <Dialog
      fullWidth={true}
      maxWidth={result_id ? "xl" : "sm"}
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Student Result Summary</DialogTitle>
      <DialogContent>
        {result_id ? (
          <Grid container spacing={1} width="100%">
            {/* left grid */}
            <Grid flex="2.5">
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  width="100%"
                  mb={2}
                >
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Student Name
                    </Typography>
                    <Typography variant="body1">
                      {resultDetails.student_name}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Total Score
                    </Typography>
                    <Typography variant="body1">
                      {resultDetails.total_score} / {resultDetails.total_items}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Completed On
                    </Typography>
                    <Typography variant="body1">
                      {resultDetails.created_at}
                    </Typography>
                  </Stack>
                  <Stack>
                    <FormControl fullWidth size="small">
                      <InputLabel id="selectLessonLabel">
                        Filter Lesson
                      </InputLabel>
                      <Select
                        sx={{ minWidth: 150, maxWidth: 200 }}
                        labelId="selectLessonLabel"
                        id="selectLesson"
                        value={lessonFilter}
                        label="Filter Lesson"
                        onChange={(e) => setLessonFilter(e.target.value)}
                      >
                        <MenuItem value="All">All</MenuItem>
                        {lessonList.map((data, index) => {
                          return (
                            <MenuItem key={index} value={data.title}>
                              {data.title}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
                <Divider />
                {/* header */}
                <Stack direction="row" py={1} px={2}>
                  <Grid container width={"100%"} spacing={1}>
                    <Grid flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Lesson
                      </Typography>
                    </Grid>
                    <Grid flex={1}>
                      <Typography
                        variant="body2"
                        align="center"
                        fontWeight="bold"
                      >
                        Score
                      </Typography>
                    </Grid>
                    <Grid flex={1}>
                      <Typography
                        variant="body2"
                        align="right"
                        fontWeight="bold"
                      >
                        Level
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
                {/* lessons */}

                {visibleLesson.map((row, index) => {
                  const score = (row.score / row.questions.length) * 100;

                  return (
                    <Accordion key={index} elevation={0} disableGutters>
                      <AccordionSummary
                        // expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Stack direction="row" width="100%">
                          <Grid container width="100%" spacing={1}>
                            <Grid flex={1}>
                              <Typography variant="body2">
                                {row.title}
                              </Typography>
                            </Grid>
                            <Grid flex={1} alignContent="center">
                              <LinearProgress
                                value={score}
                                sx={{ borderRadius: 10 }}
                                variant="determinate"
                                color={
                                  score > 80
                                    ? "success"
                                    : score < 50
                                      ? "error"
                                      : "warning"
                                }
                              />
                              <Typography variant="body2" align="center">
                                {score.toFixed(1)} %
                              </Typography>
                            </Grid>
                            <Grid flex={1}>
                              <Typography variant="body2" align="right">
                                {score > 80
                                  ? "Mastered"
                                  : score < 50
                                    ? "Needs Improvement"
                                    : "Intermediate"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        {/* <Divider /> */}
                        {row.questions.map((data, index) => {
                          return (
                            <Stack
                              key={index}
                              direction="row"
                              justifyContent="space-between"
                              mb={1}
                            >
                              <Typography variant="body2">
                                {index + 1}. {data.question}
                              </Typography>
                              <span
                                className={`${data.is_correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"} px-2 py-1 rounded-full text-xs font-semibold max-h-fit`}
                              >
                                {data.is_correct ? "Correct" : "Wrong"}
                              </span>
                            </Stack>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Paper>
            </Grid>
            {/* right grid */}
            <Grid flex="1">
              <Stack justifyContent="center" rowGap={4}>
                <Stack>
                  <Typography variant="caption" align="center">
                    Student Score Summary
                  </Typography>
                  <Typography variant="h6" align="center" fontWeight="bold">
                    {resultDetails.exam_name}
                  </Typography>
                  <Typography variant="body2" align="center">
                    on {resultDetails.created_at}
                  </Typography>
                </Stack>
                {/* <Paper elevation={0}> */}
                <Stack>
                  <Gauge
                    value={resultDetails.average_score}
                    // value={resultDetails.average_score}
                    startAngle={-120}
                    cornerRadius={50}
                    endAngle={120}
                    color="white"
                    sx={{
                      [`& .${gaugeClasses.valueArc}`]: {
                        fill:
                          resultDetails.average_score > 80
                            ? "#52b202"
                            : resultDetails.average_score < 50
                              ? "#FF4345"
                              : "#FFAA2A",
                      },
                      ["& .MuiGauge-valueText"]: {
                        fontSize: 40,
                        transform: "translate(0px, 0px)",
                      },
                    }}
                    text={({ value }) => `${value}`}
                  />
                  <Typography align="center" variant="body1" fontWeight="bold">
                    {resultDetails.average_score > 80
                      ? "MASTERED"
                      : resultDetails.average_score < 50
                        ? "NEEDS IMPROVEMENT"
                        : "INTERMEDIATE"}
                  </Typography>
                </Stack>
                {/* </Paper> */}
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <DialogContentText>No Summary Available</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudentSummary;
