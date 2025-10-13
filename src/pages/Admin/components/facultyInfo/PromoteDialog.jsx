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
  const { user, setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState({});

  const promote = async () => {
    setLoading(true);

    // console.log("program data", programData);
    // console.log("faculty id", facultyId);
    // console.log("role", role);

    // get old assistant program chair
    const { data: prevProg, error: fetchError } = await supabase
      .from("tbl_program")
      .select("assistant_program_chair")
      .eq("id", programData.id)
      .single();

    if (fetchError) {
      setSnackbar({
        open: true,
        message: "Failed to retrieve program information. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // demote old assistant program chair to faculty if exists
    if (prevProg.assistant_program_chair) {
      const { error: demoteError } = await supabase
        .from("tbl_users")
        .update({ role: "Faculty" })
        .eq("id", prevProg.assistant_program_chair);
      if (demoteError) {
        setSnackbar({
          open: true,
          message:
            "Failed to demote previous assistant program chair. Please try again.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
    }

    const payload = {
      assistant_program_chair: role == "Faculty" ? facultyId : null,
    };
    // console.log("payload", payload);
    // update assistant program chair
    const { data, error: updateError } = await supabase
      .from("tbl_program")
      .update(payload)
      .eq("id", programData.id)
      .select();

    if (updateError) {
      // console.log("update program error", updateError);
      setSnackbar({
        open: true,
        message: "Failed to update program information. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // console.log("update program data", data);
    // update to admin or faculty
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
      return;
    }
    fetchProgramData();
  }, [open]);

  const fetchProgramData = async () => {
    // get program id
    const { data, error } = await supabase
      .from("tbl_program")
      .select("id, name, assistant_program_chair")
      .eq("program_chair", user.id)
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to retrieve program information. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    setProgramData(data);
    // console.log("program data", data);
  };

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
              <Typography>Affected Program:</Typography>
              <Typography fontWeight={"bold"}>{programData.name}</Typography>
            </DialogContentText>
          ) : (
            <DialogContentText>
              This action will revoke <b>{name}</b>'s Administrator access to
              NUD Assess, including managing faculties and subjects. Do you want
              to proceed?
              <Typography>Affected Program:</Typography>
              <Typography fontWeight={"bold"}>{programData.name}</Typography>
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
