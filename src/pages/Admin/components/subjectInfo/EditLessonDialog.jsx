import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../../helper/Supabase";

function EditLessonDialog(props) {
  const { selectedLesson, set } = props;
  const [name, setName] = useState("");

  const closeDialog = () => {
    set({ id: "", name: "" });
    setName("");
  };

  const editLesson = async () => {
    const { error } = await supabase
      .from("tbl_lesson")
      .update({
        title: name,
      })
      .eq("id", selectedLesson.id);

    if (error) {
      console.log("error edit lesson:", error);
      return;
    }
    closeDialog();
  };

  return (
    <Dialog
      open={selectedLesson?.id != ""}
      fullWidth
      maxWidth="sm"
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit Lesson</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Change the name of <b>{selectedLesson.name}</b>
        </DialogContentText>
        <TextField
          required
          fullWidth
          size="small"
          label="Enter new lesson name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Stack width="100%" justifyContent="space-between" direction="row">
          <Button color="error" size="small" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            color="success"
            size="small"
            disableElevation
            variant="contained"
            onClick={editLesson}
            disabled={name.length == 0}
          >
            Continue
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default EditLessonDialog;
