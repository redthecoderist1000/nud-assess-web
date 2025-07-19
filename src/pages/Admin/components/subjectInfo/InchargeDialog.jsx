import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { supabase } from "../../../../helper/Supabase";

function InchargeDialog(props) {
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
      return;
    }
    fetchData();
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tbl_users")
      .select("*")
      .neq("role", "Student");

    if (error) {
      console.error("Failed to load faculty", error);
      return;
    }
    setOptions(data);
    setLoading(false);
  };

  const confirmIncharge = async () => {
    const { data: inchargeData, error: inchargeErr } = await supabase
      .from("tbl_subject")
      .update({ faculty_incharge: selected.id })
      .eq("id", subjectId)
      .select("*");

    if (inchargeErr) {
      console.log("error incharge:", inchargeErr);
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
              <ListItem onClick={() => {}}>
                {/* <Stack direction="row" spacing={1}> */}
                <ListItemText>
                  {selected.suffix +
                    " " +
                    selected.f_name +
                    " " +
                    selected.l_name}
                </ListItemText>

                {/* </Stack> */}
                <Button
                  size="small"
                  color="error"
                  onClick={() => setSelected(null)}
                >
                  remove
                </Button>
              </ListItem>
            )}
          </List>
        </Card>
        <Input
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
        {loading ? (
          <CircularProgress />
        ) : (
          <List sx={{ width: "100%" }}>
            {facultySearch == ""
              ? options.map((data, index) => {
                  const name =
                    data.suffix + " " + data.f_name + " " + data.l_name;
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setSelected(data)}
                    >
                      <ListItemText primary={name} />
                    </ListItemButton>
                  );
                })
              : visibleOptions.map((data, index) => {
                  const name =
                    data.suffix + " " + data.f_name + " " + data.l_name;
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setSelected(data)}
                    >
                      <ListItemText primary={name} />
                    </ListItemButton>
                  );
                })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          {selected && (
            <Button
              onClick={confirmIncharge}
              color="success"
              variant="contained"
              disableElevation
            >
              Confirm
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default InchargeDialog;
