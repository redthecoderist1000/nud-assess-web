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
import React, { useContext, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

const DeleteProg = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteProgram = async () => {
    // delete program logic here
    const { error } = await supabase
      .from("tbl_program")
      .delete()
      .eq("id", item.prog_id);

    if (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to delete program. Please try again.",
        severity: "error",
      });

      return;
    }

    // demote prog chair if exists
    if (item.prog_chair_id) {
      const { error: demoteError } = await supabase
        .from("tbl_users")
        .update({ role: "Faculty" })
        .eq("id", item.prog_chair_id);

      if (demoteError) {
        setSnackbar({
          open: true,
          message: "Program deleted but failed to demote program chair.",
          severity: "warning",
        });

        setLoading(false);
        return;
      }
    }

    setSnackbar({
      open: true,
      message: "Program deleted successfully.",
      severity: "success",
    });

    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-program-dialog"
      aria-describedby="delete-program-dialog-description"
    >
      <DialogTitle id="delete-program-dialog-title">Delete Program</DialogTitle>
      <DialogContent>
        <Stack spacing={2} justifyItems={"center"}>
          <DialogContentText
            id="delete-program-dialog-description"
            alignSelf="center"
          >
            Are you sure you want to delete the program <b>{item?.prog_name}</b>
            ? This action cannot be undone.
          </DialogContentText>
          <Divider />

          <Typography variant="caption" color="text.secondary">
            note: This action is irreversible. Please ensure you have selected
            the correct program before proceeding.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                onClick={(e) => setIsChecked(e.target.checked)}
                color="success"
              />
            }
            label={
              <Typography>
                I understand the consequences of this action.
              </Typography>
            }
            sx={{ color: "text.secondary", mt: 1, fontSize: 10 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button color="error" size="small" disableElevation onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          disableElevation
          size="small"
          loading={loading}
          disabled={!isChecked}
          autoFocus
          onClick={deleteProgram}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProg;
