import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Button,
} from "@mui/material";

const ArchiveClassDialog = ({
  open,
  onClose,
  className,
  onArchive,
  loading,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Archive Class: {className}</DialogTitle>
    <Divider />
    <DialogContent>
      <DialogContentText>
        Are you sure you want to archive this class? This action cannot be
        undone.
      </DialogContentText>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={onArchive} variant="contained" loading={loading}>
          Archive
        </Button>
      </Stack>
    </DialogActions>
  </Dialog>
);

export default ArchiveClassDialog;
