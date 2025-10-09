import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { userContext } from "../../../App";
import { supabase } from "../../../helper/Supabase";

const ForgotPasswordDialog = ({ open, onClose }) => {
  const env = import.meta.env;

  const { setSnackbar } = useContext(userContext);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const domain = email.split("@")[1];
    if (domain != "nu-dasma.edu.ph" && env.VITE_ENVIRONMENT === "deployed") {
      setSnackbar({
        open: true,
        message: "Please use your valid NUD Employee email",
        severity: "error",
      });
      return;
    }
    setIsLoading(true);

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          env.VITE_ENVIRONMENT === "deployed"
            ? "http://nud-assess-test.onrender.com/reset-password"
            : "http://localhost:5173/reset-password",
      });

      setSnackbar({
        open: true,
        message: `Link to reset password has been sent to your ${email}`,
        severity: "success",
      });
      setEmail("");
    } catch (error) {
      // console.log(error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
      return;
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="forgot-password-dialog-title"
      aria-describedby="forgot-password-dialog-description"
    >
      <DialogTitle id="forgot-password-dialog-title">
        Forgot Password?
      </DialogTitle>
      <form onSubmit={submit}>
        <DialogContent>
          <DialogContentText id="forgot-password-dialog-description">
            Enter the NUD email address associated with your account, and we'll
            send you a link to reset your password.
          </DialogContentText>
          <TextField
            required
            size="small"
            autoFocus
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            loading={isLoading}
            disableElevation
            variant="contained"
            type="submit"
            autoFocus
          >
            Send
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
