import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useContext, useState } from "react";
import { userContext } from "../../../../App";
import { supabase } from "../../../../helper/Supabase";

const DeleteSchool = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);

  const [loading, setLoading] = useState(false);

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
        <DialogContentText id="delete-school-dialog-description">
          Are you sure you want to delete the school <b>{item?.school_name}</b>?
          This action cannot be undone.
        </DialogContentText>
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
