import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { act, useContext, useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
import GeneralDialog from "../../../components/elements/GeneralDialog";

function CreateSubjectDialog({ open, onClose }) {
  const { user, setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [subForm, setSubForm] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
    actions: null,
  });
  const [deptOptions, setDeptOptions] = useState([]);

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

  const validate = async (e) => {
    e.preventDefault();
    setLoading(true);
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

    const finalName =
      filtered.length > 0 ? getNextAvailableName(baseName, filtered) : baseName;

    if (filtered.length > 0) {
      setDialog({
        open: true,
        title: "Subject Already Exists",
        content: `A subject with the name "${baseName}" already exists. Do you want to create "${finalName}" instead?`,
        action: () => submitForm(finalName),
      });
      return;
    }
    await submitForm(finalName);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // setDialog({ open: false, title: "", content: "", actions: null });

    setLoading(true);
    const { data: subjectData, error } = await supabase
      .from("tbl_subject")
      .insert({
        name: subForm.name,
        subject_code: subForm.subject_code,
        department_id: user.department_id,
        sub_department: subForm.sub_department || null,
      })
      .select("*")
      .single();

    if (error) {
      // console.log(error);

      if (error.code === "23505") {
        setSnackbar({
          open: true,
          message:
            "Subject name or code already exists. Please choose a different identifier.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Error creating subject. Please try again.",
          severity: "error",
        });
      }
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

  useEffect(() => {
    if (!open) {
      setSubForm({});
      setLoading(false);
      return;
    }
    fetchDeptOptions();
  }, [open]);

  const fetchDeptOptions = async () => {
    const { data: deptData, error } = await supabase
      .from("tbl_department")
      .select("id, name, shorthand_name")
      .neq("id", user.department_id)
      .order("name", { ascending: true });

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch departments. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setDeptOptions(deptData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <form onSubmit={submitForm}>
        <DialogTitle>Add subject</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <DialogContentText>
              Add subject into your program?
            </DialogContentText>
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
            <Divider />
            <Typography
              variant="caption"
              color="textDisabled"
              textAlign={"justify"}
            >
              Assign to Sub Department (optional). Allow this subject to be
              managed in other department.
            </Typography>
            <FormControl size="small" fullWidth>
              <InputLabel id="department_label">Sub Department</InputLabel>
              <Select
                label="Sub Department"
                labelId="department_label"
                defaultValue=""
                value={subForm.sub_department}
                onChange={handleSubFormChange}
                name="sub_department"
              >
                <MenuItem value={""} disabled>
                  Select Department
                </MenuItem>
                {deptOptions.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.shorthand_name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onClick={(e) => setIsChecked(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Typography variant="body2">
                  I confirm that the information provided is accurate.
                </Typography>
              }
              sx={{ color: "text.secondary", mt: 1, fontSize: 10 }}
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
              disabled={!isChecked}
            >
              Confirm
            </Button>
          </Stack>
        </DialogActions>
      </form>
      <GeneralDialog dialog={dialog} setDialog={setDialog} />
    </Dialog>
  );
}

export default CreateSubjectDialog;
