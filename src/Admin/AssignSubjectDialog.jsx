import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../helper/Supabase";
import { data } from "react-router-dom";

function AssignSubjectDialog({ open, setOpen, selectedFaculty }) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [subjectOption, setSubjectOption] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("vw_subjectfaculty")
      .select("*");

    if (error) {
      console.log("Error fetching subjects:", error);
      return;
    }

    const filteredData = data.filter(
      (item) =>
        item.faculty_id === null || !item.faculty_id.includes(selectedFaculty)
    );

    setSubjectOption(filteredData);
    // console.log("Fetched subjects:", filteredData);
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

  const visibleSubject = useMemo(() => {
    if (search.length == 0) {
      return subjectOption;
    }

    return subjectOption.filter((subject) => {
      const matchName = subject.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchCode = subject.subject_code
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchName || matchCode;
    });
  }, [search, subjectOption]);

  const addSelected = (sub) => {
    setSearch("");
    // add to selected subject
    setSelectedSubject([...selectedSubject, sub]);
    // remove from subject option
    const newSubjectOption = subjectOption.filter(
      (item) => item.prog_sub_id !== sub.prog_sub_id
    );
    setSubjectOption(newSubjectOption);
  };

  const removeSelected = (index) => {
    const removedSubject = selectedSubject[index];
    // add back to subject option
    setSubjectOption([...subjectOption, removedSubject]);
    // remove from selected subject
    const newSelected = selectedSubject.filter((_, i) => i !== index);
    setSelectedSubject(newSelected);
  };

  const confirmAssign = async () => {
    setLoading(true);
    // generate payload
    const payload = selectedSubject.map((data) => ({
      faculty_id: selectedFaculty,
      program_subject_id: data.prog_sub_id,
    }));

    // console.log("Payload to insert:", payload);

    // insert payload to tbl_subject_faculty
    const { data, error } = await supabase
      .from("tbl_faculty_subject")
      .insert(payload);

    if (error) {
      console.log("Failed to assign subjects:", error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>Assign subject</DialogTitle>
      <Divider />
      <DialogContent>
        <Card sx={{ mb: 2, p: 2 }}>
          <DialogContentText>Selected subjects:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {selectedSubject.map((data, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText>
                    {data.name} ({data.subject_code})
                  </ListItemText>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeSelected(index)}
                  >
                    remove
                  </Button>
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
          {visibleSubject.map((data, index) => {
            return (
              <ListItemButton key={index} onClick={() => addSelected(data)}>
                <ListItemText>
                  {data.name} ({data.subject_code})
                </ListItemText>
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
      <Divider />

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
            onClick={confirmAssign}
            loading={loading}
            disabled={selectedSubject.length == 0}
          >
            Continue
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AssignSubjectDialog;
