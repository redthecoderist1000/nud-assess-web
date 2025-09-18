import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import React from "react";

function GenQuestionDialog({ dialog, setDialog }) {
  return (
    <Dialog
      open={dialog.open}
      onClose={() => setDialog({ ...dialog, open: false })}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack flexGrow={1} direction={"row"} justifyContent="space-between">
          <Button
            color="error"
            onClick={() => setDialog({ ...dialog, open: false })}
          >
            cancel
          </Button>
          {dialog.action && (
            <Button
              color="success"
              variant="contained"
              disableElevation
              onClick={dialog.action}
              autoFocus
            >
              Continue
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default GenQuestionDialog;
