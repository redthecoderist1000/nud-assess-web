import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentItem from "./ContentItem";
import { supabase } from "../../../helper/Supabase";
import QuestionDetailItem from "./QuestionDetailItem";
import QuestionBankItem from "./QuestionBankItem";
import YourExamItem from "./YourExamItem";
import NewQuestionTab from "./NewQuestionTab";
import { userContext } from "../../../App";
import GeneralDialog from "../../../components/elements/GeneralDialog";

function CartPage() {
  const { user, setSnackbar } = useContext(userContext);
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [filter, setFilter] = useState({
    lesson: "",
    cognitive_level: "",
    type: "",
    owned: false,
    search: "",
  });
  const [lessonOptions, setLessonOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);
  const [optionQuestion, setOptionQuestion] = useState([]);

  const [yourExam, setYourExam] = useState([]);
  const [tabVal, setTabVal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  const { quizDetail, tosDetail } = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("manual_requirements"));
    } catch {
      setSnackbar({
        open: true,
        message: "Error loading quiz requirements. Please try again.",
        severity: "error",
      });
      navigate(-1);
      return {};
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filter.cognitive_level, filter.lesson, filter.type]);

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
    // console.log(transformed);
  }, [tosDetail, yourExam]);

  const addToExam = (question) => {
    // check if it is in the requirements
    // console.log(question);
    if (
      !requirements.find((req) => req.lesson_id === question.lesson_id) ||
      !requirements
        .find((req) => req.lesson_id === question.lesson_id)
        .content.find((c) => c.cognitive_level === question.cognitive_level)
    ) {
      setSnackbar({
        open: true,
        message: "Question does not meet the requirements.",
        severity: "error",
      });
      return;
    }

    // check if reached required count
    const currentCount = yourExam.reduce((count, q) => {
      return q.lesson_id === question.lesson_id &&
        q.cognitive_level === question.cognitive_level
        ? count + 1
        : count;
    }, 0);

    const reqItem = requirements.find(
      (req) => req.lesson_id === question.lesson_id
    );
    const required = reqItem?.content.find(
      (c) => c.cognitive_level === question.cognitive_level
    )?.required;

    if (required !== undefined && currentCount >= required) {
      setSnackbar({
        open: true,
        message: "Requirement for this cognitive level is already met.",
        severity: "error",
      });
      return;
    }

    // check if question already in exam
    if (yourExam.find((q) => q.id === question.id) && question.id) {
      setSnackbar({
        open: true,
        message: "Question is already in the exam.",
        severity: "error",
      });
      return;
    }
    setYourExam((prev) => [...prev, question]);
  };

  const removeFromExam = (index) => {
    setYourExam((prev) => prev.filter((q, i) => i !== index));
  };

  // check if requirements are met
  const allRequirementsMet = useMemo(() => {
    return requirements.every((topic) =>
      topic.content.every((req) => req.selected >= req.required)
    );
  }, [requirements]);

  const getNextAvailableName = (baseName, existingNames) => {
    const usedNumbers = new Set();

    existingNames.forEach((name) => {
      const match = name.match(new RegExp(`^${baseName}(?:\\((\\d+)\\))?$`));
      if (match) {
        const num = match[1] ? parseInt(match[1]) : 0;
        usedNumbers.add(num);
      }
    });

    // Find the smallest unused number starting from 0
    let nextNum = 0;
    while (usedNumbers.has(nextNum)) {
      nextNum++;
    }

    return nextNum === 0 ? baseName : `${baseName}(${nextNum})`;
  };

  const validate = () => {
    if (!allRequirementsMet) {
      setSnackbar({
        open: true,
        message: "Cannot proceed. Not all requirements are met.",
        severity: "error",
      });
      return;
    }

    setDialog({
      open: true,
      title: "Confirm Quiz Creation",
      content:
        "Are you sure you want to create this quiz? You cannot edit the contents later.",
      action: submit,
    });
  };

  const submit = async () => {
    setLoading(true);
    setDialog({ open: false, title: "", content: "", action: null });
    // check name
    const { data: nameCheck, error: checkError } = await supabase
      .from("tbl_exam")
      .select("name")
      .eq("created_by", user.user_id)
      .like("name", quizDetail.name + "%");
    if (checkError) {
      setSnackbar({
        open: true,
        message: "Failed to create quiz. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const baseName = quizDetail.name;
    const pattern = new RegExp(`^${baseName}(?:\\(\\d+\\))?$`);

    const filtered = nameCheck
      .map((item) => item.name)
      .filter((name) => pattern.test(name));

    const final_name =
      filtered.length > 0 ? getNextAvailableName(baseName, filtered) : baseName;

    // insert tbl_exam
    const examPayload = {
      name: final_name,
      desc: quizDetail.desc ?? null,
      objective: quizDetail.objective ?? null,
      subject_id: quizDetail.subject_id,
      time_limit:
        quizDetail.time_limit === "none" ? null : quizDetail.time_limit,
      is_random: quizDetail.is_random,
      mode: "Manual",
      total_items: yourExam.length,
      repository: quizDetail.repository,
    };
    // console.log(quizDetail);
    // console.log(examPayload);
    const { data: examData, error: examError } = await supabase
      .from("tbl_exam")
      .insert(examPayload)
      .select("id")
      .single();

    if (examError) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Error creating exam. Please try again.",
        severity: "error",
      });
      return;
    }
    // console.log("Created exam:", examData);

    const exam_id = examData.id;
    // const exam_id = "exam_id test";

    // create payload for tbl_exam_question (with id only)
    const examQuestionPayload = yourExam
      .filter((q) => q.id)
      .map((q) => ({
        exam_id,
        question_id: q.id,
      }));

    // upload new questions
    const newQuestions = yourExam.filter((q) => !q.id);
    if (newQuestions.length > 0) {
      // upload image if has image to supabase storage
      for (const question of newQuestions) {
        if (!question.image) continue;

        const fileName = `${Math.random()}-${question.image.name.replace(/\s+/g, "_")}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from("question_image")
          .upload(fileName, question.image);

        if (imageError) {
          setLoading(false);
          setSnackbar({
            open: true,
            message: "Error uploading image. Please try again.",
            severity: "error",
          });
          return;
        }
        question.image_url = imageData.path;
      }

      // craete payload for new question
      const newQuestionPayload = newQuestions.map((q) => ({
        question: q.question,
        type: q.question_type,
        blooms_category: q.cognitive_level,
        repository: quizDetail.repository,
        lesson_id: q.lesson_id,
        image: q.image_url ?? null,
      }));

      // insert tbl_question
      const { data: questionData, error: questionError } = await supabase
        .from("tbl_question")
        .insert(newQuestionPayload)
        .select("id");

      // add to exam question payload
      questionData.forEach((qd) => {
        examQuestionPayload.push({
          exam_id,
          question_id: qd.id,
        });
      });

      // insert tbl_answer
      const answerPayload = questionData.map((q, index) => ({
        question_id: q.id,
        answer: newQuestions[index].answer,
      }));

      const mappedAnswers = answerPayload.flatMap((item) =>
        item.answer.map((ans) => ({
          question_id: item.question_id,
          ...ans,
        }))
      );
      const { data: answerData, error: answerError } = await supabase
        .from("tbl_answer")
        .insert(mappedAnswers);
    }

    // insert tbl_exam_question
    const { data: eqData, error: eqError } = await supabase
      .from("tbl_exam_question")
      .insert(examQuestionPayload);

    if (eqError) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Error adding questions to exam. Please try again.",
        severity: "error",
      });
      return;
    }
    // setLoading(false);
    // console.log("Added questions to exam:", eqData);
    setSnackbar({
      open: true,
      message: "Exam created successfully!",
      severity: "success",
    });
    // navigate back to quiz management after 2 seconds
    setTimeout(() => {
      navigate("/quizzes", { replace: true });
      localStorage.removeItem("manual_requirements");
    }, 2000);
  };

  const visibleOptionQuestions = useMemo(
    () =>
      optionQuestion.filter((q) => {
        const matchQuestion = q.question
          .toLowerCase()
          .includes(filter.search.toLowerCase());

        const owned = q.creator_id === user.id;

        if (filter.owned) {
          return matchQuestion && owned;
        }

        return matchQuestion;
      }),
    [filter.owned, optionQuestion, filter.search]
  );

  const onCancel = () => {
    localStorage.removeItem("manual_requirements");
    navigate(-1);
  };

  return (
    <Stack p={2} spacing={2} height={"100%"} my={2}>
      {/* title */}
      <div className="bg-white border-b border-gray-200  pb-2 ">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Creation</h1>
      </div>

      {/* grid */}
      <Grid container spacing={2} flex={1}>
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
                {!allRequirementsMet && <Tab label="+" />}
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
            <NewQuestionTab
              hidden={tabVal !== yourExam.length}
              lessonOptions={lessonOptions}
              addToExam={addToExam}
              repository={quizDetail.repository}
            />
          </Card>
        </Grid>
        {/* right side  (question option)*/}
        <Grid flex={2}>
          {/* <Alert severity="error">This is an error Alert.</Alert> */}
          <Card elevation={0} variant="outlined" sx={{ p: 2, height: "100%" }}>
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
            <TextField
              size="small"
              fullWidth
              placeholder="Search question..."
              sx={{ mt: 1 }}
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />

            {/* list of questions */}
            {optionLoading ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                minHeight={200}
              >
                <CircularProgress />
              </Stack>
            ) : (
              //  : visibleOptionQuestions.length === 0 ? (
              //   <Typography variant="body2" color="textDisabled" mt={2}>
              //     No questions found.
              //   </Typography>
              // )
              <Stack maxHeight={"70vh"} overflow="auto" mt={2} spacing={1}>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Typography variant="body2" color="textDisabled">
                    {visibleOptionQuestions.length} results found
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={filter.owned}
                          onClick={() =>
                            setFilter({ ...filter, owned: !filter.owned })
                          }
                        />
                      }
                      label={
                        <Typography variant="caption" color="textSecondary">
                          Owned only
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Stack>
                {visibleOptionQuestions.map((data, index) => (
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
      {/* action buttons */}
      {loading ? (
        <LinearProgress />
      ) : (
        <Stack direction="row" justifyContent={"space-between"}>
          <Button color="error" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            disableElevation
            onClick={validate}
            disabled={!allRequirementsMet || loading}
          >
            Continue
          </Button>
        </Stack>
      )}
      <GeneralDialog dialog={dialog} setDialog={setDialog} />
    </Stack>
  );
}

export default CartPage;
