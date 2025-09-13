import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

function TermsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          "1. Acceptance of Terms:\n" + " By accessing or using our services,
          you agree to comply with and be bound by these Terms and
          Conditions.\n" + "2. User Responsibilities:\n" + " You are responsible
          for maintaining the confidentiality of your account credentials.\n" +
          "3. Use of Services:\n" + " Our services are intended for personal and
          lawful use only.\n" + "4. Intellectual Property:\n" + " All content,
          trademarks, logos, and intellectual property on this platform.\n"
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

export default TermsDialog;
