import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Stack,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

function DisableAiDialog(props) {
  const { setSnackbar } = useContext(userContext);
  const { open, setOpen, facultyId, name, allowAi } = props;
  const [loading, setLoading] = useState(false);

  const disableAi = async () => {
    setLoading(true);

    const newStatus = !allowAi;
    const action = newStatus ? "enabled" : "disabled";

    const { error } = await supabase
      .from("tbl_users")
      .update({ allow_ai: newStatus })
      .eq("id", facultyId)
      .select("*");

    if (error) {
      setSnackbar({
        open: true,
        message: `Error ${action} AI usage`,
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: `Successfully ${action} AI usage for ${name}`,
        severity: "success",
      });
    }

    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {" "}
        {!allowAi ? "Enable" : "Disable"} AI usage?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you want to {!allowAi ? "allow" : "prevent"} <b>{name}</b> from
          creating quizzes and questions using AI?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction={"row"} justifyContent={"space-between"} flex={1}>
          <Button
            color="error"
            loading={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            color={!allowAi ? "success" : "error"}
            variant="contained"
            size="small"
            loading={loading}
            onClick={disableAi}
            disableElevation
          >
            {!allowAi ? "Enable" : "Disable"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default DisableAiDialog;
