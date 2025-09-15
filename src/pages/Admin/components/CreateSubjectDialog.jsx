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
  const { user } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [subForm, setSubForm] = useState({});

  const handleSubFormChange = (e) => {
    setSubForm({ ...subForm, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const { data: subjectData, error } = await supabase
      .from("tbl_subject")
      .insert({
        name: subForm.name,
        subject_code: subForm.subject_code,
        department_id: user.department_id,
      })
      .select("*")
      .single();

    if (error) {
      console.log("Error inserting data:", error);
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
  };

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
        {loading ? (
          <CircularProgress />
        ) : (
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="space-between">
              <Button onClick={onClose} color="error" size="small">
                Cancel
              </Button>
              <Button
                disableElevation
                size="small"
                type="submit"
                color="success"
                variant="contained"
              >
                Confirm
              </Button>
            </Stack>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default CreateSubjectDialog;
