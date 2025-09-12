import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function DeleteQuiz({ open, onClose, quiz, setSnackbar }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  const confirmDelete = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("tbl_class_exam")
      .delete()
      .eq("id", quiz.class_exam_id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete quiz. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Quiz deleted successfully.",
      severity: "success",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Quiz</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this quiz? <b>{quiz?.name}</b> <br />{" "}
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disableElevation
            loading={loading}
          >
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteQuiz;
