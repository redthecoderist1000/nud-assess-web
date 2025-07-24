import {
  Button,
  Card,
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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../helper/Supabase";

function RemoveAssignedDialog(props) {
  const { open, setOpen, progSubId } = props;

  const [facultyList, setFacultyList] = useState([]);
  const [facultyOption, setFacultyOption] = useState([]);
  const [search, setSearch] = useState("");

  const onClose = () => {
    setOpen(false);
    setFacultyList([]);
    setFacultyOption([]);
    setSearch("");
  };

  const removeList = (id) => {
    const newList = facultyList.filter((d) => (d.id == id ? false : true));

    setFacultyList(newList);
  };

  const visibleOptions = useMemo(
    () =>
      facultyOption
        .filter((data) => {
          const name = `${data.tbl_users.suffix} ${data.tbl_users.f_name} ${data.tbl_users.m_name} ${data.tbl_users.l_name}`;

          const matchName = name.toLowerCase().includes(search.toLowerCase());

          return matchName;
        })
        .filter((data) => {
          const existList = facultyList.find((d) => d.id == data.id)
            ? false
            : true;
          return existList;
        }),
    [search, facultyList]
  );

  const confirmRemove = async () => {
    const payload = facultyList.map((d) => d.id);

    const { error } = await supabase
      .from("tbl_faculty_subject")
      .delete()
      .in("id", payload);

    if (error) {
      console.log("error remove assigned:", error);
      return;
    }

    onClose();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchData();
  }, [open]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_faculty_subject")
      .select(
        "id, tbl_users(suffix, f_name, m_name, l_name), program_subject_id"
      )
      .eq("program_subject_id", progSubId);

    if (error) {
      console.log("error fetching faculty:", error);
      return;
    }
    setFacultyOption(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Remove assigned faculty to subject</DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2, p: 2 }} variant="outlined">
          <DialogContentText>Selected faculty:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {facultyList.map((data, index) => {
              const name = `${data.tbl_users.suffix} ${data.tbl_users.f_name} ${data.tbl_users.m_name} ${data.tbl_users.l_name}`;

              return (
                <ListItem key={index}>
                  <ListItemText>{name}</ListItemText>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeList(data.id)}
                  >
                    undo
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Card>
        <Input
          placeholder="Search Faculty"
          value={search}
          sx={{ my: 2, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            search == "" ? null : (
              <InputAdornment position="end" onClick={() => setSearch("")}>
                <CloseIcon />
              </InputAdornment>
            )
          }
        />
        {facultyOption.length != 0 ? (
          <List sx={{ width: "100%" }}>
            {search == "" && facultyList.length == 0
              ? facultyOption.map((data, index) => {
                  const name = `${data.tbl_users.suffix} ${data.tbl_users.f_name} ${data.tbl_users.m_name} ${data.tbl_users.l_name}`;

                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setFacultyList([...facultyList, data])}
                    >
                      <ListItemText primary={name} />
                    </ListItemButton>
                  );
                })
              : visibleOptions.map((data, index) => {
                  const name = `${data.tbl_users.suffix} ${data.tbl_users.f_name} ${data.tbl_users.m_name} ${data.tbl_users.l_name}`;

                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setFacultyList([...facultyList, data])}
                    >
                      <ListItemText primary={name} />
                    </ListItemButton>
                  );
                })}
          </List>
        ) : (
          <Typography align="center" variant="body2" color="textDisabled">
            No faculty available to remove.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Button size="small" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="small"
            onClick={confirmRemove}
            color="error"
            variant="contained"
            disableElevation
            disabled={facultyList.length == 0}
          >
            Remove
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveAssignedDialog;
