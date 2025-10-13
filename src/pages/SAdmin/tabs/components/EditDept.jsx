import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

const EditDept = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sname: "",
    school: "",
  });
  const [schoolOptions, setSchoolOptions] = useState([]);

  useEffect(() => {
    if (open && item) {
      setFormData({
        name: item.dept_name,
        sname: item.dept_sname,
        school: item.school_id,
      });
      //   fetchSchool();
    }
    if (!open) {
      setFormData({
        name: "",
        sname: "",
        school: "",
      });
      setLoading(false);
    }
  }, [open, item]);

  const fetchSchool = async () => {
    const { data, error } = await supabase
      .from("tbl_school")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching schools. Try again later.",
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

    if (formData.name === "" || formData.sname === "") {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "warning",
      });
      return;
    }

    // check if name or sname is changed
    if (
      formData.name === item.dept_name &&
      formData.sname === item.dept_sname
    ) {
      setSnackbar({
        open: true,
        message: "No changes detected.",
        severity: "info",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("tbl_department")
      .update({
        name: formData.name,
        shorthand_name: formData.sname,
      })
      .eq("id", item.dept_id);

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
          message: "Error updating department. Try again later.",
          severity: "error",
        });
      }
      setLoading(false);
      return;
    }
    setSnackbar({
      open: true,
      message: "Department updated successfully.",
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
      aria-labelledby="edit-dept-title"
      aria-describedby="edit-dept-description"
    >
      <form onSubmit={submit}>
        <DialogTitle id="edit-dept-title">Edit existing Department</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="edit-dept-description">
              Edit details of <b>{item?.dept_name}</b>
            </DialogContentText>
            <TextField
              required
              type="text"
              size="small"
              label="School Name"
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
            {/* <FormControl required fullWidth size="small">
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
            </FormControl> */}
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
            autoFocus
          >
            Edit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditDept;
