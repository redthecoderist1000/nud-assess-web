import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { supabase } from "../../../helper/Supabase";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { userContext } from "../../../App";
import { useLocation, useNavigate } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "subject_code",
    numeric: false,
    disablePadding: false,
    label: "Subject Code",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
  },
  {
    id: "incharge",
    numeric: false,
    disablePadding: false,
    label: "Faculty Incharge",
  },
  // {
  //   id: "actions",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Actions",
  //   // align: "right",
  //   visibleSort: false,
  // },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align ?? "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: "bold" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function SubjectTab() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const [search, setSearch] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("subject_code");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);

  // add subjject
  const [addSubDialog, setAddSubDialog] = useState(false);
  const [addSubForm, setAddSubForm] = useState({});

  const handleSubFormChange = (e) => {
    setAddSubForm({ ...addSubForm, [e.target.id]: e.target.value });
  };

  const addSubConfirm = () => {
    (async () => {
      let { data, error } = await supabase
        .from("tbl_subject")
        .insert({
          name: addSubForm.subject_name,
          subject_code: addSubForm.subject_code,
          department_id: user.department_id,
        })
        .select("*")
        .single();

      if (error) {
        console.log("Error inserting data:", error);
        return;
      }

      // program id

      let program_id = await supabase
        .from("tbl_program")
        .select("id")
        .eq("program_chair", user.user_id)
        .single();

      // console.log(data);
      await supabase.from("tbl_program_subject").insert({
        program_id: program_id.data.id,
        subject_id: data.id,
      });
      setAddSubDialog(false);
    })();
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const clearSearch = () => setSearch("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .filter((value) => {
          const matchSubName = value.tbl_subject.name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchSubCode = value.tbl_subject.subject_code
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchFname = value.tbl_subject.tbl_users?.f_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchLname = value.tbl_subject.tbl_users?.l_name
            .toLowerCase()
            .includes(search.toLowerCase());

          return matchSubName || matchSubCode || matchFname || matchLname;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows, search]
  );

  useEffect(() => {
    fetchData();
    const updateChannel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_program_subject" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  async function fetchData() {
    let { data, error } = await supabase
      .from("tbl_program")
      .select(
        "tbl_program_subject(id,tbl_subject(id, name, subject_code,tbl_users(id, suffix, f_name, m_name, l_name)))"
      )
      .eq("program_chair", user.user_id)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    // console.log("data", data);
    setRows(data.tbl_program_subject);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Subject Management</h1>
      <Stack direction="row" mt={5} mb={2} justifyContent="space-between">
        <Input
          id="search_input"
          placeholder="search..."
          value={search}
          sx={{ width: "25%" }}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            search == "" ? null : (
              <InputAdornment position="end" onClick={clearSearch}>
                <CloseIcon />
              </InputAdornment>
            )
          }
        />
        <Button
          variant="contained"
          size="small"
          disableElevation
          onClick={() => {
            setAddSubDialog(true);
          }}
        >
          Create Subject
        </Button>
      </Stack>
      <Paper sx={{ width: "100%", mb: 5 }}>
        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              // rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const assigned =
                  row.tbl_subject.tbl_users == null ? false : true;
                const user = row.tbl_subject.tbl_users;
                const incharge = assigned
                  ? user.suffix + " " + user.f_name + " " + user.l_name
                  : "";

                return (
                  <TableRow
                    key={index}
                    hover
                    tabIndex={-1}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("subject", {
                        state: {
                          subjectId: row.tbl_subject.id,
                          progSubId: row.id,
                        },
                      });
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.tbl_subject.subject_code}
                    </TableCell>
                    <TableCell>{row.tbl_subject.name}</TableCell>
                    {assigned ? (
                      <TableCell>{incharge}</TableCell>
                    ) : (
                      <TableCell>
                        <p className="text-gray-500">
                          <i>unassigned</i>
                        </p>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* add subject dialog */}
      <Dialog
        open={addSubDialog}
        onClose={() => setAddSubDialog(false)}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>Add subject</DialogTitle>
        <DialogContent>
          <DialogContentText>Add subject into your program?</DialogContentText>
          <Box component="form" mt={2}>
            <Stack direction="column" gap={1}>
              <TextField
                required
                id="subject_name"
                size="small"
                label="Subject Name"
                onChange={handleSubFormChange}
              />
              <TextField
                required
                id="subject_code"
                label="Subject Code"
                size="small"
                onChange={handleSubFormChange}
              />
            </Stack>
          </Box>
        </DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="space-between">
              <Button
                onClick={() => {
                  setAddSubDialog(false);
                }}
                color="error"
                size="small"
              >
                Cancel
              </Button>
              <Button
                disableElevation
                size="small"
                onClick={addSubConfirm}
                color="success"
                variant="contained"
              >
                Confirm
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

export default SubjectTab;
