import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { supabase } from "../../../../helper/Supabase";

function AddLessonDialog(props) {
  const { open, setOpen, subjectId, subjectName } = props;

  const [lessonList, setLessonList] = useState([]);
  const [lesson, setLesson] = useState("");

  const onClose = () => {
    setOpen(false);
    setLesson("");
    setLessonList([]);
  };

  const addToList = (e) => {
    e.preventDefault();
    setLessonList([...lessonList, lesson]);
    setLesson("");
  };

  const removeFromList = (index) => {
    const newList = lessonList.filter((_, i) => index != i);

    setLessonList(newList);
  };

  const createLesson = async () => {
    const payload = lessonList.map((data, index) => {
      return { title: data, subject_id: subjectId };
    });

    const { error: lessonErr } = await supabase
      .from("tbl_lesson")
      .insert(payload);

    if (lessonErr) {
      console.log("error creating lesson:", lessonErr);
      return;
    }

    setLessonList([]);
    setLesson("");
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth={lessonList.length == 0 ? "sm" : "lg"}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Create a new Lesson?</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid flex={2}>
            <DialogContentText id="alert-dialog-description">
              Create new lesson/s for {subjectName}
            </DialogContentText>
            <Box component="form" onSubmit={addToList} mt={1}>
              <TextField
                required
                fullWidth
                size="small"
                label="enter lesson name"
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
              />
              <Stack alignItems="end">
                <Button size="small" color="success" type="submit">
                  + Add
                </Button>
              </Stack>
            </Box>
          </Grid>
          {lessonList.length != 0 && (
            <Grid flex={1}>
              <Card variant="outlined" sx={{ p: 1 }}>
                <DialogContentText>Lessons to add:</DialogContentText>
                {lessonList.map((data, index) => {
                  return (
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" alignSelf="center">
                        {data}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeFromList(index)}
                      >
                        remove
                      </Button>
                    </Stack>
                  );
                })}
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button color="error" size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            size="small"
            variant="contained"
            disableElevation
            onClick={() => createLesson()}
            disabled={lessonList.length == 0 ? true : false}
          >
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddLessonDialog;
