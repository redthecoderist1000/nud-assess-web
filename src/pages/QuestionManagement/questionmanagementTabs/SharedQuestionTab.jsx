import React, { useContext, useEffect, useMemo, useState } from "react";
import { userContext } from "../../../App";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "../../../helper/Supabase";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 600,
  textAlign: "left",
  fontSize: "15px",
}));

const headCells = [
  "Question",
  "Type",
  "Cognitive Level",
  "Lesson",
  "Subject",
  "Usage Count",
  "Created By",
];

function SharedQuestionTab() {
  const { setSnackbar, user } = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState({
    subject: "All",
    repository: "All",
    search: "",
    type: "All",
    cognitive: "All",
  });
  const [subOptions, setSubOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [cognitiveOptions, setCognitiveOptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: questionData, error: questionError } = await supabase
      .from("vw_sharedquestion")
      .select("*");

    if (questionError) {
      setSnackbar({
        open: true,
        message: "Failed to fetch data. Refresh the page.",
        severity: "error",
      });
      return;
    }

    // const uniqueRepo = Array.from(
    //   new Set(questionData.map((exam) => exam.repository).filter(Boolean))
    // );
    // setRepoOptions(uniqueRepo);    setTypeOptions(uniqueType);
    const uniqueType = Array.from(
      new Set(questionData.map((exam) => exam.type).filter(Boolean))
    );

    const uniqueSubject = Array.from(
      new Set(questionData.map((exam) => exam.subject_name).filter(Boolean))
    );

    setTypeOptions(uniqueType);
    setSubOptions(uniqueSubject);
    setRows(questionData);
  };

  const visibleRows = useMemo(() => {
    return rows
      .filter((row) => {
        const matchSearch =
          (row.question || "")
            .toLowerCase()
            .includes(filter.search.toLowerCase()) ||
          (row.subject_name || "")
            .toLowerCase()
            .includes(filter.search.toLowerCase());

        const matchSubject =
          (row.subject_name || "")
            .toLowerCase()
            .includes(filter.subject.toLowerCase()) || filter.subject === "All";

        const matchType =
          (row.type || "").toLowerCase().includes(filter.type.toLowerCase()) ||
          filter.type === "All";

        const matchCognitive =
          row.cognitive_level === filter.cognitive ||
          filter.cognitive === "All";

        return matchSearch && matchSubject && matchType && matchCognitive;
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [rows, filter, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid container spacing={2} mt={2}>
        <Grid flex={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search questions..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            sx={{
              flex: 2,
              background: "#f6f7fb",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid flex={1}>
          <FormControl
            fullWidth
            size="small"
            sx={{ minWidth: 140, background: "#f6f7fb", borderRadius: 2 }}
          >
            <InputLabel id="subject_label">Subject</InputLabel>
            <Select
              labelId="subject_label"
              label="Subject"
              defaultValue="All"
              value={filter.subject}
              onChange={(e) =>
                setFilter({ ...filter, subject: e.target.value })
              }
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All</MenuItem>
              {subOptions.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid flex={1}>
          <FormControl
            fullWidth
            size="small"
            sx={{ minWidth: 120, background: "#f6f7fb", borderRadius: 2 }}
          >
            <InputLabel id="type_label">Type</InputLabel>
            <Select
              labelId="type_label"
              label="Type"
              defaultValue="All"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All</MenuItem>
              {typeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid flex={1}>
          <FormControl
            fullWidth
            size="small"
            sx={{ minWidth: 140, background: "#f6f7fb", borderRadius: 2 }}
          >
            <InputLabel id="cognitive_label">Cognitive Level</InputLabel>
            <Select
              labelId="cognitive_label"
              label="Cognitive Level"
              defaultValue="All"
              value={filter.cognitive}
              onChange={(e) =>
                setFilter({ ...filter, cognitive: e.target.value })
              }
              sx={{ borderRadius: 2 }}
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
        </Grid>
      </Grid>
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
                <StyledTableCell key={index}>{headCell}</StyledTableCell>
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
                  <Typography variant="body2">{row.question}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.type}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.cognitive_level}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.lesson_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.subject_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.usage_count}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.created_by}</Typography>
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

export default SharedQuestionTab;
