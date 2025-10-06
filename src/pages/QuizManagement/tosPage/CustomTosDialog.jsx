import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

function CustomTosDialog({ open, setOpen, setTosAllocation, onCancel }) {
  const [tempTos, setTempTos] = useState({
    remembering: 0,
    understanding: 0,
    applying: 0,
    analyzing: 0,
    creating: 0,
    evaluating: 0,
  });

  useEffect(() => {
    if (open) {
      setTempTos({
        remembering: 0,
        understanding: 0,
        applying: 0,
        analyzing: 0,
        creating: 0,
        evaluating: 0,
      });
    }
  }, [open]);

  const handleKeyDown = (e) => {
    // Prevent decimal, minus, and exponential notation
    if ([".", "e", "-", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setTempTos((prev) => ({ ...prev, [name]: value }));
  };

  const total = useMemo(
    () =>
      Object.values(tempTos).reduce((acc, curr) => acc + Number(curr), 0) || 0,
    [tempTos]
  );

  const confirm = () => {
    // setTosAllocation(tempTos);
    // setOpen(false);

    if (total !== 100) {
      alert("The total percentage must be equal to 100%");
      return;
    }

    setTosAllocation({
      remembering: tempTos.remembering / 100,
      understanding: tempTos.understanding / 100,
      applying: tempTos.applying / 100,
      analyzing: tempTos.analyzing / 100,
      creating: tempTos.creating / 100,
      evaluating: tempTos.evaluating / 100,
    });
    setOpen(false);
  };

  const reset = () => {
    setTempTos({
      remembering: 0,
      understanding: 0,
      applying: 0,
      analyzing: 0,
      creating: 0,
      evaluating: 0,
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onCancel}
      aria-labelledby="custom-tos-dialog"
      aria-describedby="custom-tos-dialog"
    >
      <DialogTitle id="custom-tos-title">Custom TOS Allocation</DialogTitle>
      <DialogContent>
        <Stack spacing={2} my={1}>
          <FormControl size="small">
            <InputLabel id="remLabel">Remembering</InputLabel>
            <OutlinedInput
              type="number"
              label="Remembering"
              onKeyDown={handleKeyDown}
              value={tempTos.remembering}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              name="remembering"
              endAdornment={<PercentRoundedIcon color="disabled" />}
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel id="undLabel">Understanding</InputLabel>
            <OutlinedInput
              type="number"
              label="Understanding"
              value={tempTos.understanding}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              name="understanding"
              endAdornment={<PercentRoundedIcon color="disabled" />}
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel id="appLabel">Applying</InputLabel>
            <OutlinedInput
              type="number"
              label="Applying"
              value={tempTos.applying}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              name="applying"
              endAdornment={<PercentRoundedIcon color="disabled" />}
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel id="anaLabel">Analyzing</InputLabel>
            <OutlinedInput
              type="number"
              label="Analyzing"
              value={tempTos.analyzing}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              name="analyzing"
              endAdornment={<PercentRoundedIcon color="disabled" />}
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel id="creLabel">Creating</InputLabel>
            <OutlinedInput
              type="number"
              label="Creating"
              value={tempTos.creating}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              name="creating"
              endAdornment={<PercentRoundedIcon color="disabled" />}
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel id="evaLabel">Evaluating</InputLabel>
            <OutlinedInput
              type="number"
              label="Evaluating"
              value={tempTos.evaluating}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              name="evaluating"
              endAdornment={<PercentRoundedIcon color="disabled" />}
            />
          </FormControl>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="body2" color="text.secondary">
              Total: {total}%
            </Typography>
            <Tooltip title="Reset" placement="top" arrow>
              <IconButton color="error" onClick={reset}>
                <RestartAltRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          color="error"
          variant="contained"
          disableElevation
          onClick={onCancel}
        >
          cancel
        </Button>
        <Button
          disableElevation
          variant="contained"
          color="success"
          onClick={confirm}
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomTosDialog;
