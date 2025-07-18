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
import React, { useState } from "react";
import { supabase } from "../../../helper/Supabase";

function DisableAiDialog(props) {
  const { open, setOpen, facultyId, name, allowAi } = props;
  const [loading, setLoading] = useState(false);

  const disableAi = async () => {
    setLoading(true);
    if (allowAi) {
      const { data: disableData, error: disableErr } = await supabase
        .from("tbl_users")
        .update({ allow_ai: false })
        .eq("id", facultyId)
        .select("*");

      if (disableErr) {
        console.log("error disable:", disableErr);
        return;
      }
      console.log("sakses disable:", disableData);
    } else {
      const { data: ableData, error: ableErr } = await supabase
        .from("tbl_users")
        .update({ allow_ai: true })
        .eq("id", facultyId)
        .select("*");

      if (ableErr) {
        console.log("error able:", ableErr);
        return;
      }
      console.log("sakses able:", ableData);
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
        {loading ? (
          <LinearProgress />
        ) : (
          <Button
            color={!allowAi ? "success" : "error"}
            variant="contained"
            size="small"
            onClick={disableAi}
            disableElevation
          >
            {!allowAi ? "Enable" : "Disable"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DisableAiDialog;
