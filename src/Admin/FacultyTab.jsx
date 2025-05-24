import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../helper/Supabase";
import { userContext } from "../App";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";

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
    id: "faculty_name",
    numeric: false,
    disablePadding: false,
    label: "Faculty name",
  },
  {
    id: "subjects",
    numeric: false,
    disablePadding: false,
    label: "Subject",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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

function FacultyTab() {
  const { user } = useContext(userContext);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("faculty_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [assignDialog, setAssignDialog] = useState(false);
  const [selected, setSelected] = useState({});

  async function fetchData() {
    let { data, error } = await supabase
      .from("vw_facultysubject")
      .select("*")
      .eq("department_id", user.department_id);

    if (error) {
      console.log("Failed to fetch data:", error);
      return;
    }

    const result = Object.values(
      data.reduce((acc, item) => {
        acc[item.id] = acc[item.id] || { ...item, id: item.id, subjects: [] };
        if (item.subject_code == null)
          acc[item.id].subjects.push(item.subject_code);
        else
          acc[item.id].subjects.push(
            item.subject_code + " (" + item.name + ")"
          );
        return acc;
      }, {})
    );

    setRows(result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const visibleFaculty = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .filter((value) => {
          const matchFname = value?.f_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchLname = value?.l_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchSubject = value?.subjects.includes(search);

          return matchFname || matchLname || matchSubject;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, search, rows]
  );

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

  return (
    <div>
      <h1 className="text-2xl font-bold">Faculty Management</h1>
      <Stack direction="row" mt={5} mb={2} justifyContent="space-between">
        <Input
          id="search_input"
          placeholder="search faculty name..."
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
              {visibleFaculty.map((row, index) => {
                const name = row.suffix + " " + row.f_name + " " + row.l_name;
                return (
                  <TableRow
                    key={index}
                    hover
                    tabIndex={-1}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>

                    <TableCell align="left" width="fit-content">
                      {/* {row.subject} */}
                      <Stack
                        rowGap={1}
                        columnGap={4}
                        direction="column"
                        useFlexGap
                        sx={{ flexWrap: "wrap" }}
                        // width="100%"
                        width="fit-content"
                        maxHeight="100px"
                      >
                        {row.subjects.map((data, index) => {
                          return <p key={index}>{data}</p>;
                        })}
                        {/* {row.name} */}
                      </Stack>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setSelected(row);
                          setAssignDialog(true);
                        }}
                      >
                        Assign Subject
                      </Button>
                    </TableCell>
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

      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
        <DialogTitle>Assign subject</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to assign subject</DialogContentText>
        </DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <DialogActions>
            <Button
              onClick={() => {
                setAssignDialog(false);
              }}
              color="danger"
            >
              Cancel
            </Button>
            <Button>Continue</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

export default FacultyTab;
