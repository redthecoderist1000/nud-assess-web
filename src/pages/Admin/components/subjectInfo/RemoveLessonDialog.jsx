import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../helper/Supabase";

function RemoveLessonDialog(props) {
  const { open, setOpen, subjectId } = props;
  const [lessonList, setLessonList] = useState([]);
  const [lessonOption, setLessonOption] = useState([]);
  const [lessonSearch, setLessonSearch] = useState("");

  const onClose = () => {
    setOpen(false);
    setLessonList([]);
    setLessonOption([]);
    setLessonSearch("");
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    fetchLesson();
  }, [open]);

  const fetchLesson = async () => {
    const { data: lessonData, error: lessonErr } = await supabase
      .from("tbl_lesson")
      .select("*")
      .eq("subject_id", subjectId);

    if (lessonErr) {
      console.log("error fetching lessons:", lessonErr);
      return;
    }

    setLessonOption(lessonData);
  };

  const visibleOptions = useMemo(
    () =>
      lessonOption
        .filter((data) => {
          const matchLessonName = data.title
            .toLowerCase()
            .includes(lessonSearch.toLowerCase());

          return matchLessonName;
        })
        .filter((data) => {
          const existList = lessonList.find((d) => d.id == data.id)
            ? false
            : true;
          return existList;
        }),
    [lessonSearch, lessonList]
  );

  const removeToList = (id) => {
    const newList = lessonList.filter((d) => (id == d.id ? false : true));
    setLessonList(newList);
  };

  const confirmRemove = async () => {
    const payload = lessonList.map((d) => d.id);

    const { data, error } = await supabase
      .from("tbl_lesson")
      .delete()
      .in("id", payload);

    if (error) {
      console.log("error delete lesson:", error);
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Remove Lesson</DialogTitle>
      <DialogContent>
        {/* card list */}
        <Card sx={{ mb: 2, p: 2 }} variant="outlined">
          <DialogContentText>Selected lesson/s:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {lessonList.map((data, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText>{data.title}</ListItemText>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeToList(data.id)}
                  >
                    undo
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Card>
        <Input
          placeholder="Search Lesson"
          value={lessonSearch}
          sx={{ my: 2, width: "100%" }}
          onChange={(e) => setLessonSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            lessonSearch == "" ? null : (
              <InputAdornment
                position="end"
                onClick={() => setLessonSearch("")}
              >
                <CloseIcon />
              </InputAdornment>
            )
          }
        />
        {/* options */}
        <List sx={{ width: "100%" }}>
          {lessonSearch == "" && lessonList.length == 0
            ? lessonOption.map((data, index) => {
                return (
                  <ListItemButton
                    key={index}
                    onClick={() => setLessonList([...lessonList, data])}
                  >
                    <ListItemText primary={data.title} />
                  </ListItemButton>
                );
              })
            : visibleOptions.map((data, index) => {
                return (
                  <ListItemButton
                    key={index}
                    onClick={() => setLessonList([...lessonList, data])}
                  >
                    <ListItemText primary={data.title} />
                  </ListItemButton>
                );
              })}
        </List>
      </DialogContent>
      <DialogActions>
        <Stack width="100%" justifyContent="space-between" direction="row">
          <Button color="error" size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="error"
            size="small"
            disableElevation
            variant="contained"
            onClick={confirmRemove}
            disabled={lessonList.length == 0}
          >
            Remove Lessons
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveLessonDialog;
