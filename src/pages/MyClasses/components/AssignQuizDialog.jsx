import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import dayjs from "dayjs";
import { userContext } from "../../../App";

function AssignQuizDialog({ open, setOpen, classId, setSnackbar }) {
  const { user } = useContext(userContext);
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState({
    subject: "",
    search: "",
    repository: "",
    tab: "own",
    mode: "All",
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizInfo, setQuizInfo] = useState({});
  const [subjectOption, setSubjectOption] = useState([]);
  const [repositoryOption, setRepositoryOption] = useState([]);

  useEffect(() => {
    if (!open) {
      setFilter({
        subject: "",
        search: "",
        repository: "",
        tab: "own",
        mode: "All",
      });
      setQuizInfo({});
      setSelectedQuiz(null);

      return;
    }
    // fetchQuizzes();
    fetchSubjects();
  }, [open]);

  useEffect(() => {
    if (filter.repository === "") {
      setQuizzes([]);
      return;
    }
    if (filter.repository === "Private") {
      setFilter({ ...filter, tab: "own" });
    }
    fetchQuizzes();
  }, [filter.repository]);

  useEffect(() => {
    setFilter({ ...filter, repository: "" });
    if (filter.subject === "") return;
    getRepository();
  }, [filter.subject]);

  const getRepository = async () => {
    const { data, error } = await supabase
      .from("tbl_subject")
      .select("*")
      .eq("id", filter.subject)
      .eq("faculty_incharge", user.id)
      .maybeSingle();

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch allowed repository. Please try again.",
        severity: "error",
      });
      return;
    }

    if (data) {
      setRepositoryOption(["Quiz", "Final Exam", "Private"]);
    } else {
      setRepositoryOption(["Quiz", "Private"]);
    }
  };

  const fetchQuizzes = async () => {
    const { data, error } = await supabase.from("vw_allquiz").select("*");
    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch quizzes. Please try again.",
        severity: "error",
      });
      return;
    }
    setQuizzes(data);
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("vw_facultysubject")
      .select("*")
      .eq("id", user.id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch subjects. Please try again.",
        severity: "error",
      });
      return;
    }
    setSubjectOption(data);
  };

  const filteredQuizzes = useMemo(() => {
    const search = filter.search.toLowerCase();
    const subject = filter.subject;
    const repository = filter.repository;
    const mode = filter.mode;
    const tab = filter.tab;

    return quizzes.filter((quiz) => {
      const matchesSearch =
        search === "" ||
        [quiz.name, quiz.subject_name, quiz.subject_code].some((field) =>
          field.toLowerCase().includes(search)
        );

      const matchesSubject = subject === "" || quiz.subject_id === subject;

      const matchRepository =
        repository === "" || quiz.repository === repository;

      const matchMode = mode === "All" || quiz.mode === mode;

      const own = tab === "own" && quiz.creator_id === user.id;

      const shared = tab === "shared" && quiz.creator_id !== user.id;

      return (
        matchesSearch &&
        matchesSubject &&
        matchRepository &&
        matchMode &&
        (own || shared)
      );
    });
  }, [filter, quizzes]);

  const confirmAssign = async () => {
    // console.log(quizInfo);
    const now = dayjs();
    const open_time = quizInfo.open_time ?? now;
    const status =
      now.isAfter(open_time) || now.isSame(open_time) ? "Open" : "Scheduled";

    const { error } = await supabase.from("tbl_class_exam").insert({
      class_id: classId,
      exam_id: selectedQuiz.id,
      status: status,
      open_time: open_time,
      ...quizInfo,
    });

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to assign quiz. Please try again.",
        severity: "error",
      });
      return;
    }
    setSnackbar({
      open: true,
      message: "Quiz assigned successfully.",
      severity: "success",
    });
    setOpen(false);
  };

  const handleOpenTime = (e) => {
    setQuizInfo({ ...quizInfo, open_time: e });
  };

  const handleCloseTime = (e) => {
    setQuizInfo({ ...quizInfo, close_time: e });
  };

  const modeOption = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "AI",
      label: "AI Generated",
    },
    {
      value: "Random",
      label: "Random",
    },
    {
      value: "Manual",
      label: "Manual",
    },
  ];

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Assign Quiz</DialogTitle>
      {/* <Divider /> */}
      <DialogContent>
        {/* <DialogContentText>
          Choose from the quizzes you have created.
        </DialogContentText> */}
        {selectedQuiz == null ? (
          <></>
        ) : (
          <Card sx={{ mb: 2 }} variant="outlined">
            <CardContent>
              <DialogContentText>Selected Quiz:</DialogContentText>
              <ListItem
                secondaryAction={
                  <IconButton
                    color="error"
                    size="small"
                    aria-label="remove selected quiz"
                    onClick={() => setSelectedQuiz(null)}
                  >
                    <HighlightOffRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                }
              >
                <Stack width={"100%"} spacing={1}>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography>
                      <b>{selectedQuiz.name}</b> | {selectedQuiz.total_items}{" "}
                      items
                    </Typography>
                    <Typography variant="caption" color="textDisabled">
                      mode: {selectedQuiz.mode} | usage:{" "}
                      {selectedQuiz.usage_count}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography>
                      {selectedQuiz.subject_name} ({selectedQuiz.subject_code})
                    </Typography>
                    <Typography variant="caption" color="textDisabled">
                      created by: {selectedQuiz.created_by}
                    </Typography>
                  </Stack>
                </Stack>
              </ListItem>
              <Typography variant="caption" color="textDisabled">
                Schedule quiz (optional):
              </Typography>
              <Grid container spacing={2}>
                <Grid flex={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Open quiz at:"
                      name="open_time"
                      value={quizInfo.open_time}
                      minDateTime={dayjs()}
                      slotProps={{
                        textField: {
                          sx: { width: "100%" },
                          size: "small",
                        },
                      }}
                      onChange={handleOpenTime}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid flex={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Close quiz at:"
                      name="close_time"
                      value={quizInfo.close_time}
                      minDateTime={
                        quizInfo.open_time ? dayjs(quizInfo.open_time) : dayjs()
                      }
                      slotProps={{
                        textField: {
                          sx: { width: "100%" },
                          size: "small",
                        },
                      }}
                      onChange={handleCloseTime}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              {/* <Typography color="textDisabled" variant="caption">
                note: empty quiz with no open time will be posted immediately
              </Typography> */}
            </CardContent>
          </Card>
        )}
        {/* filters */}
        <Grid container spacing={2} mt={1}>
          <Grid flex={2}>
            <TextField
              label="search quiz"
              type="text"
              size="small"
              value={filter.search}
              fullWidth
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </Grid>
          <Grid flex={1}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="subject_label" value={filter.subject}>
                Subject
              </InputLabel>
              <Select
                labelId="subject_label"
                label="Subject"
                defaultValue=""
                value={filter.subject}
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  -- Select Subjects --
                </MenuItem>
                {subjectOption.map((subject, index) => (
                  <MenuItem key={index} value={subject.subject_id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid flex={1}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="repository_label" value={filter.repository}>
                Repository
              </InputLabel>
              <Select
                labelId="repository_label"
                label="Repository"
                defaultValue=""
                value={filter.repository}
                onChange={(e) =>
                  setFilter({ ...filter, repository: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  -- Select Repositories --
                </MenuItem>
                {repositoryOption.map((repo, index) => (
                  <MenuItem key={index} value={repo}>
                    {repo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid flex={1}>
            <FormControl fullWidth size="small">
              <InputLabel id="mode_label" value={filter.mode}>
                Mode
              </InputLabel>
              <Select
                labelId="mode_label"
                label="Mode"
                defaultValue=""
                value={filter.mode}
                onChange={(e) => setFilter({ ...filter, mode: e.target.value })}
              >
                {modeOption.map((mode, index) => (
                  <MenuItem key={index} value={mode.value}>
                    {mode.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {filter.repository !== "Private" && (
          <Stack direction={"row"} spacing={1} mt={2} mb={1}>
            <Button
              fullWidth
              disableElevation
              variant={filter.tab === "own" ? "contained" : "outlined"}
              onClick={() => setFilter({ ...filter, tab: "own" })}
            >
              Own Quizzes
            </Button>
            <Button
              fullWidth
              disableElevation
              variant={filter.tab === "shared" ? "contained" : "outlined"}
              onClick={() => setFilter({ ...filter, tab: "shared" })}
            >
              Shared Quizzes
            </Button>
          </Stack>
        )}
        {/* quiz lists */}
        <List
          sx={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}
          dense
        >
          {filteredQuizzes.map((data, index) => {
            return (
              <ListItemButton
                title="Click to select this quiz"
                key={index}
                onClick={() => setSelectedQuiz(data)}
              >
                <Stack width={"100%"} spacing={1}>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography>
                      <b>{data.name}</b> | {data.total_items} items
                    </Typography>
                    <Typography variant="caption" color="textDisabled">
                      mode: {data.mode} | usage: {data.usage_count}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography>
                      {data.subject_name} ({data.subject_code})
                    </Typography>
                    <Typography variant="caption" color="textDisabled">
                      created by: {data.created_by}
                    </Typography>
                  </Stack>
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
      {/* <Divider /> */}
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmAssign}
            variant="contained"
            color="success"
            disableElevation
            disabled={selectedQuiz == null}
          >
            Assign
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AssignQuizDialog;
