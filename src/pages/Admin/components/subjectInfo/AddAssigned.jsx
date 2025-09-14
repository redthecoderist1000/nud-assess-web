import {
  Button,
  Card,
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
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";

function AddAssigned(props) {
  const { setSnackbar } = useContext(userContext);

  const { open, setOpen, subjectId, departmentId, progSubId } = props;

  const [facultyList, setFacultyList] = useState([]);
  const [search, setSearch] = useState("");
  const [facultyOption, setFacultyOption] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // get assigned
    const { data: assignedData, error: assignedErr } = await supabase
      .from("vw_facultysubject")
      .select("id")
      .eq("subject_id", subjectId);

    if (assignedErr) {
      setSnackbar({
        open: true,
        message: "Error fetching assigned faculty",
        severity: "error",
      });
      onClose();
      return;
    }

    const assignedIds = assignedData.map((d) => d.id);

    const { data: facultyData, error: facultyErr } = await supabase
      .from("tbl_users")
      .select("*")
      .eq("department_id", departmentId)
      .not("id", "in", `(${assignedIds.join(",")})`);

    if (facultyErr) {
      console.log("error fetching faculty:", facultyErr);
      return;
    }

    // console.log("faculty:", facultyData);
    setFacultyOption(facultyData);
    // get other fac
  };

  const removeList = (id) => {
    const newList = facultyList.filter((d) => (d.id == id ? false : true));

    setFacultyList(newList);
  };

  useEffect(() => {
    if (!open) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [open]);

  const visibleOptions = useMemo(
    () =>
      facultyOption
        .filter((data) => {
          const name = `${data.suffix} ${data.f_name} ${data.m_name} ${data.l_name}`;

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

  const confirmAssign = async () => {
    const payload = facultyList.map((d) => {
      return {
        faculty_id: d.id,
        program_subject_id: progSubId,
      };
    });

    setLoading(true);
    const { error } = await supabase
      .from("tbl_faculty_subject")
      .insert(payload);

    if (error) {
      setSnackbar({
        open: true,
        message: "Error assigning faculty. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    onClose();
  };

  const onClose = () => {
    setOpen(false);
    setFacultyList([]);
    setSearch("");
    setFacultyOption([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Assign faculty to subject</DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2, p: 2 }} variant="outlined">
          <DialogContentText>Selected faculty:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {facultyList.map((data, index) => {
              const name = `${data.suffix} ${data.f_name} ${data.m_name} ${data.l_name}`;

              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      size="small"
                      onClick={() => removeList(data.id)}
                    >
                      <HighlightOffRoundedIcon color="error" fontSize="20" />
                    </IconButton>
                  }
                >
                  <ListItemText>{name}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Card>
        <OutlinedInput
          size="small"
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
          <List sx={{ width: "100%", maxHeight: 300, overflowY: "auto" }}>
            {search == "" && facultyList.length == 0
              ? facultyOption.map((data, index) => {
                  const name = `${data.suffix} ${data.f_name} ${data.m_name} ${data.l_name}`;

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
                  const name = `${data.suffix} ${data.f_name} ${data.m_name} ${data.l_name}`;

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
            No faculty available.
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
            onClick={confirmAssign}
            color="success"
            variant="contained"
            disableElevation
            loading={loading}
            disabled={facultyList.length == 0}
          >
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddAssigned;
