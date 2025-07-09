import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { model } from "../../../helper/GeminiModel";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../helper/Supabase";

function Tosifier(props) {
  //   const { quizDetail } = props;
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
  const [sourceMaterial, setSourceMaterial] = useState("");
  const [materialList, setMaterialList] = useState([]);

  const [response, setResponse] = useState([]);
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
      // var percentage = (row.hours / total.hours) * 100;
      var percentage = Math.round((row.hours / total.hours) * 100);
      var itemsPerRow = Math.round((total.items * percentage) / 100);

      return {
        ...row,
        percentage: percentage.toFixed(2),
        remembering: Math.round(itemsPerRow * 0.3),
        understanding: Math.round(itemsPerRow * 0.2),
        applying: Math.round(itemsPerRow * 0.2),
        analyzing: Math.round(itemsPerRow * 0.1),
        creating: Math.round(itemsPerRow * 0.1),
        evaluating: Math.round(itemsPerRow * 0.1),

        totalItems: itemsPerRow,
      };
    });

    setRows(updatedRows);
  }, [total.hours, total.items]);

  //   fetch subjects by user department
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("vw_assignedsubject")
        .select("*");

      if (error) {
        console.log("Failed to fetch subject:", error);
        return;
      }

      setSubjectOptions(data);
    })();
  }, []);

  const handleQuizDetail = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    // If subject_id is changed, also update subject_name
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

  const handleFileChange = (e) => {
    setSourceMaterial(e.target.files[0]);

    const path = URL.createObjectURL(e.target.files[0]);
    setMaterialList([
      ...materialList,
      { filename: e.target.files[0].name, path: path },
    ]);
    console.log(materialList);
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

  const generateQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("Generating...");
    setQuiz([]);
    // console.log("Generating...");

    var reqs =
      "The total number of questions are " +
      total.items +
      ". The Lessons are: ";

    rows.forEach((row, index) => {
      reqs +=
        "Lesson no. " +
        (index + 1) +
        ". Lesson_id: " +
        row.lesson_id +
        ". " +
        row.topic +
        " with " +
        row.remembering +
        " question on Remembering, " +
        row.understanding +
        " question on Understanding, " +
        row.applying +
        " question on Applying, " +
        row.analyzing +
        " question on Analyzing, " +
        row.creating +
        " question on Creating, and " +
        row.evaluating +
        " question on Evaluating. ";
    });

    const prompt = reqs;

    if (rows.length === 0) {
      setResponse("There must be atleast 1 topic");
      return;
    }

    if (total.hours <= 0) {
      setResponse("Hours cannot be equal or less than 0");
      return;
    }

    const file = sourceMaterial;
    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64Data = e.target.result.split(",")[1];

      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf",
            },
          },
          prompt,
        ]);
        // setQuiz(JSON.parse(result.response.text()));
        setResponse("Questions generated");
        navigate("/QuizResult", {
          state: {
            quizDetail: quizDetail,
            rows: rows,
            total: total,
            quiz: JSON.parse(result.response.text()),
          },
        });
        setLoading(false);
        props.onCancel();
      } catch (error) {
        console.error(error);
        setLoading(false);
        setResponse(
          "There seems to be a problem on our side. Please try again. "
        );
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
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
    <Container maxWidth="xl">
      <form onSubmit={generateQuestion}>
        <h1 className="text-3xl font-bold mb-2 mt-10">Quiz Details</h1>
        <p className="mb-6 text-gray-600">Enter details about the quiz.</p>
        <Stack mb={10} rowGap={3}>
          <Stack direction="row" columnGap={3}>
            <TextField
              fullWidth
              required
              label="Quiz Name"
              size="small"
              type="text"
              name="name"
              onChange={handleQuizDetail}
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
            <FormControlLabel
              control={
                <Checkbox
                  //   checked={quizDetail.is_random}
                  onChange={() => {
                    setQuizDetail({
                      ...quizDetail,
                      is_random: !quizDetail.is_random,
                    });
                  }}
                />
              }
              label="Randomize quiz items"
            />
          </Stack>
          <Stack direction="row" columnGap={3}>
            <TextField
              size="small"
              label="Description"
              fullWidth
              multiline
              rows={4}
              name="desc"
              onChange={handleQuizDetail}
            />
            <TextField
              label="Objective"
              size="small"
              fullWidth
              multiline
              rows={4}
              name="objective"
              onChange={handleQuizDetail}
            />
          </Stack>
        </Stack>
        <Divider />
        <h1 className="text-3xl font-bold mb-2 mt-10">
          Table of Specification
        </h1>
        <p className="mb-6 text-gray-600">
          Create Table of Specification to create a quiz.
        </p>
        {/* <form onSubmit={generateQuestion}> */}
        <Stack rowGap={4}>
          <Stack
            width="80%"
            m="auto"
            direction="row"
            justifyContent="space-around"
          >
            <OutlinedInput
              size="small"
              required
              name="materialInput"
              className="materialInput"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />

            <OutlinedInput
              size="small"
              required
              className="itemInput"
              type="number"
              placeholder="Total Items"
              onChange={changeTotalItems}
            />

            <div className="tosInputBtn flex gap-10">
              <Button variant="contained" size="small" onClick={addRow}>
                Add Topic
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={removeRow}
                disabled={rows.length === 0}
              >
                Remove Topic
              </Button>
            </div>
          </Stack>
          <Card>
            <TableContainer component={Paper}>
              {/* <div>
            {materialList.map((data, index) => {
              return (
                <p key={index} style={{ color: "white" }}>
                  {" "}
                  {data.filename}{" "}
                </p>
              );
            })}
          </div> */}

              <Table
              //   className="glassCard w-full m-auto p-10"
              >
                <TableHead>
                  <TableRow>
                    {/* <th rowSpan={2}>Source Material</th> */}
                    <TableCell align="center" rowSpan={2}>
                      <b>Topic</b>
                    </TableCell>
                    <TableCell align="center" rowSpan={2}>
                      <b>Hours</b>
                    </TableCell>
                    <TableCell align="center" rowSpan={2}>
                      <b>Percentage</b>
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      <b>EASY</b>
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      <b>MEDIUM</b>
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      <b>HARD</b>
                    </TableCell>
                    <TableCell align="center" rowSpan={2}>
                      <b>Total Items</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <b>Remembering (30%)</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Understanding (20%)</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Applying (20%)</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Analyzing (10%)</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Creating (10%)</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Evaluating (10%)</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      {/* <td>
                    <input
                      required
                      name="matInput"
                      className="matInput"
                      type="file"
                      placeholder="insert file"
                      accept="application/pdf"
                      style={{ width: "200px" }}
                    />
                  </td> */}
                      <TableCell align="center">
                        {/* <OutlinedInput
                          size="small"
                          required
                          name="topicInput"
                          className="topicInput"
                          type="text"
                          placeholder="enter topic"
                          onChange={(e) =>
                            handleInputChange(index, "topic", e.target.value)
                          }
                        /> */}
                        <FormControl size="small" sx={{ width: "250px" }}>
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
                            // defaultValue=""
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
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          sx={{ width: "100px" }}
                          label="Hours"
                          size="small"
                          required
                          index={index}
                          type="number"
                          name="hoursInput"
                          value={row.hours || ""}
                          min={0}
                          placeholder="enter hours"
                          onChange={(e) =>
                            handleInputChange(index, "hours", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell align="center">{row.percentage} %</TableCell>
                      <TableCell align="center">{row.remembering}</TableCell>
                      <TableCell align="center">{row.understanding}</TableCell>
                      <TableCell align="center">{row.applying}</TableCell>
                      <TableCell align="center">{row.analyzing}</TableCell>
                      <TableCell align="center">{row.creating}</TableCell>
                      <TableCell align="center">{row.evaluating}</TableCell>
                      <TableCell align="center">{row.totalItems}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    {/* <td></td> */}
                    <TableCell align="center">
                      <b>Total</b>
                    </TableCell>
                    <TableCell align="center">{total.hours}</TableCell>
                    <TableCell align="center">{total.percentage} %</TableCell>
                    <TableCell align="center">{total.remembering}</TableCell>
                    <TableCell align="center">{total.understanding}</TableCell>
                    <TableCell align="center">{total.applying}</TableCell>
                    <TableCell align="center">{total.analyzing}</TableCell>
                    <TableCell align="center">{total.creating}</TableCell>
                    <TableCell align="center">{total.evaluating}</TableCell>
                    <TableCell align="center">{total.totalItems}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Stack direction="row" width="100%" justifyContent="space-between">
            <Button
              disabled={loading}
              variant="contained"
              size="large"
              color="error"
              onClick={props.onCancel}
              sx={{ maxWidth: "100px" }}
            >
              Cancel
            </Button>
            {loading ? <CircularProgress /> : <></>}
            <Button
              disabled={loading}
              variant="contained"
              size="large"
              type="submit"
              sx={{ maxWidth: "100px" }}
            >
              Continue
            </Button>
          </Stack>
          <p className="response">{response}</p>
        </Stack>
      </form>
    </Container>
  );
}

export default Tosifier;
