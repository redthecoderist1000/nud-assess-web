import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Stack,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { supabase } from "../../../../helper/Supabase";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { userContext } from "../../../../App";

function InchargeDialog(props) {
  const { setSnackbar } = useContext(userContext);
  const { open, setOpen, subjectId } = props;

  const [options, setOptions] = useState([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleFacultySearch = (e) => setFacultySearch(e.target.value);
  const clearFacultySearch = () => setFacultySearch("");

  const visibleOptions = useMemo(
    () =>
      options.filter((data) => {
        const matchFname = data.f_name
          .toLowerCase()
          .includes(facultySearch.toLowerCase());

        const matchLname = data.l_name
          .toLowerCase()
          .includes(facultySearch.toLowerCase());

        return matchFname || matchLname;
      }),
    [facultySearch]
  );

  useEffect(() => {
    if (!open) {
      setFacultySearch("");
      setSelected(null);
      setLoading(false);
      return;
    }
    fetchData();
  }, [open]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_users")
      .select("*")
      .neq("role", "Student");

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching faculty data",
        severity: "error",
      });
      setOpen(false);
      return;
    }
    setOptions(data);
  };

  const confirmIncharge = async () => {
    setLoading(true);

    const { data: inchargeData, error: inchargeErr } = await supabase
      .from("tbl_subject")
      .update({ faculty_incharge: selected.id })
      .eq("id", subjectId)
      .select("*");

    if (inchargeErr) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Error assigning faculty incharge. Please try again.",
        severity: "error",
      });
      return;
    }

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="edit-dialog"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="edit-dialog-title">Assign faculty incharge</DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2, p: 2 }} variant="outlined">
          <DialogContentText>Selected faculty:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {selected && (
              <ListItem
                secondaryAction={
                  <IconButton size="small" onClick={() => setSelected(null)}>
                    <HighlightOffRoundedIcon color="error" fontSize="20" />
                  </IconButton>
                }
              >
                {/* <Stack direction="row" spacing={1}> */}
                <ListItemText>
                  {selected.suffix +
                    " " +
                    selected.f_name +
                    " " +
                    selected.l_name}
                </ListItemText>
              </ListItem>
            )}
          </List>
        </Card>
        <OutlinedInput
          size="small"
          id="search_faculty_input"
          placeholder="Search Faculty"
          value={facultySearch}
          sx={{ my: 2, width: "100%" }}
          onChange={handleFacultySearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            facultySearch == "" ? null : (
              <InputAdornment position="end" onClick={clearFacultySearch}>
                <CloseIcon />
              </InputAdornment>
            )
          }
        />

        <List sx={{ width: "100%", maxHeight: 300, overflowY: "auto" }}>
          {facultySearch == ""
            ? options.map((data, index) => {
                const name =
                  data.suffix + " " + data.f_name + " " + data.l_name;
                return (
                  <ListItemButton key={index} onClick={() => setSelected(data)}>
                    <ListItemText primary={name} />
                  </ListItemButton>
                );
              })
            : visibleOptions.map((data, index) => {
                const name =
                  data.suffix + " " + data.f_name + " " + data.l_name;
                return (
                  <ListItemButton key={index} onClick={() => setSelected(data)}>
                    <ListItemText primary={name} />
                  </ListItemButton>
                );
              })}
        </List>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmIncharge}
            color="success"
            variant="contained"
            disabled={selected == null || loading}
            loading={loading}
            disableElevation
          >
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default InchargeDialog;
