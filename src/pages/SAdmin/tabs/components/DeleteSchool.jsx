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
import { useContext, useState } from "react";
import { userContext } from "../../../../App";
import { supabase } from "../../../../helper/Supabase";

const DeleteSchool = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);

  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteSchool = async () => {
    const { error } = await supabase
      .from("tbl_school")
      .delete()
      .eq("id", item.school_id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete school. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    setSnackbar({
      open: true,
      message: "School deleted successfully.",
      severity: "success",
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-school-dialog"
      aria-describedby="delete-school-dialog-description"
    >
      <DialogTitle id="delete-school-dialog-title">Delete School</DialogTitle>
      <DialogContent>
        <Stack spacing={2} justifyItems={"center"}>
          <DialogContentText
            id="delete-school-dialog-description"
            alignSelf="center"
          >
            Are you sure you want to delete the school{" "}
            <b>{item?.school_name}</b>? This action cannot be undone.
          </DialogContentText>
          <Divider />

          <Typography variant="caption" color="text.secondary">
            note: This action is irreversible. All departments and programs
            under this school will also be deleted. Please ensure you have
            selected the correct school before proceeding.
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
          onClick={deleteSchool}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSchool;
