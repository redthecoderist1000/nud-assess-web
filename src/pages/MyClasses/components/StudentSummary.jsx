import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
} from "@mui/material";

function StudentSummary(props) {
  const { open, close, result_id } = props;

  return (
    <Dialog
      fullWidth={true}
      maxWidth="xl"
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Student Summary</DialogTitle>
      <DialogContent>
        {result_id ? (
          <Grid container spacing={1}>
            <Grid size={2}>
              <Paper variant="outlined">1</Paper>
            </Grid>
            <Grid size={1}>
              <Card>2</Card>
            </Grid>
          </Grid>
        ) : (
          <DialogContentText>No Summary Available</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudentSummary;
