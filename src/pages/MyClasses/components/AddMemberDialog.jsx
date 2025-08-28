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
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function AddMemberDialog({ open, setOpen, classId }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [studentToAdd, setStudentToAdd] = useState([]);

  const fileRef = useRef(null);

  const handleImportClick = () => {
    fileRef.current && fileRef.current.click();
  };

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
    // remove student sa add list
    const newList = studentToAdd.filter((_, i) => i !== index);
    setStudentToAdd(newList);
    // add student back to options
    setStudentList([...studentList, data]);
  };

  // for adding student to add list
  const addStudent = (data) => {
    // add student sa to add list
    setStudentToAdd([...studentToAdd, data]);
    // remove sa options
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

  const handleImportCsv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    //  setLoading(true);
    // try {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    // Parse header if present
    const headerCols = lines[0].split(",").map((h) => h.trim().toLowerCase());
    if (headerCols[0] != "student_email") return;
    for (let i = 1; i < lines.length; i++) {
      const element = lines[i];

      // check if existing sa options
      const raw = (element || "")
        .replace(/^\uFEFF/, "") // strip BOM
        .replace(/^"|"$/g, "") // strip surrounding quotes
        .trim()
        .toLowerCase();

      const found = studentList.find(
        (s) => s.email.trim().toLowerCase() === raw
      );

      if (found) {
        addStudent(found);
      }
    }

    if (e.target) e.target.value = null;
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
        <Typography variant="caption" color="textDisabled">
          For bulk adding of members, download csv format{" "}
        </Typography>
        <Link
          component="a"
          href="/bulk_member_format.csv"
          download="bulk_member_format.csv"
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          color="textDisabled"
          sx={{ cursor: "pointer" }}
        >
          here.
        </Link>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Stack direction="row" spacing={2}>
            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={handleImportCsv}
            />
            <Button
              variant="outlined"
              color="success"
              size="small"
              disableElevation
              onClick={handleImportClick}
            >
              import csv
            </Button>
            <Button
              onClick={addConfirm}
              variant="contained"
              disabled={studentToAdd.length == 0}
              disableElevation
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddMemberDialog;
