import {
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
import Error from "./tosifierErrorDialogs/Error";
import FileUpload from "../../../components/elements/FileUpload";
import { aiRun } from "../../../helper/Gemini";
import AiError from "./tosifierErrorDialogs/AiError";

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

const LegendBox = styled("div")({
  display: "flex",
  gap: "24px",
  marginTop: "16px",
  alignItems: "center",
  fontSize: "15px",
});

const LegendItem = styled("span")(({ color }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 500,
  color: "#333",
  "&:before": {
    content: '""',
    display: "inline-block",
    width: "18px",
    height: "18px",
    borderRadius: "4px",
    background: color,
    marginRight: "6px",
    border: "1px solid #ccc",
  },
}));

function Tosifier(props) {
  //   const { quizDetail } = props;\
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [quizDetail, setQuizDetail] = useState({
    ...props.quizDetail,
    subject_id: "",
    subject_name: "",
    is_random: false,
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

  const [response, setResponse] = useState("");
  const [quiz, setQuiz] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [lessonOption, setLessonOption] = useState([]);

  const [error, setError] = useState(false);

  const [files, setFiles] = useState([]);

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
      const percents = {
        remembering: 0.3,
        understanding: 0.2,
        applying: 0.2,
        analyzing: 0.1,
        creating: 0.1,
        evaluating: 0.1,
      };

      // Compute exact and floored values
      const exacts = {};
      const floors = {};
      const remainders = [];
      let sumFloors = 0;
      Object.entries(percents).forEach(([key, percent]) => {
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
  }, [total.hours, total.items]);

  //   fetch subjects by user department
  const fetchSubjects = async () => {
    // console.log(props.quizDetail);

    if (props.quizDetail.repository == "Final Exam") {
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
    fetchSubjects();
  }, []);

  const handleQuizDetail = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    // If subject_id is changed, also update subject_name

    if (name == "open_time") {
      // console.log(e);
      return;
    }

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

    // console.log("Quiz Detail:", quizDetail);
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
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    //

    setRows(updatedRows);
    // console.log("Updated Rows:", updatedRows);
  };

  const removeRow = () => {
    rows.pop();
    setRows([...rows]);
  };

  const submitForm = (e) => {
    e.preventDefault();

    switch (quizDetail.mode) {
      case "AI-Generated":
        generateQuestion();
        break;

      case "Random":
        randomQuiz();
        break;

      default:
        break;
    }
  };

  const getCount = async (category, lesson_id, limit) => {
    const { data, error } = await supabase
      .from("tbl_question")
      .select("id")
      .eq("repository", props.quizDetail.repository)
      .eq("lesson_id", lesson_id)
      .eq("blooms_category", category)
      .limit(limit);

    return { count: data.length, error: error };
  };

  const randomQuiz = async () => {
    // console.log(rows);
    // check if may avaialble questions
    setLoading(true);

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
      // console.log(quizDetail);

      navigate("/quizsummary", {
        state: {
          quizDetail: quizDetail,
          rows: rows,
          total: total,
          quiz: [],
        },
      });
    } else {
      // console.log("There seems to be not enough quetions");
      // display errro
      setError(true);
    }

    setLoading(false);
  };

  const generateQuestion = async () => {
    if (files.length <= 0) {
      setResponse("Upload atleast 1 pdf file as reference.");
      return;
    }

    setLoading(true);
    setQuiz([]);

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

    if (rows.length === 0) {
      setResponse("There must be atleast 1 topic");
      return;
    }

    if (total.hours <= 0) {
      setResponse("Hours cannot be equal or less than 0");
      return;
    }

    try {
      const result = await aiRun(files, texts);

      if (result.status == "Success") {
        // console.log("sakses response:", result);
        setQuiz(result.questions);
        navigate("/quizsummary", {
          state: {
            quizDetail: quizDetail,
            rows: rows,
            total: total,
            quiz: result.questions,
          },
        });
      } else {
        // success ai pero irrelevant ung pdf files
        setResponse(
          "The files you uploaded may have been irrelevant to the subject and topics."
        );
      }
      setLoading(false);
      // props.onCancel();
    } catch (error) {
      // ai error
      // console.error(error);
      setLoading(false);
      setResponse(
        "There seems to be a problem on our side. Please try again. "
      );
    }
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
          <Typography variant="h6" fontWeight={700} mb={1}>
            Advanced Options
          </Typography>
          <Typography mb={3} color="text.secondary">
            Configure advanced quiz settings
          </Typography>
          <Grid container columnGap={3}>
            <Grid flex={1}>
              <TextField
                size="small"
                fullWidth
                type="number"
                label="Time Limit (minutes)"
                name="time_limit"
                onChange={handleQuizDetail}
                sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
              />
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
          </Grid>
        </SectionCard>

        {/* Table of Specification Section */}
        <SectionCard elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Table of Specification
          </Typography>
          <Typography mb={3} color="text.secondary">
            Create Table of Specification to generate quiz questions based on Bloom's Taxonomy
          </Typography>
          <Stack rowGap={2}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={2}>
              <Typography fontWeight={500} mr={2}>
                Total Items:
              </Typography>
              <OutlinedInput
                size="small"
                required
                className="itemInput"
                type="number"
                placeholder="Total Items"
                onChange={changeTotalItems}
                sx={{ width: "80px", mr: 2, bgcolor: "#fafafa", borderRadius: 2 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={addRow}
                disableElevation
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2,
                  mr: 2,
                }}
              >
                ADD TOPIC
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={removeRow}
                disabled={rows.length === 0}
                disableElevation
                sx={{
                  bgcolor: "#e0e0e0",
                  color: "#333",
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2,
                }}
              >
                REMOVE TOPIC
              </Button>
            </Stack>
            {quizDetail.mode == "AI-Generated" && (
              <FileUpload files={files} setFiles={setFiles} />
            )}
            <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TosTableCell rowSpan={2}><b>Lesson</b></TosTableCell>
                      <TosTableCell rowSpan={2}><b>Hours</b></TosTableCell>
                      <TosTableCell rowSpan={2}><b>Percentage</b></TosTableCell>
                      <TosTableCell colSpan={2} bgcolor="#e3f2fd"><b>EASY</b></TosTableCell>
                      <TosTableCell colSpan={2} bgcolor="#fffde7"><b>MEDIUM</b></TosTableCell>
                      <TosTableCell colSpan={2} bgcolor="#ffebee"><b>HARD</b></TosTableCell>
                      <TosTableCell rowSpan={2}><b>Total Items</b></TosTableCell>
                    </TableRow>
                    <TableRow>
                      <TosTableCell bgcolor="#e3f2fd"><b>Remembering (30%)</b></TosTableCell>
                      <TosTableCell bgcolor="#e3f2fd"><b>Understanding (20%)</b></TosTableCell>
                      <TosTableCell bgcolor="#fffde7"><b>Applying (20%)</b></TosTableCell>
                      <TosTableCell bgcolor="#fffde7"><b>Analyzing (10%)</b></TosTableCell>
                      <TosTableCell bgcolor="#ffebee"><b>Creating (10%)</b></TosTableCell>
                      <TosTableCell bgcolor="#ffebee"><b>Evaluating (10%)</b></TosTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TosTableCell>
                          <FormControl size="small" sx={{ width: "180px" }}>
                            <InputLabel id="lessonLabel" required>
                              Lesson
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="lessonLabel"
                              label="Lesson"
                              value={row.lesson_id || ""}
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
                            sx={{ width: "80px", bgcolor: "#fafafa", borderRadius: 2 }}
                            label="Hours"
                            size="small"
                            required
                            index={index}
                            type="number"
                            name="hoursInput"
                            value={row.hours || ""}
                            min={0}
                            placeholder="Hours"
                            onChange={(e) =>
                              handleInputChange(index, "hours", e.target.value)
                            }
                          />
                        </TosTableCell>
                        <TosTableCell>{row.percentage} %</TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">{row.remembering}</TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">{row.understanding}</TosTableCell>
                        <TosTableCell bgcolor="#fffde7">{row.applying}</TosTableCell>
                        <TosTableCell bgcolor="#fffde7">{row.analyzing}</TosTableCell>
                        <TosTableCell bgcolor="#ffebee">{row.creating}</TosTableCell>
                        <TosTableCell bgcolor="#ffebee">{row.evaluating}</TosTableCell>
                        <TosTableCell>{row.totalItems}</TosTableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TosTableCell><b>Total</b></TosTableCell>
                      <TosTableCell>{total.hours}</TosTableCell>
                      <TosTableCell>100%</TosTableCell>
                      <TosTableCell bgcolor="#e3f2fd">{total.remembering}</TosTableCell>
                      <TosTableCell bgcolor="#e3f2fd">{total.understanding}</TosTableCell>
                      <TosTableCell bgcolor="#fffde7">{total.applying}</TosTableCell>
                      <TosTableCell bgcolor="#fffde7">{total.analyzing}</TosTableCell>
                      <TosTableCell bgcolor="#ffebee">{total.creating}</TosTableCell>
                      <TosTableCell bgcolor="#ffebee">{total.evaluating}</TosTableCell>
                      <TosTableCell bgcolor="#e0e0e0">{total.totalItems}</TosTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <LegendBox>
              <LegendItem color="#e3f2fd">Easy (50%) - Remembering & Understanding</LegendItem>
              <LegendItem color="#fffde7">Medium (30%) - Applying & Analyzing</LegendItem>
              <LegendItem color="#ffebee">Hard (20%) - Creating & Evaluating</LegendItem>
            </LegendBox>
            {loading ? (
              <LinearProgress />
            ) : (
              <Stack direction="row" width="100%" justifyContent="space-between" mt={4}>
                <Button
                  disabled={loading}
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={props.onCancel}
                  sx={{
                    maxWidth: "180px",
                    borderRadius: 2,
                    fontWeight: 700,
                    bgcolor: "#d32f2f",
                    color: "#fff",
                    px: 1.5,
                    py: 1.5,
                  }}
                  disableElevation
                >
                  CANCEL
                </Button>
                {loading ? <CircularProgress /> : <></>}
                <Button
                  disableElevation
                  disabled={loading}
                  variant="contained"
                  size="small"
                  type="submit"
                  color="success"
                  sx={{
                    maxWidth: "280px",
                    borderRadius: 2,
                    fontWeight: 700,
                    bgcolor: "#2e7d32",
                    color: "#fff",
                    px: 1.5,
                    py: 1.5,
                  }}
                >
                  CONTINUE TO QUIZ GENERATION
                </Button>
              </Stack>
            )}
          </Stack>
        </SectionCard>
      </form>

      <Error open={error} setOpen={setError} />

      <AiError
        open={response.length != 0}
        setOpen={setResponse}
        message={response}
      />
    </Container>
  );
}

export default Tosifier;