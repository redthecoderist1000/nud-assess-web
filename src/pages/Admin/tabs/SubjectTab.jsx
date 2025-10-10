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
  OutlinedInput,
  Paper,
  Select,
  Stack,
  styled,
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
import CreateSubjectDialog from "../components/CreateSubjectDialog";

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
];

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

function SubjectTab() {
  const navigate = useNavigate();
  const { user, setSnackbar } = useContext(userContext);

  const [search, setSearch] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("subject_code");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  // add subjject
  const [addSubDialog, setAddSubDialog] = useState(false);

  const handleSearch = (e) => setSearch(e.target.value);
  const clearSearch = () => setSearch("");

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
        .filter((value) => {
          const matchSubName = value.name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchSubCode = value.subject_code
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchFacIncharge = value.faculty_incharge
            .toLowerCase()
            .includes(search.toLowerCase());

          return matchSubName || matchSubCode || matchFacIncharge;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows, search]
  );

  useEffect(() => {
    fetchData();

    const progSubChannel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_program_subject" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progSubChannel);
    };
  }, []);

  const fetchData = async () => {
    let { data, error } = await supabase.from("vw_adminsubjects").select("*");

    if (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Error fetching subject data. Refresh the page.",
        severity: "error",
      });
      return;
    }
    console.log("data", data);
    setRows(data);
  };

  const goToSubject = (subjectId, progSubId) => {
    const params = new URLSearchParams({
      subjectId: subjectId,
      progSubId: progSubId,
    });
    navigate(`/admin/subject?${params.toString()}`);
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Subject Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Manage subjects and assign faculty incharge.
        </p>
      </div>
      <Stack direction="row" mt={5} mb={2} justifyContent="space-between">
        <OutlinedInput
          id="search_input"
          size="small"
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
          sx={{
            bgcolor: "#4854a3",
            "&:hover": { bgcolor: "#2C388F" },
          }}
          onClick={() => setAddSubDialog(true)}
        >
          Create Subject
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: "#f6f7fb" }}>
              {headCells.map((headCell, index) => {
                return (
                  <StyledTableCell key={index}>
                    <b>{headCell.label}</b>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length == 0 ? (
              <TableRow>
                <StyledTableCell colSpan={headCells.length}>
                  no results found
                </StyledTableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    hover
                    tabIndex={-1}
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      goToSubject(row.subject_id, row.program_subject_id)
                    }
                  >
                    <StyledTableCell component="th" scope="row">
                      {row.subject_code}
                    </StyledTableCell>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    {row.faculty_incharge ? (
                      <StyledTableCell>{row.faculty_incharge}</StyledTableCell>
                    ) : (
                      <StyledTableCell>
                        <p className="text-gray-500">
                          <i>unassigned</i>
                        </p>
                      </StyledTableCell>
                    )}
                  </TableRow>
                );
              })
            )}
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

      {/* add subject dialog */}
      <CreateSubjectDialog
        open={addSubDialog}
        onClose={() => setAddSubDialog(false)}
      />
    </>
  );
}

export default SubjectTab;
