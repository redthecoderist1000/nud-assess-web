import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function PolicyDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          "1. We collect personal data for security purposes.\n" + "2. Your
          information is kept confidential.\n" + "3. We do not share your data
          with third parties."
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PolicyDialog;
