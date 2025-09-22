import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

function RemoveSubjectDialog({ open, setOpen, selectedFaculty, fetchData }) {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [subjectOption, setSubjectOption] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);

  const addSelected = (data) => {
    if (selectedSubject.some((item) => item.fac_prog_id === data.fac_prog_id)) {
      return; // Prevent adding duplicates
    }
    setSelectedSubject([...selectedSubject, data]);

    const newSubjectOption = subjectOption.filter(
      (item) => item.fac_prog_id !== data.fac_prog_id
    );

    setSubjectOption(newSubjectOption); // Update subject options

    // Clear search input
    setSearch(""); // Clear search after adding
  };

  const removeSelected = (index) => {
    const removedSubject = selectedSubject[index];
    // add back to subject option
    setSubjectOption([...subjectOption, removedSubject]);
    // remove from selected subject
    const newSelected = selectedSubject.filter((_, i) => i !== index);
    setSelectedSubject(newSelected);
  };

  const confirmRemove = async () => {
    setLoading(true);

    // generate the list of subject IDs to remove
    const idList = selectedSubject.map((item) => item.fac_prog_id);

    const { data, error } = await supabase
      .from("tbl_faculty_subject")
      .delete()
      .in("id", idList);

    if (error) {
      setSnackbar({
        message: "Failed to remove subjects. Please try again.",
        severity: "error",
        open: true,
      });
      setLoading(false);
      return;
    }
    setOpen(false);
    fetchData();
    setSnackbar({
      message: "Subjects removed successfully",
      severity: "success",
      open: true,
    });

    setSelectedSubject([]);
    setSearch("");
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("vs_assignedperuser")
      .select("*")
      .eq("faculty_id", selectedFaculty);

    if (error) {
      console.log("Error fetching subjects:", error);
      return;
    }
    setSubjectOption(data);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    setLoading(false);
    setSearch("");
    setSelectedSubject([]);
    fetchSubjects();
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>Remove subject</DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2, p: 2 }} variant="outlined">
          <DialogContentText>Selected subjects:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {selectedSubject.map((data, index) => {
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      onClick={() => removeSelected(index)}
                      color="error"
                      size="small"
                    >
                      <HighlightOffRoundedIcon fontSize="20" />
                    </IconButton>
                  }
                >
                  <ListItemText>
                    {data.subject_name} ({data.subject_code})
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Card>
        <TextField
          size="small"
          fullWidth
          label="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <List>
          {subjectOption.map((data, index) => {
            return (
              <ListItemButton key={index} onClick={() => addSelected(data)}>
                <ListItemText>
                  {data.subject_name} ({data.subject_code})
                </ListItemText>
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button
            onClick={() => setOpen(false)}
            color="error"
            loading={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmRemove}
            loading={loading}
            disabled={selectedSubject.length == 0}
            disableElevation
          >
            Remove
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveSubjectDialog;
