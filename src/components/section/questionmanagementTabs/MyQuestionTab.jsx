import {
  FormControl,
  InputLabel,
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
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function MyQuestionTab() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBloom, setSearchBloom] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  //   blooms_category: "Understanding";
  //   lesson: "OWASP Top Vulnerabilities";
  //   question: "What is the main purpose of the OWASP Top 10?";
  //   question_id: "1be5bbd8-c09b-4eac-8289-fddf4682ddc1";
  //   repository: "Quiz";
  //   subject: "Information Assurance And Security\n";
  //   type: "Multiple Choice";
  //   usage_count: 1;

  const fetchData = async () => {
    const { data, error } = await supabase.from("vw_ownquestion").select("*");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    setRows(data);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      rows
        .filter((data) => {
          const isBloomAll = !searchBloom || searchBloom === "All";
          const isSearchEmpty = !search || search.trim() === "";

          if (isSearchEmpty && isBloomAll) return true;

          const matchQuestion = data.question
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchType = data.type
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchBlooms = data.blooms_category
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchLesson = data.lesson
            ?.toLowerCase()
            .includes(search.toLowerCase());

          const matchSubject = data.subject
            ?.toLowerCase()
            .includes(search.toLowerCase());

          const matchBloomFilter =
            searchBloom === "All" ||
            data.blooms_category.toLowerCase() == searchBloom.toLowerCase();

          if (!isSearchEmpty && !isBloomAll) {
            return (
              (matchQuestion ||
                matchType ||
                matchBlooms ||
                matchLesson ||
                matchSubject) &&
              matchBloomFilter
            );
          } else if (!isSearchEmpty) {
            return (
              matchQuestion ||
              matchType ||
              matchBlooms ||
              matchLesson ||
              matchSubject
            );
          } else if (!isBloomAll) {
            return matchBloomFilter;
          }
          return true;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),

    [rows, search, page, rowsPerPage, searchBloom]
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          size="small"
          label="search"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: "25%" }}
        />
        <FormControl fullWidth size="small" sx={{ maxWidth: "20%" }}>
          <InputLabel id="bloom_filter_label">Bloom's Category</InputLabel>
          <Select
            labelId="bloom_filter_label"
            id="bloom_filter_select"
            label="Bloom's Category"
            onChange={(e) => setSearchBloom(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Remembering">Remembering</MenuItem>
            <MenuItem value="Understanding">Understanding</MenuItem>
            <MenuItem value="Applying">Applying</MenuItem>
            <MenuItem value="Analyzing">Analyzing</MenuItem>
            <MenuItem value="Evaluating">Evaluating</MenuItem>
            <MenuItem value="Creating">Creating</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, overflow: "auto", maxHeight: "60vh" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Question</b>
              </TableCell>
              <TableCell align="right">
                <b>Type</b>
              </TableCell>
              <TableCell align="right">
                <b>Bloom's Spec</b>
              </TableCell>
              <TableCell align="right">
                <b>Lesson</b>
              </TableCell>
              <TableCell align="right">
                <b>Subject</b>
              </TableCell>
              <TableCell align="right">
                <b>Usage count</b>
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
                  {row.question}
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.blooms_category}</TableCell>
                <TableCell align="right">{row.lesson ?? ""}</TableCell>
                <TableCell align="right">{row.subject ?? ""}</TableCell>
                <TableCell align="right">{row.usage_count}</TableCell>
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

export default MyQuestionTab;
