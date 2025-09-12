import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { supabase } from "../../../helper/Supabase";
import { useState } from "react";

function LogoutDialog({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      setLoading(false);
      return;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Sign out</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to sign out?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction={"row"} justifyContent={"space-between"} flexGrow={1}>
          <Button color="error" onClick={onClose}>
            cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleLogout}
            autoFocus
            disableElevation
            loading={loading}
          >
            sign out
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutDialog;
