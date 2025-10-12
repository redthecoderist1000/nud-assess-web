import { useContext, useEffect, useState } from "react";
import { userContext } from "../../../../App";
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
import { supabase } from "../../../../helper/Supabase";

const EditSchool = ({ open, onClose, item }) => {
  const { setSnackbar } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sname: "",
  });

  useEffect(() => {
    if (open && item) {
      setFormData({
        name: item?.school_name || "",
        sname: item?.school_sname || "",
      });
    }
    if (!open) {
      setFormData({
        name: "",
        sname: "",
      });
    }
  }, [open, item]);

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
    // check if values are unchanged
    if (
      formData.name === item?.school_name &&
      formData.sname === item?.school_sname
    ) {
      setSnackbar({
        open: true,
        message: "No changes detected.",
        severity: "info",
      });
      onClose();
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("tbl_school")
      .update({
        name: formData.name,
        shorthand_name: formData.sname,
      })
      .eq("id", item?.school_id);

    if (error) {
      if (error.code === "23505") {
        setSnackbar({
          open: true,
          message: "School with this name already exists.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update school.",
          severity: "error",
        });
      }
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "School updated successfully.",
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
        <DialogTitle id="create-school-title">Edit existing School</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="create-school-description">
              Edit details of <b>{item?.school_name}</b>
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
            Edit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditSchool;
