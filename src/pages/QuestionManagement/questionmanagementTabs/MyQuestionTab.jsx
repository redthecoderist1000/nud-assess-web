import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function MyQuestionTab() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBloom, setSearchBloom] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchType, setSearchType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

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

  const subjects = Array.from(new Set(rows.map(row => row.subject ?? ""))).filter(Boolean);
  const types = Array.from(new Set(rows.map(row => row.type ?? ""))).filter(Boolean);

  const visibleRows = useMemo(
    () =>
      rows
        .filter((data) => {
          const isBloomAll = !searchBloom || searchBloom === "All";
          const isSubjectAll = !searchSubject || searchSubject === "All";
          const isTypeAll = !searchType || searchType === "All";
          const isSearchEmpty = !search || search.trim() === "";

          const matchQuestion = data.question
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchType = isTypeAll || data.type === searchType;
          const matchBlooms = isBloomAll || data.blooms_category === searchBloom;
          const matchLesson = data.lesson?.toLowerCase().includes(search.toLowerCase());
          const matchSubject =
            isSubjectAll || (data.subject ?? "").toLowerCase() === searchSubject.toLowerCase();

          const searchMatch =
            isSearchEmpty ||
            matchQuestion ||
            (data.blooms_category ?? "").toLowerCase().includes(search.toLowerCase()) ||
            matchLesson ||
            (data.subject ?? "").toLowerCase().includes(search.toLowerCase());

          return searchMatch && matchBlooms && matchSubject && matchType;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, search, page, rowsPerPage, searchBloom, searchSubject, searchType]
  );

  if (rows.length <= 0) {
    return (
      <Typography variant="body2" color="textDisabled" align="center">
        No question created yet
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          background: "transparent",
          paddingBottom: 1,
          paddingTop: 3,
        }}
      >
        <TextField
          size="small"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 2,
            background: "#f6f7fb",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 140, background: "#f6f7fb", borderRadius: 2 }}>
          <Select
            displayEmpty
            value={searchSubject}
            onChange={(e) => setSearchSubject(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Subjects</MenuItem>
            <MenuItem value="All">All Subjects</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120, background: "#f6f7fb", borderRadius: 2 }}>
          <Select
            displayEmpty
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="All">All Types</MenuItem>
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140, background: "#f6f7fb", borderRadius: 2 }}>
          <Select
            displayEmpty
            value={searchBloom}
            onChange={(e) => setSearchBloom(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Bloom's Category</MenuItem>
            <MenuItem value="All">Bloom's Category</MenuItem>
            <MenuItem value="Remembering">Remembering</MenuItem>
            <MenuItem value="Understanding">Understanding</MenuItem>
            <MenuItem value="Applying">Applying</MenuItem>
            <MenuItem value="Analyzing">Analyzing</MenuItem>
            <MenuItem value="Evaluating">Evaluating</MenuItem>
            <MenuItem value="Creating">Creating</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          marginTop: 0,
          overflow: "auto",
          maxHeight: "60vh",
          borderRadius: 2,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Question</b>
              </TableCell>
              <TableCell>
                <b>Type</b>
              </TableCell>
              <TableCell>
                <b>Blooms Spec</b>
              </TableCell>
              <TableCell>
                <b>Lessons</b>
              </TableCell>
              <TableCell>
                <b>Subject</b>
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
                  {row.keywords && Array.isArray(row.keywords) && (
                    <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {row.keywords.map((kw, i) => (
                        <Box
                          key={i}
                          sx={{
                            px: 1,
                            py: 0.2,
                            fontSize: "11px",
                            background: "#f3f4f6",
                            borderRadius: 1,
                            color: "#555",
                            border: "1px solid #e5e7eb",
                            mr: 0.5,
                            mb: 0.5,
                            display: "inline-block",
                          }}
                        >
                          {kw}
                        </Box>
                      ))}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.2,
                      background: "#eaf2ff",
                      color: "#3b5cb8",
                      borderRadius: 1,
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {row.type}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.2,
                      background:
                        row.blooms_category === "Remembering"
                          ? "#ffeaea"
                          : row.blooms_category === "Analyzing"
                          ? "#eaffea"
                          : row.blooms_category === "Applying"
                          ? "#fffbe5"
                          : "#f3f4f6",
                      color:
                        row.blooms_category === "Remembering"
                          ? "#d32f2f"
                          : row.blooms_category === "Analyzing"
                          ? "#388e3c"
                          : row.blooms_category === "Applying"
                          ? "#fbc02d"
                          : "#555",
                      borderRadius: 1,
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {row.blooms_category}
                  </Box>
                </TableCell>
                <TableCell>
                  {row.lesson}
                </TableCell>
                <TableCell>
                  {row.subject}
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

export default MyQuestionTab;