import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function RemMemberDialog(props) {
  const { open, setId, memberId } = props;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  const removeMember = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tbl_class_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      setSnackbar({
        open: true,
        message: "Error removing member",
        severity: "error",
      });

      setTimeout(() => {
        setId(null);
        setLoading(false);
      }, 2000);

      return;
    }
    setSnackbar({
      open: true,
      message: "Member removed successfully",
      severity: "success",
    });
    setTimeout(() => {
      setId(null);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        onClose={() => setId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Remove student from this class?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this student from the class?
          </DialogContentText>
        </DialogContent>
        {loading ? (
          <LinearProgress />
        ) : (
          <DialogActions>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Button color="error" onClick={() => setId(null)}>
                cancel
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => removeMember()}
                autoFocus
                disableElevation
              >
                remove
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default RemMemberDialog;
