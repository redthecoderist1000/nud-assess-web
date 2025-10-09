import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";

const RetakeDialog = ({ retake, onClose }) => {
  const { setSnackBar } = useContext(userContext);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("tbl_result")
      .delete()
      .eq("id", retake.result_id);
    if (error) {
      //   console.log(error);
      setSnackBar({
        open: true,
        message: "Failed to delete result",
        severity: "error",
      });
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (!retake.open) {
      setChecked(false);
      setIsLoading(false);
    }
  }, [retake.open]);

  return (
    <Dialog
      open={retake.open}
      onClose={onClose}
      aria-labelledby="retake-dialog-title"
      aria-describedby="retake-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Retake Quiz?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Allow <b>{retake.student_name}</b> to retake the quiz? This action
          cannot be undone.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, fontWeight: "bold" }}>
          The previous result will be deleted.
        </DialogContentText>
        <DialogContentText>Are you sure you want to proceed?</DialogContentText>

        <Divider>
          <Typography variant="caption" color="text.secondary">
            note
          </Typography>
        </Divider>

        <Typography
          variant="caption"
          color="text.secondary"
          textAlign={"center"}
        >
          Some quizzes allow students to view the correct answers after
          submission.
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              onClick={(e) => setChecked(e.target.checked)}
              color="success"
            />
          }
          label="I read and understand the consequences."
          sx={{ color: "text.secondary", mt: 1, fontSize: 10 }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="success"
          variant="contained"
          disableElevation
          onClick={submit}
          disabled={!checked}
          loading={isLoading}
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetakeDialog;
