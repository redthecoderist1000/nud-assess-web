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
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

function AssignQuizDialog({ open, setOpen, classId, setSnackbar }) {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizInfo, setQuizInfo] = useState({});

  useEffect(() => {
    if (!open) {
      return;
    }
    fetchQuizzes();
    setSelectedQuiz(null);
    setSearch("");
    setQuizInfo({});
  }, [open]);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase.from("vw_allquizbyuser").select("*");
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

  const filteredQuizzes = useMemo(() => {
    if (search === "") {
      return quizzes;
    }

    return quizzes.filter((quiz) => {
      const matchQuizName = quiz.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchSubjectName = quiz.subject_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchSubjectCode = quiz.subject_code
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchQuizName || matchSubjectName || matchSubjectCode;
    });
  }, [search, quizzes]);

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
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Stack>
                  <ListItemText>
                    <b>{selectedQuiz.name}</b> | {selectedQuiz.total_items}{" "}
                    items
                  </ListItemText>
                  <ListItemText>
                    {selectedQuiz.subject_name} ({selectedQuiz.subject_code})
                  </ListItemText>
                </Stack>
                <Button color="error" onClick={() => setSelectedQuiz(null)}>
                  remove
                </Button>
              </Stack>
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
        <TextField
          label="search quiz"
          type="text"
          size="small"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
        <List
          sx={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}
          dense
        >
          {filteredQuizzes.map((data, index) => {
            return (
              <ListItemButton key={index} onClick={() => setSelectedQuiz(data)}>
                <Stack>
                  <ListItemText>
                    <b>{data.name}</b> | {data.total_items} items
                  </ListItemText>
                  <ListItemText>
                    {data.subject_name} ({data.subject_code})
                  </ListItemText>
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
