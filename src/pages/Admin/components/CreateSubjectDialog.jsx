import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";

function CreateSubjectDialog({ open, onClose }) {
  const { user, setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [subForm, setSubForm] = useState({});

  const handleSubFormChange = (e) => {
    setSubForm({ ...subForm, [e.target.name]: e.target.value });
  };

  const getNextAvailableName = (baseName, existingNames) => {
    const usedNumbers = new Set();

    existingNames.forEach((name) => {
      const match = name.match(new RegExp(`^${baseName}(?:\\((\\d+)\\))?$`));
      if (match) {
        const num = match[1] ? parseInt(match[1]) : 0;
        usedNumbers.add(num);
      }
    });

    // Find the smallest unused number starting from 0
    let nextNum = 0;
    while (usedNumbers.has(nextNum)) {
      nextNum++;
    }

    return nextNum === 0 ? baseName : `${baseName}(${nextNum})`;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    // check fr similar names
    const { data: nameCheck, error: checkError } = await supabase
      .from("tbl_subject")
      .select("name")
      .eq("department_id", user.department_id)
      .like("name", subForm.name + "%");
    if (checkError) {
      setSnackbar({
        open: true,
        message: "Failed to create subject. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const baseName = subForm.name;
    const pattern = new RegExp(`^${baseName}(?:\\(\\d+\\))?$`);

    const filtered = nameCheck
      .map((item) => item.name)
      .filter((name) => pattern.test(name));

    const name =
      filtered.length > 0 ? getNextAvailableName(baseName, filtered) : baseName;

    const { data: subjectData, error } = await supabase
      .from("tbl_subject")
      .insert({
        name: name,
        subject_code: subForm.subject_code,
        department_id: user.department_id,
      })
      .select("*")
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Error creating subject. Please try again.",
        severity: "error",
      });
      onClose();
      setLoading(false);
      setSubForm({});
      return;
    }

    // assign subject to program
    const { data: programData } = await supabase
      .from("tbl_program")
      .select("id")
      .eq("program_chair", user.user_id)
      .single();

    const { data: programSubjectData } = await supabase
      .from("tbl_program_subject")
      .insert({
        program_id: programData.id,
        subject_id: subjectData.id,
      });
    setSnackbar({
      open: true,
      message: "Subject created successfully",
      severity: "success",
    });
    onClose();
    setLoading(false);
    setSubForm({});
  };

  useState(() => {
    if (!open) {
      setSubForm({});
      setLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <form onSubmit={submitForm}>
        <DialogTitle>Add subject</DialogTitle>
        <DialogContent>
          <DialogContentText>Add subject into your program?</DialogContentText>
          <Stack direction="column" gap={1}>
            <TextField
              required
              id="subject_name"
              size="small"
              label="Subject Name"
              name="name"
              onChange={handleSubFormChange}
            />
            <TextField
              required
              id="subject_code"
              name="subject_code"
              label="Subject Code"
              size="small"
              onChange={handleSubFormChange}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" width="100%" justifyContent="space-between">
            <Button
              onClick={onClose}
              color="error"
              size="small"
              loading={loading}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              size="small"
              type="submit"
              color="success"
              variant="contained"
              loading={loading}
            >
              Confirm
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateSubjectDialog;
