import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

const EditProgram = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sname: "",
    chair: "",
  });
  const [chairOptions, setChairOptions] = useState([]);

  useEffect(() => {
    if (open && item) {
      fetchChairOptions();

      if (item.prog_chair_id) {
        setChairOptions((prev) => [
          ...prev,
          {
            user_id: item.prog_chair_id,
            name: item.prog_chair,
            email: item.prog_chair_email,
          },
        ]);
      }
      setFormData({
        name: item.prog_name,
        sname: item.prog_sname,
        chair: item.prog_chair_id || "",
      });
    }

    if (!open) {
      setFormData({
        name: "",
        sname: "",
        chair: "",
      });
      setChairOptions([]);
      setLoading(false);
    }
  }, [open, item]);

  const submit = async (e) => {
    e.preventDefault();

    // trim inputs
    formData.name = formData.name.trim();
    formData.sname = formData.sname.trim();

    if (!formData.name || !formData.sname) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    //  check if there are changes
    console.log("formdata", formData);
    console.log("item", item);

    // prog_id: 'cb617e1d-6d82-4b05-93a9-f86fce1eb199',
    // prog_name:
    //   'Bachelor of Science in Computer Science with Specialization in Machine Learning',
    // prog_sname: 'BSCS-ML',
    // prog_chair_id: null,

    // name:
    //   'Bachelor of Science in Computer Science with Specialization in Machine Learning',
    // sname: 'BSCS-ML',
    // chair: ''

    const oldChair = item.prog_chair_id || "";
    if (
      formData.name === item.prog_name &&
      formData.sname === item.prog_sname &&
      formData.chair === oldChair
    ) {
      setSnackbar({
        open: true,
        message: "No changes made.",
        severity: "info",
      });
      onClose();
      return;
    }

    setLoading(true);

    // update program
    console.log("Updating program with data:", formData);
    const { error: progErr } = await supabase
      .from("tbl_program")
      .update({
        name: formData.name,
        shorthand_name: formData.sname,
        program_chair: formData.chair || null,
      })
      .eq("id", item.prog_id);

    if (progErr) {
      setSnackbar({
        open: true,
        message: "Error updating program. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // demote old chair if changed
    console.log("demote old chair", item.prog_chair_id);
    if (formData.chair !== item.prog_chair_id && item.prog_chair_id) {
      const { error: demoteErr } = await supabase
        .from("tbl_users")
        .update({ role: "Faculty" })
        .eq("id", item.prog_chair_id);

      if (demoteErr) {
        setSnackbar({
          open: true,
          message: "Error updating program chair. Please try again.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
    }

    // promote new chair if changed
    console.log("Promote new chair:", formData.chair);
    if (formData.chair !== item.prog_chair_id && formData.chair) {
      const { error: promoteErr } = await supabase
        .from("tbl_users")
        .update({ role: "Admin" })
        .eq("id", formData.chair);
      if (promoteErr) {
        setSnackbar({
          open: true,
          message: "Error updating program chair. Please try again.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
    }

    setSnackbar({
      open: true,
      message: "Program updated successfully.",
      severity: "success",
    });
    setLoading(false);
    onClose();
  };

  const fetchChairOptions = async () => {
    // console.log(item);
    const { data, error } = await supabase
      .from("vw_chaircandidates")
      .select("*")
      .eq("department_id", item?.dept_id)
      .order("name", { ascending: true });
    if (error) {
      console.error("Error fetching chair options:", error);
    } else {
      // console.log(data);
      setChairOptions((prev) => [...prev, ...data]);
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="edit-program-title"
      aria-describedby="edit-program-description"
    >
      <form onSubmit={submit}>
        <DialogTitle id="edit-program-title">Edit existing Program</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="edit-program-description">
              Edit details of <b>{item?.prog_name}</b>
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

export default EditProgram;
