import {
  Alert,
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
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import * as XLSX from "xlsx";

import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CalendarViewMonthRoundedIcon from "@mui/icons-material/CalendarViewMonthRounded";
import { userContext } from "../../../App";

function AddMemberDialog({ open, setOpen, classId }) {
  const { setSnackbar } = useContext(userContext);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [studentToAdd, setStudentToAdd] = useState([]);

  const fileRef = useRef(null);

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
    setStudentToAdd((prev) => [...prev, data]);
    // remove sa options
    setStudentList((prevList) =>
      prevList.filter((item) => item.id !== data.id)
    );
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

    // setLoading(false);
    // close dialog
    setOpen(false);
  };

  // new import
  const handleInputClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const emails = await getEmailFromXLS(file);
        const found = studentList.filter((s) =>
          emails.includes(s.email.trim())
        );
        if (found.length === 0) {
          setSnackbar({
            open: true,
            message: "No students left to add.",
            severity: "warning",
          });
          return;
        }

        // add students
        setStudentToAdd((prev) => [...prev, ...found]);
        setStudentList((prevList) =>
          prevList.filter((item) => !found.some((f) => f.id === item.id))
        );

        setSnackbar({
          open: true,
          message: `Added ${found.length} student(s).`,
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error,
          severity: "error",
        });
      }
    }
    e.target.value = null; // Reset file input
  };

  const getEmailFromXLS = (file) => {
    const columnName = "Official Email";
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        let columnIndex = -1;
        let startRow = -1;

        for (let i = 0; i < sheetData.length; i++) {
          const row = sheetData[i];
          columnIndex = row.indexOf(columnName);
          if (columnIndex !== -1) {
            startRow = i + 1;
            break;
          }
        }

        if (columnIndex === -1) {
          return reject(`Use a valid NUIS classlist file.`); // Column not found
        }

        const filteredValues = [];

        for (let i = startRow; i < sheetData.length; i++) {
          const row = sheetData[i];
          const value = row[columnIndex];
          const nextValue = row[columnIndex + 2];

          if (nextValue == "Enrolled") {
            filteredValues.push(value);
          }
        }

        resolve(filteredValues);
      };

      reader.onerror = () => reject("Failed to read file");
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Dialog
      sx={{ p: 2 }}
      maxWidth="md"
      fullWidth
      open={open}
      onClose={() => setOpen(false)}
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
                <DialogContentText>
                  {studentToAdd.length} student/s to add:
                </DialogContentText>
                <List
                  sx={{ width: "100%", maxHeight: 200, overflow: "auto" }}
                  disablePadding
                >
                  {studentToAdd.map((data, index) => {
                    return (
                      <ListItem
                        key={index}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="remove"
                            onClick={() => removeAddStudent(index, data)}
                          >
                            <HighlightOffRoundedIcon color="error" />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${data.suffix} ${data.f_name} ${data.l_name}`}
                          secondary={data.email}
                        />
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
            <List sx={{ width: "100%", maxHeight: 300, overflow: "auto" }}>
              {filteredStudentList.map((data, index) => {
                return (
                  <ListItemButton key={index} onClick={() => addStudent(data)}>
                    <ListItemText
                      primary={`${data.f_name} ${data.l_name}`}
                      secondary={data.email}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </>
        )}
        <Divider>
          <Typography variant="caption" color="textDisabled">
            or
          </Typography>
        </Divider>
        <Stack>
          <Typography variant="caption" color="textSecondary">
            Automatically add students by importing a Classlist from NUIS.
          </Typography>
          <input
            type="file"
            accept=".xls,.xlsx"
            ref={fileRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            size="small"
            variant="outlined"
            color="success"
            fullWidth={false}
            onClick={handleInputClick}
            startIcon={<CalendarViewMonthRoundedIcon />}
          >
            Import Classlist
          </Button>
        </Stack>
        {/* <Link
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
        </Link> */}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Stack direction="row" spacing={2}>
            {/* hidden file input */}
            {/* <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={handleImportCsv}
            /> */}
            {/* <Button
              variant="outlined"
              color="success"
              size="small"
              disableElevation
              onClick={handleImportClick}
            >
              import csv
            </Button> */}
            <Button
              onClick={addConfirm}
              variant="contained"
              color="success"
              disabled={studentToAdd.length == 0}
              loading={loading}
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
