import { Dialog, DialogTitle, Divider, DialogContent, DialogContentText, DialogActions, Stack, Button } from "@mui/material";

const DeleteClassDialog = ({ open, onClose, className, onDelete, loading }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete Class: {className}</DialogTitle>
    <Divider />
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this class? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={onDelete} variant="contained" loading={loading}>
          Delete
        </Button>
      </Stack>
    </DialogActions>
  </Dialog>
);

export default DeleteClassDialog;