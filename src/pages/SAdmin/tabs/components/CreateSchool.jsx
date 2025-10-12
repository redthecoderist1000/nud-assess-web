import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

const CreateSchool = ({ open, onClose }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sname: "",
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        sname: "",
      });
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();

    // trim inputs
    formData.name = formData.name.trim();
    formData.sname = formData.sname.trim();
    if (formData.name === "" || formData.sname === "") {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("tbl_school").insert({
      name: formData.name,
      shorthand_name: formData.sname,
    });

    if (error) {
      if (error.code === "23505") {
        setSnackbar({
          open: true,
          message: "School with this name or short name already exists.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to create new school.",
          severity: "error",
        });
      }
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "New school created successfully.",
      severity: "success",
    });
    setLoading(false);
    onClose();
  };

  //   const titleCase = (str) => {
  //     return str
  //       .toLowerCase()
  //       .split(" ")
  //       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //       .join(" ");
  //   };

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
        <DialogTitle id="create-school-title">Create a new School</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="create-school-description">
              Please enter the details for the new school.
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
              label="Short Hand Name"
              value={formData.sname}
              onChange={(e) =>
                setFormData({ ...formData, sname: e.target.value })
              }
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
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSchool;
