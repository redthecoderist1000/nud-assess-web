import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useNavigate } from "react-router-dom";

function TransferDeptDialog({ open, setOpen, selectedFaculty, currDept }) {
  const navigate = useNavigate();
  const { setSnackbar } = useContext(userContext);
  const [deptOptions, setDeptOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async () => {
    const { data, error } = await supabase
      .from("tbl_department")
      .select(
        "id, name, shorthand_name, school:tbl_school(id, name, shorthand_name)"
      )
      .neq("id", currDept);
    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching department options",
        severity: "error",
      });
      setOpen(false);
      return;
    }
    setDeptOptions(data);
  };

  const transfer = async () => {
    if (selected == null) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tbl_users")
      .update({ department_id: selected.id })
      .eq("id", selectedFaculty)
      .select()
      .single();

    if (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Error transferring department",
        severity: "error",
      });
      return;
    }

    // remove loaded subjects
    await supabase
      .from("tbl_faculty_subject")
      .delete()
      .eq("faculty_id", selectedFaculty);

    // remove assistant program chair
    await supabase
      .from("tbl_program")
      .update({ assistant_program_chair: null })
      .eq("assistant_program_chair", selectedFaculty);

    // remove incharge
    await supabase
      .from("tbl_subject")
      .update({ faculty_incharge: null })
      .eq("faculty_incharge", selectedFaculty);

    setSnackbar({
      open: true,
      message: "Department transferred successfully",
      severity: "success",
    });

    setOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setSearch("");
      return;
    }
    fetchOptions();
  }, [open]);

  const visibleDept = useMemo(
    () =>
      deptOptions.filter((dept) => {
        const matchSearch =
          dept.name.toLowerCase().includes(search.toLowerCase()) ||
          dept.shorthand_name.toLowerCase().includes(search.toLowerCase()) ||
          dept.school.name.toLowerCase().includes(search.toLowerCase()) ||
          dept.school.shorthand_name
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchSearch;
      }),
    [deptOptions, search]
  );
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={() => setOpen(false)}
      aria-labelledby="transfer-dept-dialog"
      aria-describedby="transfer-dept-dialog-description"
    >
      <DialogTitle>Transfer Department</DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2, p: 2 }} variant="outlined">
          <DialogContentText>Transfer to:</DialogContentText>
          <List dense disablePadding sx={{ width: "100%" }}>
            {selected != null && (
              <ListItem
                onClick={() => {}}
                secondaryAction={
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setSelected(null)}
                  >
                    <HighlightOffRoundedIcon fontSize="20" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${selected?.name} (${selected?.shorthand_name})`}
                  secondary={`${selected?.school?.name}`}
                />
              </ListItem>
            )}
          </List>
        </Card>
        <TextField
          size="small"
          fullWidth
          label="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <List dense sx={{ maxHeight: 300, overflowY: "auto" }}>
          {visibleDept.map((data, index) => {
            return (
              <ListItemButton key={index} onClick={() => setSelected(data)}>
                <ListItemText
                  primary={`${data.name} (${data.shorthand_name})`}
                  secondary={data.school.name}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider />
        <Stack direction={"row"} alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <WarningRoundedIcon color="warning" />
          <Typography variant="body2" color="text.secondary">
            Once transferred, all assigned subjects will be removed and the
            faculty will no longer be able to access the previous department.
          </Typography>
        </Stack>
        <Stack direction={"row"} justifyContent="center" width="100%">
          <FormControlLabel
            control={
              <Checkbox
                onClick={(e) => setIsChecked(e.target.checked)}
                color="success"
              />
            }
            label="I read and understand the consequences."
            sx={{ color: "text.secondary", mt: 1, fontSize: 10 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button
            color="error"
            loading={loading}
            onClick={() => setOpen(false)}
          >
            cancel
          </Button>
          <Button
            color="success"
            variant="contained"
            disableElevation
            onClick={transfer}
            disabled={selected == null || !isChecked}
            loading={loading}
            autoFocus
          >
            Transfer
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default TransferDeptDialog;
