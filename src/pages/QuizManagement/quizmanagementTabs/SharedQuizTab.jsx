import React, { useContext, useEffect, useMemo, useState } from "react";
import { userContext } from "../../../App";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { supabase } from "../../../helper/Supabase";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 600,
  textAlign: "left",
  fontSize: "15px",
}));

const headCells = [
  { id: "exam_name", label: "Exam Name" },
  { id: "subject_name", label: "Subject" },
  { id: "total_items", label: "Total Items" },
  { id: "answered_count", label: "Answered Count" },
  { id: "created_by", label: "Created By" },
];

function SharedQuizTab() {
  const { setSnackbar, user } = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState({
    subject: "All",
    repository: "All",
    search: "",
  });
  const [subOptions, setSubOptions] = useState([]);
  const [repoOptions, setRepoOptions] = useState([]);

  const fetchData = async () => {
    // fetch incharge
    const { data: quizData, error: quizError } = await supabase
      .from("vw_sharedquiz")
      .select("*");

    if (quizError) {
      setSnackbar({
        open: true,
        message: "Failed to fetch shared quizzes, Refresh the page",
        severity: "error",
      });
      return;
    }

    // get unique subjects
    // console.log(quizData);

    const uniqueRepo = Array.from(
      new Set(quizData.map((exam) => exam.repository).filter(Boolean))
    );

    const uniqueSubjects = Array.from(
      new Map(
        quizData.map((data) => [
          data.subject_id,
          {
            subject_id: data.subject_id,
            subject_name: data.subject_name.trim(),
          },
        ])
      ).values()
    );

    setRepoOptions(uniqueRepo);
    setSubOptions(uniqueSubjects);
    setRows(quizData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const visibleRows = useMemo(
    () =>
      rows
        .filter((row) => {
          const matchExamName =
            row.exam_name.toLowerCase().includes(filter.search.toLowerCase()) ||
            filter.search === "";

          const matchSubject =
            row.subject_name
              .toLowerCase()
              .includes(filter.subject.toLowerCase()) ||
            filter.subject === "All";

          const matchRepo =
            row.repository
              .toLowerCase()
              .includes(filter.repository.toLowerCase()) ||
            filter.repository === "All";

          return matchExamName && matchSubject && matchRepo;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),

    [rows, filter, page, rowsPerPage]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetFilters = () => {
    setFilter({
      subject: "All",
      repository: "All",
      search: "",
    });
  };

  if (rows.length <= 0) {
    return (
      <Typography color="textDisabled" align="center" variant="body2">
        No quizzes found
      </Typography>
    );
  }

  return (
    <>
      <Grid container direction={"row"} spacing={2}>
        <Grid flex={2}>
          <TextField
            fullWidth
            sx={{
              background: "#f6f7fb",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            size="small"
            label="Search exams..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
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
              {subOptions.map((subject, index) => (
                <MenuItem key={index} value={subject.subject_name}>
                  {subject.subject_name}
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
            <InputLabel id="subject_label">Repository</InputLabel>
            <Select
              labelId="subject_label"
              label="Repository"
              defaultValue="All"
              value={filter.repository}
              onChange={(e) =>
                setFilter({ ...filter, repository: e.target.value })
              }
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All</MenuItem>
              {repoOptions.map((repository, index) => (
                <MenuItem key={index} value={repository}>
                  {repository}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Tooltip title="Clear Filters" placement="top" arrow>
          <IconButton onClick={resetFilters} size="small">
            <RestartAltRoundedIcon size="small" color="error" />
          </IconButton>
        </Tooltip>
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

export default SharedQuizTab;
