import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
import * as XLSX from "xlsx";
import CalendarViewMonthRoundedIcon from "@mui/icons-material/CalendarViewMonthRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

const CreateClass = ({ open, setOpen }) => {
  // const { user } = useContext(userContext);
  const { user, setSnackbar } = useContext(userContext);

  const [classData, setClassData] = useState({
    class_name: "",
    desc: "",
    created_by: user.user_id,
  });
  const [loading, setLoading] = useState(false);

  const [memberList, setMemberList] = useState([]);
  const importRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setClassData({
        class_name: "",
        desc: "",
        created_by: user.user_id,
      });
      setMemberList([]);
      setLoading(false);
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // check if existing anme
    const { data: nameCheck, error: checkError } = await supabase
      .from("tbl_class")
      .select("class_name")
      .eq("created_by", user.user_id)
      .like("class_name", classData.class_name + "%");
    if (checkError) {
      setSnackbar({
        open: true,
        message: "Failed to create class. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const baseName = classData.class_name;
    const pattern = new RegExp(`^${baseName}(?:\\(\\d+\\))?$`);

    const filtered = nameCheck
      .map((item) => item.class_name)
      .filter((name) => pattern.test(name));

    const name =
      filtered.length > 0 ? getNextAvailableName(baseName, filtered) : baseName;

    const join_code = generateCode();

    const { data: class_id, error } = await supabase
      .from("tbl_class")
      .insert([{ ...classData, class_name: name, join_code: join_code }])
      .select("id")
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to create class. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (memberList.length > 0) {
      const membersToInsert = memberList.map((member) => ({
        class_id: class_id.id,
        student_id: member.id,
      }));

      const { error: memberError } = await supabase
        .from("tbl_class_members")
        .insert(membersToInsert);

      if (memberError) {
        setSnackbar({
          open: true,
          message: "Class created but failed to add members.",
          severity: "warning",
        });
      }
    }

    setSnackbar({
      open: true,
      message: "Class created successfully!",
      severity: "success",
    });
    // setLoading(false);

    // timeout to show snackbar
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  function getNextAvailableName(baseName, existingNames) {
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
  }

  const generateCode = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleInputClick = () => {
    importRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const emails = await getEmailFromXLS(file);
        const subjectName = await getValueFromCell(file, "Subject Name");
        const section = await getValueFromCell(file, "Section");
        const instructor = await getValueFromCell(file, "Instructor");
        const classListData = {
          subject: subjectName,
          section: section,
          instructor: instructor,
          emails: emails,
        };
        const generatedClassName = generateClassName(classListData);
        setClassData({
          ...classData,
          class_name: generatedClassName,
        });
        await fetchUsers(classListData);
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

  const generateClassName = ({ subject, section, instructor }) => {
    // Extract subject code before the colon
    const subjectCode = subject.split(":")[0].trim();

    // Extract instructor name after the colon
    const namePart = instructor.split(":")[1].trim();

    // Get initials from instructor name
    const initials = namePart
      .split(" ")
      .filter(
        (word) =>
          word.length > 0 && word !== "MR." && word !== "MS." && word !== "MRS."
      )
      .map((word) => word[0].toUpperCase())
      .join("");

    return `${initials}_${subjectCode}_${section}`;
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

  const getValueFromCell = (file, targetValue) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { r: R, c: C };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = worksheet[cellRef];

            if (cell && cell.v === targetValue) {
              const rightCellAddress = XLSX.utils.encode_cell({
                r: R,
                c: C + 1,
              });
              const rightCell = worksheet[rightCellAddress];
              return resolve(rightCell ? rightCell.v : null);
            }
          }
        }

        resolve(null); // Target value not found
      };

      reader.onerror = () => reject("Failed to read file");
      reader.readAsArrayBuffer(file);
    });
  };

  const fetchUsers = async ({ emails }) => {
    // console.log("Fetching users for emails:", emails);
    const { data, error } = await supabase
      .from("tbl_users")
      .select("id, email, f_name, l_name")
      .in("email", emails);

    if (error) {
      // console.error("Error fetching users:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch users from the database.",
        severity: "error",
      });
      return;
    }

    setMemberList(data);
    setSnackbar({
      open: true,
      message: "Users fetched successfully!",
      severity: "success",
    });
  };

  const removeMember = (index) => {
    const updatedList = memberList.filter((_, i) => i !== index);
    setMemberList(updatedList);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Class</DialogTitle>
        <DialogContent>
          <Stack rowGap={2} mt={1}>
            <TextField
              autoFocus
              id="name_input"
              label="Class Name"
              type="text"
              name="class_name"
              size="small"
              fullWidth
              variant="outlined"
              value={classData.class_name}
              onChange={handleInputChange}
              required
            />
            <TextField
              autoFocus
              id="desc_input"
              label="Description (optional)"
              type="text"
              size="small"
              name="desc"
              fullWidth
              variant="outlined"
              value={classData.desc}
              onChange={handleInputChange}
            />
            <Divider>
              <Typography variant="caption" color="textSecondary">
                or
              </Typography>
            </Divider>
            <Stack>
              <Typography variant="caption" color="textSecondary">
                Automatically create class by importing a Classlist from NUIS.
              </Typography>
              <input
                type="file"
                accept=".xls,.xlsx"
                ref={importRef}
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
              {memberList.length > 0 && (
                <>
                  <Typography variant="caption" color="textSecondary">
                    {memberList.length} members will be added to the class.
                  </Typography>
                  <List sx={{ maxHeight: 400, overflow: "auto" }}>
                    {memberList.map((item, index) => (
                      <ListItem
                        key={index}
                        disablePadding
                        dense
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => removeMember(index)}
                          >
                            <HighlightOffRoundedIcon color="error" />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={item.f_name + " " + item.l_name}
                          secondary={item.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        {loading ? (
          <LinearProgress />
        ) : (
          <DialogActions>
            <Stack direction="row" justifyContent="space-between" width="100%">
              <Button size="small" onClick={() => setOpen(false)} color="error">
                Cancel
              </Button>
              <Button
                size="small"
                autoFocus
                disableElevation
                variant="contained"
                type="submit"
                disabled={loading}
                color="success"
              >
                Continue
              </Button>
            </Stack>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};

export default CreateClass;
