import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

function AutoSignOut({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
    >
      <DialogTitle>Auto Sign Out</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have been signed out due to inactivity.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="warning"
          variant="contained"
          disableElevation
          autoFocus
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AutoSignOut;
