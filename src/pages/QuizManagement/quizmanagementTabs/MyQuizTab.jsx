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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function MyQuizTab() {
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
      console.error("Error fetching data:", error);
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

  if (rows.length <= 0) {
    return (
      <Typography color="textDisabled" align="center" variant="body2">
        No quiz created yet
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 0, mt: 2 }}>
      <Box
        sx={{
          border: "1px solid #e5e7eb", // Add border around the table area
          borderRadius: 2,
          background: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, px: 3, pt: 3 }}>
          <TextField
            fullWidth
            sx={{
              maxWidth: 300,
              background: "#f6f7fb",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            size="small"
            label="Search exams..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            SelectProps={{ native: true }}
            size="small"
            label="All Status"
            sx={{
              minWidth: 140,
              background: "#f6f7fb",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            defaultValue=""
          >
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </TextField>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            maxHeight: "60vh",
            overflow: "auto",
            borderRadius: 2,
            boxShadow: "none",
            border: "none",
          }}
          variant="outlined"
        >
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ background: "#f6f7fb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#222", background: "#f6f7fb" }}>
                  Exam Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#222", background: "#f6f7fb" }}>
                  Subject
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#222", background: "#f6f7fb" }}>
                  Total Items
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#222", background: "#f6f7fb" }}>
                  Answered Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { background: "#f6f7fb" },
                    transition: "background 0.2s",
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ py: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "#2C388F", fontWeight: 600 }}>
                        {row.exam_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        {row.exam_type || "Exam"}
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
                    <Typography variant="body2">{row.answered_count}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, px: 3, pb: 3 }}>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Showing {visibleRows.length} of {rows.length} exams
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-toolbar": { pl: 0, pr: 0 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "#6b7280",
              },
              "& .MuiTablePagination-actions": { color: "#2C388F" },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MyQuizTab;