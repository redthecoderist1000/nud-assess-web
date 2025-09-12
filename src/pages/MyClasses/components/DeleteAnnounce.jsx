import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function DeleteAnnounce({
  open,
  onClose,
  announcement,
  setSnackbar,
  fetchAnnouncements,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  const confirmDelete = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("tbl_announcement")
      .delete()
      .eq("id", announcement.id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Error deleting announcement. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Announcement deleted successfully.",
      severity: "success",
    });
    fetchAnnouncements();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Announcement</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this announcement?{" "}
          <b>{announcement?.title}</b> <br /> This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={() => confirmDelete()}
            variant="contained"
            color="error"
            disableElevation
            loading={loading}
          >
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteAnnounce;
