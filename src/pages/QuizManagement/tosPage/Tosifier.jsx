import {
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { userContext } from "../../../App";
import FileUpload from "../../../components/elements/FileUpload";
import { aiRun } from "../../../helper/Gemini";
import { supabase } from "../../../helper/Supabase";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import { relevanceCheck } from "../../../helper/RelevanceCheck";
import CustomTosDialog from "./CustomTosDialog";

const env = import.meta.env;

// Styled components for design
const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  background: "#fff",
  marginBottom: theme.spacing(4),
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
}));

const TosTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

function Tosifier() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const repoParam = searchParams.get("repository");

  const { user, setSnackbar } = useContext(userContext);
  const navigate = useNavigate();
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [quizDetail, setQuizDetail] = useState({
    mode: modeParam,
    repository: repoParam,
    subject_id: "",
    subject_name: "",
    is_random: false,
    time_limit: "none",
    allow_review: true,
  });
  const [rows, setRows] = useState([
    {
      topic: "",
      lesson_id: "",
      hours: 0,
      percentage: 0,
      remembering: 0,
      understanding: 0,
      applying: 0,
      analyzing: 0,
      creating: 0,
      evaluating: 0,
      totalItems: 0,
    },
  ]);

  const [total, setTotal] = useState({
    items: 0,
    hours: 0,
    percentage: 0,
    remembering: 0,
    understanding: 0,
    applying: 0,
    analyzing: 0,
    creating: 0,
    evaluating: 0,
    totalItems: 0,
  });
  const [lessonOption, setLessonOption] = useState([]);
  const [files, setFiles] = useState([]);
  const [tosAllocation, setTosAllocation] = useState({
    remembering: 0.3,
    understanding: 0.2,
    applying: 0.2,
    analyzing: 0.1,
    creating: 0.1,
    evaluating: 0.1,
  });
  const [tosDialog, setTosDialog] = useState(false);
  const [tosDropdown, setTosDropdown] = useState("default");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // calculate total hours when rows change
  useEffect(() => {
    const totalHours = rows.reduce(
      (sum, row) => sum + parseInt(row.hours || 0),
      0
    );
    const totalPercent = rows.reduce(
      (sum, row) => sum + parseInt(row.percentage || 0),
      0
    );
    const totalRem = rows.reduce(
      (sum, row) => sum + parseInt(row.remembering || 0),
      0
    );
    const totalUnd = rows.reduce(
      (sum, row) => sum + parseInt(row.understanding || 0),
      0
    );
    const totalApp = rows.reduce(
      (sum, row) => sum + parseInt(row.applying || 0),
      0
    );
    const totalAna = rows.reduce(
      (sum, row) => sum + parseInt(row.analyzing || 0),
      0
    );
    const totalCre = rows.reduce(
      (sum, row) => sum + parseInt(row.creating || 0),
      0
    );
    const totalEva = rows.reduce(
      (sum, row) => sum + parseInt(row.evaluating || 0),
      0
    );
    const totalItems = rows.reduce(
      (sum, row) => sum + parseInt(row.totalItems || 0),
      0
    );

    setTotal({
      ...total,
      hours: totalHours,
      percentage: totalPercent,
      remembering: totalRem,
      understanding: totalUnd,
      applying: totalApp,
      analyzing: totalAna,
      creating: totalCre,
      evaluating: totalEva,
      totalItems: totalItems,
    });
  }, [rows]);

  // calculate total percent when total hours change
  useEffect(() => {
    if (total.hours === 0) return;

    const updatedRows = rows.map((row) => {
      const percentage = Math.round((row.hours / total.hours) * 100);
      const itemsPerRow = Math.round((total.items * percentage) / 100);

      // Calculate exact values
      // const percents = {
      //   remembering: 0.3,
      //   understanding: 0.2,
      //   applying: 0.2,
      //   analyzing: 0.1,
      //   creating: 0.1,
      //   evaluating: 0.1,
      // };

      // Compute exact and floored values
      const exacts = {};
      const floors = {};
      const remainders = [];
      let sumFloors = 0;
      Object.entries(tosAllocation).forEach(([key, percent]) => {
        const exact = itemsPerRow * percent;
        exacts[key] = exact;
        floors[key] = Math.floor(exact);
        remainders.push({ key, remainder: exact - floors[key] });
        sumFloors += floors[key];
      });

      // Distribute remaining items
      let remaining = itemsPerRow - sumFloors;
      // Sort by largest remainder, but only take as many as needed
      remainders.sort((a, b) => b.remainder - a.remainder);

      const result = { ...floors };
      for (let i = 0; i < remainders.length && remaining > 0; i++) {
        result[remainders[i].key]++;
        remaining--;
      }

      // If still not matching, adjust (should not happen, but for safety)
      const totalAssigned = Object.values(result).reduce((a, b) => a + b, 0);
      if (totalAssigned > itemsPerRow) {
        // Remove from the smallest remainders
        let over = totalAssigned - itemsPerRow;
        remainders.sort((a, b) => a.remainder - b.remainder);
        for (let i = 0; i < remainders.length && over > 0; i++) {
          if (result[remainders[i].key] > 0) {
            result[remainders[i].key]--;
            over--;
          }
        }
      }

      return {
        ...row,
        percentage: percentage.toFixed(2),
        remembering: result.remembering,
        understanding: result.understanding,
        applying: result.applying,
        analyzing: result.analyzing,
        creating: result.creating,
        evaluating: result.evaluating,
        totalItems: itemsPerRow,
      };
    });

    setRows(updatedRows);
  }, [total.hours, total.items, tosAllocation]);

  //   fetch subjects by user department
  const fetchSubjects = async () => {
    if (quizDetail.repository == "Final Exam") {
      // only get subject incharge
      // console.log(user);
      const { data: inchargeData, error: inchargeErr } = await supabase
        .from("tbl_subject")
        .select("subject_id:id, subject_name:name")
        .eq("faculty_incharge", user.user_id);

      if (inchargeErr) {
        console.log("Failed to fetch incharge sub:", inchargeErr);
        return;
      }
      setSubjectOptions(inchargeData);
      // console.log(inchargeData);
    } else {
      const { data, error } = await supabase
        .from("vw_assignedsubject")
        .select("*");

      if (error) {
        console.log("Failed to fetch subject:", error);
        return;
      }
      setSubjectOptions(data);
    }
  };

  useEffect(() => {
    // check params
    const allowedModes = ["AI-Generated", "Random", "Manual"];
    const allowedRepos = ["Final Exam", "Quiz", "Private"];

    if (!allowedModes.includes(quizDetail.mode)) {
      setSnackbar({
        open: true,
        message: "Invalid quiz mode.",
        severity: "error",
      });
      navigate(-1);
      return;
    }

    if (!allowedRepos.includes(quizDetail.repository)) {
      setSnackbar({
        open: true,
        message: "Invalid quiz repository.",
        severity: "error",
      });
      navigate(-1);
      return;
    }

    fetchSubjects();
  }, []);

  const handleQuizDetail = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name === "subject_id") {
      const selected = subjectOptions.find(
        (option) => option.subject_id === value
      );
      setQuizDetail({
        ...quizDetail,
        subject_id: value,
        subject_name: selected ? selected.subject_name : "",
      });
    } else {
      setQuizDetail({ ...quizDetail, [name]: value });
    }
  };

  const addRow = () => {
    const newRow = {
      topic: "",
      hours: 0,
      percentage: 0,
      remembering: 0,
      understanding: 0,
      applying: 0,
      analyzing: 0,
      creating: 0,
      evaluating: 0,
      totalItems: 0,
    };
    setRows([...rows, newRow]);
  };

  const changeTotalItems = (e) => {
    setTotal({ ...total, items: e.target.value });
  };

  const handleInputChange = (index, field, value) => {
    if (field == "lesson_id") {
      if (isLessonInRows(value)) {
        setSnackbar({
          open: true,
          message: "Lesson is already exists in the table.",
          severity: "error",
        });
        return;
      }
    }

    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    setRows(updatedRows);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (rows.length === 0) {
      setSnackbar({
        open: true,
        message: "Please add at least one topic.",
        severity: "error",
      });
      return;
    }

    switch (quizDetail.mode) {
      case "AI-Generated":
        generateQuestion();
        break;

      case "Random":
        randomQuiz();
        break;

      case "Manual":
        manualQuiz();
        break;

      default:
        break;
    }
  };

  const getCount = async (category, lesson_id, limit) => {
    let query = supabase
      .from("tbl_question")
      .select("id")
      .eq("repository", quizDetail.repository)
      .eq("lesson_id", lesson_id)
      .eq("blooms_category", category)
      .eq("archived_at", null);
    // Conditionally add the filter
    if (quizDetail.repository === "Private") {
      query = query.eq("created_by", user.user_id);
    }

    const { data, error } = await query.limit(limit);

    return { count: data?.length || 0, error };
  };

  const randomQuiz = async () => {
    // console.log(rows);
    // check if may avaialble questions
    setLoading(true);
    setStatus("Checking available questions...");

    let isValid = true;
    await Promise.all(
      rows.map(async (d) => {
        const categories = [
          "Remembering",
          "Understanding",
          "Applying",
          "Analyzing",
          "Creating",
          "Evaluating",
        ];

        for (const category of categories) {
          const key = category.toLowerCase();
          if (d[key] > 0) {
            const { count, error } = await getCount(
              category,
              d.lesson_id,
              d[key]
            );
            if (error) {
              console.log(`error fetch ${category}:`, error);
              return;
            }
            if (count < d[key]) {
              isValid = false;
            }
          }
        }
      })
    );

    if (isValid) {
      // proceed to summary
      setSnackbar({
        open: true,
        message: "Generating quiz...",
        severity: "success",
      });
      setStatus(null);

      // timeout 2s
      setTimeout(() => {
        localStorage.setItem(
          "quizsummary",
          JSON.stringify({
            quizDetail: quizDetail,
            rows: rows,
            total: total,
            quiz: [],
          })
        );
        navigate("/quizsummary");
      }, 2000);
    } else {
      // setError(true);
      setStatus(null);
      setLoading(false);
      setSnackbar({
        open: true,
        message:
          "There seems to be insufficient number of questions to create a quiz with your specified items.",
        severity: "error",
      });
    }

    // setLoading(false);
  };

  const generateQuestion = async () => {
    if (files.length <= 0) {
      setSnackbar({
        open: true,
        message: "Upload atleast 1 pdf file as reference.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    if (env.VITE_ENVIRONMENT === "deployed") {
      // relevance check
      const topics = rows.map((data) => ({
        text: `${data.totalItems} questions in the topic of ${data.topic}`,
      }));

      try {
        setStatus("Reviewing uploaded files...");
        const result = await relevanceCheck(files, topics);

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
        // console.log(error);
        setLoading(false);
        setStatus(null);
        setSnackbar({
          open: true,
          message: "There seems to be a problem on our side. Please try again.",
          severity: "error",
        });
        return;
      }
    }

    if (rows.length === 0) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "There must be atleast 1 topic",
        severity: "error",
      });
      return;
    }

    if (total.hours <= 0) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Hours cannot be equal or less than 0",
        severity: "error",
      });
      return;
    }

    // gawa ng array of texts
    const texts = rows.flatMap((data) => {
      const r_text = {
        text: `In the topic of ${data.topic} with a lesson_id of ${data.lesson_id}, generate ${data.remembering} question/s at the 'Remembering' level.`,
      };
      const u_text = {
        text: `In the topic of ${data.topic} with a lesson_id of ${data.lesson_id}, generate ${data.understanding} question/s at the 'Understanding' level.`,
      };
      const ap_text = {
        text: `In the topic of ${data.topic} with a lesson_id of ${data.lesson_id}, generate ${data.applying} question/s at the 'Applying' level.`,
      };
      const an_text = {
        text: `In the topic of ${data.topic} with a lesson_id of ${data.lesson_id}, generate ${data.analyzing} question/s at the 'Analyzing' level.`,
      };
      const c_text = {
        text: `In the topic of ${data.topic} with a lesson_id of ${data.lesson_id}, generate ${data.creating} question/s at the 'Creating' level.`,
      };
      const e_text = {
        text: `In the topic of ${data.topic} with a lesson_id of ${data.lesson_id}, generate ${data.evaluating} question/s at the 'Evaluating' level.`,
      };

      const compiled = [
        data.remembering > 0 && r_text,
        data.understanding > 0 && u_text,
        data.applying > 0 && ap_text,
        data.analyzing > 0 && an_text,
        data.creating > 0 && c_text,
        data.evaluating > 0 && e_text,
      ].filter(Boolean);

      return compiled;
    });

    try {
      setStatus("Generating questions. This may take a while...");
      const result = await aiRun(files, texts);
      setStatus(null);
      setSnackbar({
        open: true,
        message: "Questions generated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        // store in localstorage
        localStorage.setItem(
          "quizsummary",
          JSON.stringify({
            quizDetail: quizDetail,
            rows: rows,
            total: total,
            quiz: result.questions,
          })
        );
        // navigate to quiz summary
        navigate("/quizsummary");
      }, 2000);
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

  const manualQuiz = () => {
    localStorage.setItem(
      "manual_requirements",
      JSON.stringify({
        quizDetail: quizDetail,
        tosDetail: rows,
      })
    );

    navigate("/manual-quiz");
  };

  useEffect(() => {
    // console.log(quizDetail);
    if (quizDetail.subject_id == "") {
      setLessonOption([]);
      return;
    }

    fetchLesson();
  }, [quizDetail.subject_id]);

  const fetchLesson = async () => {
    setRows([
      {
        topic: "",
        lesson_id: "",
        hours: 0,
        percentage: 0,
        remembering: 0,
        understanding: 0,
        applying: 0,
        analyzing: 0,
        creating: 0,
        evaluating: 0,
        totalItems: 0,
      },
    ]);

    const { data, error } = await supabase
      .from("tbl_lesson")
      .select("*")
      .eq("subject_id", quizDetail.subject_id);

    if (error) {
      console.error("Failed to fetch lessons:", error);
      setLessonOption([]);
      return;
    }
    setLessonOption(data);
  };

  // check if lesson is already in the rows
  const isLessonInRows = (lesson_id) => {
    return rows.some((row) => row.lesson_id === lesson_id);
  };

  const onCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    switch (tosDropdown) {
      case "default":
        setTosAllocation({
          remembering: 0.3,
          understanding: 0.2,
          applying: 0.2,
          analyzing: 0.1,
          creating: 0.1,
          evaluating: 0.1,
        });
        break;
      case "custom":
        setTosDialog(true);
        break;
      case "easy":
        setTosAllocation({
          remembering: 0.4,
          understanding: 0.4,
          applying: 0.1,
          analyzing: 0.1,
          creating: 0.0,
          evaluating: 0.0,
        });
        break;
      case "medium":
        setTosAllocation({
          remembering: 0.0,
          understanding: 0.0,
          applying: 0.5,
          analyzing: 0.5,
          creating: 0.0,
          evaluating: 0.0,
        });
        break;
      case "hard":
        setTosAllocation({
          remembering: 0.0,
          understanding: 0.0,
          applying: 0.1,
          analyzing: 0.1,
          creating: 0.4,
          evaluating: 0.4,
        });
        break;

      default:
        break;
    }
  }, [tosDropdown]);

  return (
    <Container maxWidth="xl" className="my-5">
      <div className="bg-white border-b border-gray-200 pt-6 pb-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">Quiz Details</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Enter details about the quiz and create Table of Specification
        </p>
      </div>

      <form onSubmit={submitForm}>
        <SectionCard elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Quiz Information
          </Typography>
          <Typography mb={3} color="text.secondary">
            Basic information about your quiz
          </Typography>
          <Stack mb={2} rowGap={3}>
            <Stack direction="row" columnGap={3}>
              <TextField
                fullWidth
                required
                label="Quiz Name"
                size="small"
                type="text"
                name="name"
                onChange={handleQuizDetail}
                sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
              />
              <FormControl size="small" fullWidth>
                <InputLabel id="subjectSelectLabel" required>
                  Subject
                </InputLabel>
                <Select
                  label="Subject"
                  labelId="subjectSelectLabel"
                  value={quizDetail.subject_id}
                  onChange={handleQuizDetail}
                  name="subject_id"
                  required
                  sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
                >
                  <MenuItem value={0} disabled dense>
                    <em>
                      {subjectOptions.length == 0
                        ? "You are not assigned to any subject"
                        : "-- Select Subject --"}
                    </em>
                  </MenuItem>
                  {subjectOptions.map((data, index) => {
                    return (
                      <MenuItem key={index} value={data.subject_id}>
                        {data.subject_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" columnGap={3}>
              <TextField
                size="small"
                label="Description"
                fullWidth
                multiline
                rows={2}
                name="desc"
                onChange={handleQuizDetail}
                sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
              />
              <TextField
                label="Objective"
                size="small"
                fullWidth
                multiline
                rows={2}
                name="objective"
                onChange={handleQuizDetail}
                sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
              />
            </Stack>
          </Stack>
        </SectionCard>

        {/* Advanced Options Section */}
        <SectionCard elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Advanced Options
          </Typography>
          <Typography mb={3} color="text.secondary">
            Configure advanced quiz settings
          </Typography>
          <Grid container columnGap={3}>
            <Grid flex={1}>
              <FormControl size="small" fullWidth>
                <InputLabel id="timeLimitLabel">Time Limit</InputLabel>
                <Select
                  label="Time Limit"
                  labelId="timeLimitLabel"
                  value={quizDetail.time_limit}
                  onChange={handleQuizDetail}
                  name="time_limit"
                  sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
                >
                  <MenuItem value={"none"} dense>
                    No time limit
                  </MenuItem>
                  <MenuItem value={30} dense>
                    30 minutes
                  </MenuItem>
                  <MenuItem value={60} dense>
                    1 hour
                  </MenuItem>
                  <MenuItem value={90} dense>
                    1 hour 30 minutes
                  </MenuItem>
                  <MenuItem value={120} dense>
                    2 hours
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid flex={1}>
              <FormControl size="small" fullWidth>
                <InputLabel id="shuffleLabel">Shuffle Items</InputLabel>
                <Select
                  label="Shuffle Items"
                  labelId="shuffleLabel"
                  value={quizDetail.is_random}
                  onChange={handleQuizDetail}
                  name="is_random"
                  sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
                >
                  <MenuItem value={true} dense>
                    Yes
                  </MenuItem>
                  <MenuItem value={false} dense>
                    No
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid flex={1}>
              <FormControl size="small" fullWidth>
                <Tooltip
                  title="Allow students to review their answers after submission."
                  placement="right"
                  arrow
                >
                  <InputLabel id="allowReviewLabel">
                    Allow Review
                    <InfoOutlineRoundedIcon
                      sx={{ fontSize: "medium", ml: 1 }}
                    />
                  </InputLabel>
                </Tooltip>
                <Select
                  label="Allow Review ----"
                  labelId="allowReviewLabel"
                  value={quizDetail.allow_review}
                  onChange={handleQuizDetail}
                  name="allow_review"
                  sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
                >
                  <MenuItem value={true} dense>
                    Yes
                  </MenuItem>
                  <MenuItem value={false} dense>
                    No
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </SectionCard>

        {/* Table of Specification Section */}
        <SectionCard elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Table of Specification
          </Typography>
          <Typography mb={3} color="text.secondary">
            Create Table of Specification to generate quiz questions based on
            Bloom's Taxonomy
          </Typography>
          <Stack rowGap={2}>
            {/* file upload */}
            {quizDetail.mode == "AI-Generated" && (
              <FileUpload files={files} setFiles={setFiles} />
            )}

            <Stack direction="row" spacing={2}>
              <FormControl
                size="small"
                required
                sx={{
                  width: { xs: "100%", sm: "150px" },
                  bgcolor: "#fafafa",
                }}
              >
                <InputLabel id="tosAllocationLabel" required>
                  TOS Allocation
                </InputLabel>
                <Select
                  label="TOS Allocation"
                  labelId="tosAllocationLabel"
                  defaultValue="default"
                  value={tosDropdown}
                  onChange={(e) => setTosDropdown(e.target.value)}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Total Items"
                size="small"
                required
                className="itemInput"
                type="number"
                inputProps={{
                  min: 1,
                  ...(quizDetail.mode === "AI-Generated" ? { max: 50 } : {}),
                }}
                onChange={changeTotalItems}
                sx={{
                  width: { xs: "100%", sm: "150px" },
                  bgcolor: "#fafafa",
                }}
              />
            </Stack>

            <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TosTableCell rowSpan={2}>
                        {/* <b>Lesson</b> */}
                      </TosTableCell>
                      <TosTableCell rowSpan={2}>
                        <b>Lesson</b>
                      </TosTableCell>
                      <TosTableCell rowSpan={2}>
                        <b>Hours</b>
                      </TosTableCell>
                      <TosTableCell rowSpan={2}>
                        <b>Percentage</b>
                      </TosTableCell>
                      <TosTableCell colSpan={2} bgcolor="#e3f2fd">
                        <b>EASY</b>
                      </TosTableCell>
                      <TosTableCell colSpan={2} bgcolor="#fffde7">
                        <b>MEDIUM</b>
                      </TosTableCell>
                      <TosTableCell colSpan={2} bgcolor="#ffebee">
                        <b>HARD</b>
                      </TosTableCell>
                      <TosTableCell rowSpan={2}>
                        <b>Total Items</b>
                      </TosTableCell>
                    </TableRow>
                    <TableRow>
                      <TosTableCell bgcolor="#e3f2fd">
                        <b>Remembering ({tosAllocation.remembering * 100}%)</b>
                      </TosTableCell>
                      <TosTableCell bgcolor="#e3f2fd">
                        <b>
                          Understanding ({tosAllocation.understanding * 100}%)
                        </b>
                      </TosTableCell>
                      <TosTableCell bgcolor="#fffde7">
                        <b>Applying ({tosAllocation.applying * 100}%)</b>
                      </TosTableCell>
                      <TosTableCell bgcolor="#fffde7">
                        <b>Analyzing ({tosAllocation.analyzing * 100}%)</b>
                      </TosTableCell>
                      <TosTableCell bgcolor="#ffebee">
                        <b>Creating ({tosAllocation.creating * 100}%)</b>
                      </TosTableCell>
                      <TosTableCell bgcolor="#ffebee">
                        <b>Evaluating ({tosAllocation.evaluating * 100}%)</b>
                      </TosTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TosTableCell>
                          <IconButton
                            onClick={() => removeRow(index)}
                            size="small"
                          >
                            <HighlightOffRoundedIcon
                              color="error"
                              sx={{ fontSize: 20 }}
                            />
                          </IconButton>
                        </TosTableCell>
                        <TosTableCell>
                          <FormControl size="small" sx={{ width: "180px" }}>
                            <InputLabel id="lessonLabel" required>
                              Lesson
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="lessonLabel"
                              label="Lesson"
                              value={
                                lessonOption.some((l) => l.id === row.lesson_id)
                                  ? row.lesson_id
                                  : ""
                              }
                              size="small"
                              required
                              name="lessonId"
                              disabled={lessonOption.length === 0}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "lesson_id",
                                  e.target.value
                                )
                              }
                            >
                              {lessonOption.map((data, i) => {
                                return (
                                  <MenuItem
                                    key={i}
                                    value={data.id}
                                    onClick={() =>
                                      handleInputChange(
                                        index,
                                        "topic",
                                        data.title
                                      )
                                    }
                                  >
                                    {data.title}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </TosTableCell>
                        <TosTableCell>
                          <TextField
                            sx={{
                              width: "80px",
                              bgcolor: "#fafafa",
                              borderRadius: 2,
                            }}
                            label="Hours"
                            size="small"
                            required
                            index={index}
                            type="number"
                            name="hoursInput"
                            inputProps={{ min: 1 }}
                            value={row.hours || ""}
                            min={0}
                            placeholder="Hours"
                            onChange={(e) =>
                              handleInputChange(index, "hours", e.target.value)
                            }
                          />
                        </TosTableCell>
                        <TosTableCell>{row.percentage} %</TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">
                          {row.remembering}
                        </TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">
                          {row.understanding}
                        </TosTableCell>
                        <TosTableCell bgcolor="#fffde7">
                          {row.applying}
                        </TosTableCell>
                        <TosTableCell bgcolor="#fffde7">
                          {row.analyzing}
                        </TosTableCell>
                        <TosTableCell bgcolor="#ffebee">
                          {row.creating}
                        </TosTableCell>
                        <TosTableCell bgcolor="#ffebee">
                          {row.evaluating}
                        </TosTableCell>
                        <TosTableCell>{row.totalItems}</TosTableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TosTableCell />
                      <TosTableCell>
                        <b>Total</b>
                      </TosTableCell>
                      <TosTableCell>{total.hours}</TosTableCell>
                      <TosTableCell>{total.percentage}%</TosTableCell>
                      <TosTableCell bgcolor="#e3f2fd">
                        {total.remembering}
                      </TosTableCell>
                      <TosTableCell bgcolor="#e3f2fd">
                        {total.understanding}
                      </TosTableCell>
                      <TosTableCell bgcolor="#fffde7">
                        {total.applying}
                      </TosTableCell>
                      <TosTableCell bgcolor="#fffde7">
                        {total.analyzing}
                      </TosTableCell>
                      <TosTableCell bgcolor="#ffebee">
                        {total.creating}
                      </TosTableCell>
                      <TosTableCell bgcolor="#ffebee">
                        {total.evaluating}
                      </TosTableCell>
                      <TosTableCell bgcolor="#e0e0e0">
                        {total.totalItems}
                      </TosTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              disableElevation
              onClick={addRow}
              disabled={lessonOption.length === 0 || total.items <= rows.length}
              loading={loading}
              startIcon={<AddCircleOutlineRoundedIcon />}
            >
              Add Topic
            </Button>

            {loading ? (
              <Typography
                color="text.secondary"
                fontStyle="italic"
                alignSelf={"center"}
              >
                {status}
              </Typography>
            ) : (
              <Stack
                direction="row"
                width="100%"
                justifyContent="space-between"
                mt={4}
              >
                <Button
                  disabled={loading}
                  color="error"
                  onClick={onCancel}
                  disableElevation
                >
                  CANCEL
                </Button>
                <Button
                  disableElevation
                  disabled={loading}
                  variant="contained"
                  type="submit"
                  color="success"
                >
                  CONTINUE
                </Button>
              </Stack>
            )}
          </Stack>
        </SectionCard>
      </form>
      <CustomTosDialog
        open={tosDialog}
        setOpen={() => setTosDialog(false)}
        setTosAllocation={setTosAllocation}
        onCancel={() => {
          setTosDropdown("default");
          setTosDialog(false);
        }}
      />
    </Container>
  );
}

export default Tosifier;
