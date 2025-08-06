import {
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
import React, { use, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function AddMemberDialog({ open, setOpen, classId }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [studentToAdd, setStudentToAdd] = useState([]);

  const fetchStudents = async () => {
    const curMemRes = await supabase
      .from("tbl_class_members")
      .select("student_id")
      .eq("class_id", classId);

    if (curMemRes.error) {
      console.log("Fail get members:", curMemRes.error);
      return;
    }

    const curMem = curMemRes.data.map((data) => data.student_id);

    const { data, error } = await supabase
      .from("tbl_users")
      .select("*")
      .eq("role", "Student")
      .not("id", "in", `(${curMem.join(",")})`);

    if (error) {
      console.log("Fail get students:", error);
      return;
    }
    setStudentList(data);
  };

  // for removing student in student to add list
  const removeAddStudent = (index, data) => {
    const newList = studentToAdd.filter((_, i) => i !== index);
    setStudentToAdd(newList);
    setStudentList([...studentList, data]);
  };

  // for adding student to add list
  const addStudent = (data) => {
    setStudentToAdd([...studentToAdd, data]);
    const newList = studentList.filter((item) => item.id !== data.id);
    setStudentList(newList);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchStudents();
      setStudentToAdd([]);
      setSearch("");
      setLoading(false);
    }
  }, [open]);

  const filteredStudentList = useMemo(() => {
    if (search.length == 0) {
      return studentList;
    }
    return studentList.filter((data) => {
      const fullName = `${data.suffix} ${data.f_name} ${data.l_name}`;

      const matchFullName = fullName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchEmail = data.email
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchFullName || matchEmail;
    });
  }, [search, studentList]);

  const addConfirm = async () => {
    setLoading(true);
    // generate payload
    const payload = studentToAdd.map((data) => ({
      class_id: classId,
      student_id: data.id,
    }));

    // insert payload to tbl_class_members
    const { data, error } = await supabase
      .from("tbl_class_members")
      .insert(payload);

    if (error) {
      console.log("Fail to add members:", error);
      setLoading(false);
      return;
    }

    setLoading(false);
    // close dialog
    setOpen(false);
  };

  return (
    <Dialog
      sx={{ p: 2 }}
      maxWidth="md"
      fullWidth
      open={open}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Add Member</DialogTitle>
      {/* <Divider /> */}
      <DialogContent>
        {/* <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText> */}

        {studentList.length == 0 && studentToAdd.length == 0 ? (
          <DialogContentText id="noStudent">
            No available student left to add
          </DialogContentText>
        ) : (
          <>
            {studentToAdd.length > 0 && (
              <Card sx={{ mb: 2, p: 2 }} variant="outlined">
                <DialogContentText>Student/s to add:</DialogContentText>
                <List sx={{ width: "100%" }} disablePadding>
                  {studentToAdd.map((data, index) => {
                    return (
                      <ListItem key={index} disablePadding>
                        <ListItemText>
                          {data.suffix} {data.f_name} {data.l_name} (
                          {data.email})
                        </ListItemText>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeAddStudent(index, data)}
                        >
                          remove
                        </Button>
                      </ListItem>
                    );
                  })}
                </List>
              </Card>
            )}
            <TextField
              label="search student"
              type="text"
              size="small"
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
            />
            <List sx={{ width: "100%" }}>
              {filteredStudentList.map((data, index) => {
                return (
                  <ListItemButton key={index} onClick={() => addStudent(data)}>
                    <ListItemText>
                      {data.suffix} {data.f_name} {data.l_name} ({data.email})
                    </ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          </>
        )}
      </DialogContent>
      {/* <Divider /> */}
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={addConfirm}
            variant="contained"
            disabled={studentToAdd.length == 0}
          >
            Add
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddMemberDialog;
