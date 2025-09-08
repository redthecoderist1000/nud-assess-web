import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ContentItem from "./ContentItem";
import { supabase } from "../../../helper/Supabase";
import QuestionDetailItem from "./QuestionDetailItem";
import QuestionBankItem from "./QuestionBankItem";
import YourExamItem from "./YourExamItem";
import NewQuestionTab from "./NewQuestionTab";

function CartPage() {
  const location = useLocation();
  const { quizDetail, tosDetail } = location.state;
  const [requirements, setRequirements] = useState([]);
  const [filter, setFilter] = useState({
    lesson: "",
    cognitive_level: "",
    type: "",
  });
  const [lessonOptions, setLessonOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);
  const [optionQuestion, setOptionQuestion] = useState([]);

  const [yourExam, setYourExam] = useState([]);
  const [tabVal, setTabVal] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const fetchQuestions = async () => {
    setOptionLoading(true);

    const lesson_id = filter.lesson
      ? [filter.lesson]
      : Array.from(new Set(tosDetail.map((item) => item.lesson_id)));

    const { data, error } = await supabase.rpc("get_questions", {
      p_repository: quizDetail.repository,
      p_lesson_id: lesson_id,
      p_type: filter.type || null,
      p_blooms_category: filter.cognitive_level || null,
    });

    if (error) {
      console.log("Error fetching questions:", error);
      setOptionLoading(false);
      return;
    }

    setOptionQuestion(data);
    setOptionLoading(false);
  };

  useEffect(() => {
    // filter unique lessons
    if (tosDetail.length > 0) {
      const uniqueLessons = [];
      const lessonIds = new Set();
      tosDetail.forEach((item) => {
        if (!lessonIds.has(item.lesson_id)) {
          lessonIds.add(item.lesson_id);
          uniqueLessons.push({
            lesson_id: item.lesson_id,
            lesson_name: item.topic,
          });
        }
      });
      setLessonOptions(uniqueLessons);
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    const cognitiveLevels = [
      "remembering",
      "understanding",
      "applying",
      "analyzing",
      "creating",
      "evaluating",
    ];

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const transformTosItem = (item, examData) => {
      const content = cognitiveLevels
        .filter((level) => item[level] > 0)
        .map((level) => {
          const selectedCount = examData.filter(
            (q) =>
              q.lesson_id === item.lesson_id &&
              q.cognitive_level.toLowerCase() === level
          ).length;

          return {
            cognitive_level: capitalize(level),
            required: item[level],
            selected: selectedCount,
          };
        });

      return {
        topic: (item.topic || "").trim(),
        lesson_id: item.lesson_id,
        content,
      };
    };
    const transformed = tosDetail.map((item) =>
      transformTosItem(item, yourExam || [])
    );
    setRequirements(transformed);
  }, [tosDetail, yourExam]);

  const addToExam = (question) => {
    console.log("Add to exam", question);

    // check if question already in exam
    if (yourExam.find((q) => q.id === question.id)) {
      return;
    }
    setYourExam((prev) => [...prev, question]);
  };

  const removeFromExam = (index) => {
    console.log("Remove from exam", index);
    setYourExam((prev) => prev.filter((q, i) => i !== index));
    // setTabVal(0);
  };

  return (
    <Stack p={2} spacing={2}>
      {/* title */}
      <div className="bg-white border-b border-gray-200  pb-2 ">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Creation</h1>
      </div>

      {/* quiz details */}
      {/* <Card elevation={0} variant="outlined">
        <Stack
          direction="row"
          columnGap={1}
          justifyContent={"space-between"}
          p={2}
        >
          <Stack direction="row" columnGap={1}>
            <Typography variant="body2" fontWeight={600} color="textDisabled">
              Name:
            </Typography>
            <Typography variant="body2" color="textDisabled">
              {quizDetail.name}
            </Typography>
          </Stack>
          <Stack direction="row" columnGap={1}>
            <Typography variant="body2" fontWeight={600} color="textDisabled">
              Subject:
            </Typography>
            <Typography variant="body2" color="textDisabled">
              {quizDetail.subject_name}
            </Typography>
          </Stack>
          <Stack direction="row" columnGap={1}>
            <Typography variant="body2" fontWeight={600} color="textDisabled">
              Time limit:
            </Typography>
            <Typography variant="body2" color="textDisabled">
              {quizDetail.time_limit}
            </Typography>
          </Stack>
          <Stack direction="row" columnGap={1}>
            <Typography variant="body2" fontWeight={600} color="textDisabled">
              Is random:
            </Typography>
            <Typography variant="body2" color="textDisabled">
              {quizDetail.is_random ? "True" : "False"}
            </Typography>
          </Stack>
        </Stack>
      </Card> */}

      {/* grid */}
      <Grid container spacing={2}>
        {/* left side (content) */}
        <Grid flex={1} direction="column">
          {/* quiz details */}
          <Card elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight={600}>Quiz Details</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack rowGap={1}>
              <QuestionDetailItem title="Quiz Name" body={quizDetail.name} />
              <QuestionDetailItem
                title="Subject"
                body={quizDetail.subject_name}
              />
              <QuestionDetailItem
                title="Time Limit"
                body={
                  quizDetail.time_limit === "none"
                    ? "No Limit"
                    : `${quizDetail.time_limit} mins`
                }
              />
              <QuestionDetailItem
                title="Is Random"
                body={quizDetail.is_random ? "True" : "False"}
              />
            </Stack>
          </Card>
          {/* contents */}
          <Card elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={600}>Contents</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack rowGap={2}>
              {requirements.map((item, index) => {
                return <ContentItem key={index} item={item} />;
              })}
            </Stack>
          </Card>
        </Grid>
        {/* center (chosen) */}
        <Grid flex={4}>
          <Card elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={600}>Your Exam</Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabVal}
                onChange={(event, newValue) => setTabVal(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {yourExam.map((data, index) => (
                  <Tab key={index} label={`Q${index + 1}`} />
                ))}
                <Tab label="+" />
              </Tabs>
            </Box>
            {yourExam.map((data, index) => (
              <YourExamItem
                key={index}
                data={data}
                hidden={tabVal !== index}
                onRemove={() => removeFromExam(index)}
              />
            ))}
            <NewQuestionTab hidden={tabVal !== yourExam.length} />
          </Card>
        </Grid>
        {/* right side  (question option)*/}
        <Grid flex={2}>
          <Card elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={600}>Question Bank</Typography>
            <Divider sx={{ my: 1 }} />
            {/* filter */}
            <Stack
              direction="row"
              justifyContent={"space-between"}
              columnGap={1}
            >
              {/* lesson filter */}
              <FormControl size="small" fullWidth>
                <InputLabel id="lesson-select-label">Lesson</InputLabel>
                <Select
                  labelId="lesson-select-label"
                  label="Lesson"
                  value={filter.lesson}
                  onChange={(e) =>
                    setFilter({ ...filter, lesson: e.target.value })
                  }
                >
                  <MenuItem value="">All Lessons</MenuItem>
                  {lessonOptions.map((lesson) => (
                    <MenuItem key={lesson.lesson_id} value={lesson.lesson_id}>
                      {lesson.lesson_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* cognitive level filter */}
              <FormControl size="small" fullWidth>
                <InputLabel id="cognitive-select-label">
                  Cognitive Level
                </InputLabel>
                <Select
                  labelId="cognitive-select-label"
                  label="Cognitive Level"
                  value={filter.cognitive_level}
                  onChange={(e) =>
                    setFilter({ ...filter, cognitive_level: e.target.value })
                  }
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="Remembering">Remembering</MenuItem>
                  <MenuItem value="Understanding">Understanding</MenuItem>
                  <MenuItem value="Applying">Applying</MenuItem>
                  <MenuItem value="Analyzing">Analyzing</MenuItem>
                  <MenuItem value="Evaluating">Evaluating</MenuItem>
                  <MenuItem value="Creating">Creating</MenuItem>
                </Select>
              </FormControl>
              {/* question type filter */}
              <FormControl size="small" fullWidth>
                <InputLabel id="type-select-label">Question Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  label="Question Type"
                  value={filter.type}
                  onChange={(e) =>
                    setFilter({ ...filter, type: e.target.value })
                  }
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                  <MenuItem value="Identification">Identification</MenuItem>
                  <MenuItem value="T/F">True or False</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            {/* list of questions */}
            {optionLoading ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                minHeight={200}
              >
                <CircularProgress />
              </Stack>
            ) : optionQuestion.length === 0 ? (
              <Typography variant="body2" color="textDisabled" mt={2}>
                No questions found.
              </Typography>
            ) : (
              <Stack maxHeight={"70vh"} overflow="auto" mt={2} spacing={1}>
                <Typography variant="body2" color="textDisabled" mt={2}>
                  {optionQuestion.length} results found
                </Typography>
                {optionQuestion.map((data, index) => (
                  <QuestionBankItem
                    key={index}
                    data={data}
                    onClick={() => addToExam(data)}
                  />
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default CartPage;
