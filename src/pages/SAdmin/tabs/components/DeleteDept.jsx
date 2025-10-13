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

const DeleteDept = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteDept = async () => {
    // delete dept
    setLoading(true);

    const { error } = await supabase
      .from("tbl_department")
      .delete()
      .eq("id", item.dept_id);
    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete department. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    setSnackbar({
      open: true,
      message: "Department deleted successfully.",
      severity: "success",
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dept-dialog"
      aria-describedby="delete-dept-dialog-description"
    >
      <DialogTitle id="delete-dept-dialog-title">Delete Department</DialogTitle>
      <DialogContent>
        <Stack spacing={2} justifyItems={"center"}>
          <DialogContentText
            id="delete-dept-dialog-description"
            alignSelf="center"
          >
            Are you sure you want to delete the department{" "}
            <b>{item?.dept_name}</b>? This action cannot be undone.
          </DialogContentText>
          <Divider />

          <Typography variant="caption" color="text.secondary" align="justify">
            note: This action is irreversible. All programs under this
            department will also be deleted. Please ensure you have selected the
            correct department before proceeding.
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
          onClick={deleteDept}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDept;
