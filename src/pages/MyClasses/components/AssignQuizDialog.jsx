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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function AssignQuizDialog({ open, setOpen, classId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    fetchQuizzes();
    setSelectedQuiz(null);
    setSearch("");
  }, [open]);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase.from("vw_allquizbyuser").select("*");
    if (error) {
      console.log("fail to fetch quizzes:", error);
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
    const { error } = await supabase
      .from("tbl_class_exam")
      .insert({ class_id: classId, exam_id: selectedQuiz.id });

    if (error) {
      console.log("fail to assign quiz:", error);
      return;
    }
    setOpen(false);
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
      <Divider />
      <DialogContent>
        {/* <DialogContentText>
          Choose from the quizzes you have created.
        </DialogContentText> */}
        {selectedQuiz == null ? (
          <></>
        ) : (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <DialogContentText>Selected Quiz:</DialogContentText>
              <ListItem>
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
              </ListItem>
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
        <List sx={{ width: "100%" }}>
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
      <Divider />
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmAssign}
            variant="contained"
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
