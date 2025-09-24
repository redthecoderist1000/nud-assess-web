import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Typography,
  Box,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
import styled from "@emotion/styled";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 600,
  textAlign: "left",
  fontSize: "15px",
}));

function MyQuizTab() {
  const { setSnackbar } = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("vw_getownquiz").select("*");

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching data",
        severity: "error",
      });
      return;
    }

    setRows(data);
  };

  const visibleRows = useMemo(
    () =>
      rows
        .filter((row) => {
          const matchExamName = row.exam_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchSubjectName = row.subject_name
            .toLowerCase()
            .includes(search.toLowerCase());

          return matchExamName || matchSubjectName;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),

    [rows, search, page, rowsPerPage]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headCells = [
    { id: "exam_name", label: "Exam Name" },
    { id: "subject_name", label: "Subject" },
    { id: "total_items", label: "Total Items" },
    { id: "usage_count", label: "Usage Count" },
  ];

  if (rows.length <= 0) {
    return (
      <Typography color="textDisabled" align="center" variant="body2">
        No quiz created yet
      </Typography>
    );
  }

  return (
    <>
      <TextField
        fullWidth
        sx={{
          maxWidth: 300,
          background: "#f6f7fb",
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        size="small"
        label="Search exams..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          maxHeight: "60vh",
          overflow: "auto",
        }}
        variant="outlined"
      >
        <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ background: "#f6f7fb" }}>
              {headCells.map((headCell, index) => (
                <StyledTableCell key={index}>{headCell.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#2C388F", fontWeight: 600 }}
                    >
                      {row.exam_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {row.repository}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.subject_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.total_items}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.usage_count}</Typography>
                </TableCell>
              </TableRow>
            ))}
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
    </>
  );
}

export default MyQuizTab;
