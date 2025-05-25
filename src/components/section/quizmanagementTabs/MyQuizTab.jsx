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
    // console.log("Fetched rows:", data);
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

  return (
    <>
      <TextField
        fullWidth
        sx={{ maxWidth: "25%" }}
        size="small"
        label="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, maxHeight: "60vh", overflow: "auto" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Exam name</b>
              </TableCell>
              <TableCell align="right">
                <b>Subject</b>
              </TableCell>
              <TableCell align="right">
                <b>Total Items</b>
              </TableCell>
              <TableCell align="right">
                <b>Answered Count</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.exam_name}
                </TableCell>
                <TableCell align="right">{row.subject_name}</TableCell>
                <TableCell align="right">{row.total_items}</TableCell>
                <TableCell align="right">{row.answered_count}</TableCell>
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
