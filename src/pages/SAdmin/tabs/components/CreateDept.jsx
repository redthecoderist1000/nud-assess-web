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
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

const CreateDept = ({ open, onClose }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sname: "",
    school: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  const [schoolOptions, setSchoolOptions] = useState([]);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        sname: "",
        school: "",
      });
      setLoading(false);
      return;
    }
    fetchSchool();
  }, [open]);

  const fetchSchool = async () => {
    const { data, error } = await supabase
      .from("tbl_school")
      .select("id, name")
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

  const submit = async (e) => {
    e.preventDefault();

    // trim inputs
    formData.name = formData.name.trim();
    formData.sname = formData.sname.trim();

    if (
      formData.name === "" ||
      formData.sname === "" ||
      formData.school === ""
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("tbl_department").insert({
      name: formData.name,
      shorthand_name: formData.sname,
      school_id: formData.school,
    });

    if (error) {
      if (error.code === "23505") {
        setSnackbar({
          open: true,
          message: "Department name or abbreviated name already exists.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Error creating department.",
          severity: "error",
        });
      }
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "Department created successfully.",
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
      aria-labelledby="create-school-title"
      aria-describedby="create-school-description"
    >
      <form onSubmit={submit}>
        <DialogTitle id="create-school-title">
          Create a new Department
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="create-school-description">
              Please enter the details for the new department.
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
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider />

            <Typography variant="caption" color="text.secondary">
              note: Please ensure all information is correct before submitting.
              The school cannot be changed later.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  onClick={(e) => setIsChecked(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Typography>
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

export default CreateDept;
