import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

function Error(props) {
  const { open, setOpen } = props;

  return (
    <Dialog
      size="md"
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Not enough questions</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There seems to be insufficient number of questions to create a quiz
          with your specified items
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          color="error"
          size="small"
          variant="contained"
          disableElevation
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Error;
