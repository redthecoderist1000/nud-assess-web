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
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

function PromoteDialog({ open, setOpen, facultyId, name, role }) {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);

  const promote = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tbl_users")
      .update({ role: role == "Faculty" ? "Admin" : "Faculty" })
      .eq("id", facultyId);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to update faculty permissions. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    setSnackbar({
      open: true,
      message: `Successfully updated ${name}'s permissions.`,
      severity: "success",
    });
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={() => setOpen(false)}
      aria-labelledby="admin-access-dialog"
      aria-describedby="admin-access-dialog-description"
    >
      <DialogTitle>Admin Access</DialogTitle>
      <DialogContent>
        <Stack direction={"row"} alignItems="center" spacing={2}>
          <WarningRoundedIcon color="warning" />
          {role == "Faculty" ? (
            <DialogContentText>
              This action will give <b>{name}</b> Administrator access to NUD
              Assess, including managing faculties and subjects. Do you want to
              proceed?
            </DialogContentText>
          ) : (
            <DialogContentText>
              This action will revoke <b>{name}</b>'s Administrator access to
              NUD Assess, including managing faculties and subjects. Do you want
              to proceed?
            </DialogContentText>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction={"row"} justifyContent={"space-between"} flex={1}>
          <Button
            color="error"
            loading={loading}
            onClick={() => setOpen(false)}
          >
            cancel
          </Button>
          <Button
            loading={loading}
            color={role == "Faculty" ? "success" : "error"}
            variant="contained"
            disableElevation
            onClick={promote}
            autoFocus
          >
            {role == "Faculty" ? "promote" : "revoke"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default PromoteDialog;
