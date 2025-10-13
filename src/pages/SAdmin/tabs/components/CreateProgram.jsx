import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../../App";
import { supabase } from "../../../../helper/Supabase";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const CreateProgram = ({ open, onClose }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sname: "",
    school: "",
    dept: "",
    chair: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [chairOptions, setChairOptions] = useState([]);

  const fetchSchool = async () => {
    const { data, error } = await supabase
      .from("tbl_school")
      .select("id, name, shorthand_name")
      .order("name", { ascending: true });
    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching schools",
        severity: "error",
      });
      return;
    }
    setSchoolOptions(data);
  };

  const fetchDept = async () => {
    const { data, error } = await supabase
      .from("tbl_department")
      .select("id, name")
      .eq("school_id", formData.school)
      .order("name", { ascending: true });
    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching departments",
        severity: "error",
      });
      return;
    }
    setDeptOptions(data);
  };

  const fetchChair = async () => {
    const { data, error } = await supabase
      .from("vw_chaircandidates")
      .select("*")
      .eq("department_id", formData.dept)
      .order("name", { ascending: true });
    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching program chairs",
        severity: "error",
      });
      return;
    }
    setChairOptions(data);
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        sname: "",
        school: "",
        dept: "",
      });
      setLoading(false);
      return;
    }
    fetchSchool();
  }, [open]);

  useEffect(() => {
    setFormData({ ...formData, dept: "" });
    if (formData.school == "") return;
    fetchDept();
  }, [formData.school]);

  useEffect(() => {
    setFormData({ ...formData, chair: "" });
    if (formData.dept == "") return;
    fetchChair();
  }, [formData.dept]);

  const submit = async (e) => {
    e.preventDefault();

    // trim inputs
    formData.name = formData.name.trim();
    formData.sname = formData.sname.trim();

    if (
      formData.name === "" ||
      formData.sname === "" ||
      formData.school === "" ||
      formData.dept === ""
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("tbl_program").insert({
      name: formData.name,
      shorthand_name: formData.sname,
      department_id: formData.dept,
      program_chair: formData.chair == "" ? null : formData.chair,
    });

    if (error) {
      setSnackbar({
        open: true,
        message: "Error creating program",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "Program created successfully",
      severity: "success",
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="create-program-title"
      aria-describedby="create-program-description"
    >
      <form onSubmit={submit}>
        <DialogTitle id="create-program-title">
          Create a new Program
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="create-program-description">
              Please enter the details for the new program.
            </DialogContentText>
            <TextField
              required
              type="text"
              size="small"
              label="Department Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              size="small"
              required
              type="text"
              label="Abbreviated Name"
              value={formData.sname}
              onChange={(e) =>
                setFormData({ ...formData, sname: e.target.value })
              }
            />
            <FormControl required fullWidth size="small">
              <InputLabel>School</InputLabel>
              <Select
                label="School"
                value={formData.school}
                onChange={(e) =>
                  setFormData({ ...formData, school: e.target.value })
                }
              >
                {schoolOptions.map((school, index) => (
                  <MenuItem key={index} value={school.id} dense>
                    <ListItemText
                      primary={school.shorthand_name}
                      secondary={school.name}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              required
              fullWidth
              size="small"
              disabled={formData.school == ""}
            >
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                value={formData.dept}
                onChange={(e) =>
                  setFormData({ ...formData, dept: e.target.value })
                }
              >
                {deptOptions.map((dept, index) => (
                  <MenuItem key={index} value={dept.id} dense>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Program Chair</InputLabel>
              <Select
                label="Program Chair"
                value={formData.chair}
                onChange={(e) =>
                  setFormData({ ...formData, chair: e.target.value })
                }
              >
                {chairOptions.map((chair, index) => (
                  <MenuItem key={index} value={chair.user_id} dense>
                    <ListItemText
                      primary={chair.name}
                      secondary={chair.email}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider />

            <Typography variant="caption" color="text.secondary">
              note: The school and department cannot be changed later. Please
              ensure all information is correct before submitting.
            </Typography>
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
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button color="error" size="small" disableElevation onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="success"
            variant="contained"
            disableElevation
            size="small"
            loading={loading}
            disabled={!isChecked}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProgram;
