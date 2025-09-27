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
  Grid,
  Stack,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import styled from "@emotion/styled";
import { userContext } from "../../../App";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import Export from "../../../components/elements/Export";
import MyQuestionCsv from "../../../components/printables/MyQuestion_csv";
import MyQuestionPdf from "../../../components/printables/MyQuestion_pdf";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 600,
  textAlign: "left",
  fontSize: "15px",
  lineHeight: 1.5,
}));

function MyQuestionTab() {
  const { user, setSnackBar } = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBloom, setSearchBloom] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchType, setSearchType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [exportAnchor, setExportAnchor] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("vw_ownquestion").select("*");
    if (error) {
      setSnackBar({
        open: true,
        message: "Failed to fetch data. Refresh the page.",
        severity: "error",
      });
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

  const subjects = Array.from(
    new Set(rows.map((row) => row.subject ?? ""))
  ).filter(Boolean);
  const types = Array.from(new Set(rows.map((row) => row.type ?? ""))).filter(
    Boolean
  );

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
          const matchBlooms =
            isBloomAll || data.blooms_category === searchBloom;
          const matchLesson = data.lesson
            ?.toLowerCase()
            .includes(search.toLowerCase());
          const matchSubject =
            isSubjectAll ||
            (data.subject ?? "").toLowerCase() === searchSubject.toLowerCase();

          const searchMatch =
            isSearchEmpty ||
            matchQuestion ||
            (data.blooms_category ?? "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            matchLesson ||
            (data.subject ?? "").toLowerCase().includes(search.toLowerCase());

          return searchMatch && matchBlooms && matchSubject && matchType;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, search, page, rowsPerPage, searchBloom, searchSubject, searchType]
  );

  const headCells = [
    { id: "question", label: "Question" },
    { id: "type", label: "Type" },
    { id: "conlevel", label: "Cognitive Level" },
    { id: "lesson", label: "Lesson" },
    { id: "sub", label: "Subject" },
  ];

  const dlCsv = () => {
    MyQuestionCsv(rows, user);
  };
  const dlPdf = () => {
    MyQuestionPdf(rows, user);
  };

  if (rows.length <= 0) {
    return (
      <Typography variant="body2" color="textDisabled" align="center">
        No question created yet
      </Typography>
    );
  }

  const resetFilters = () => {
    setSearch("");
    setSearchBloom("");
    setSearchSubject("");
    setSearchType("");
  };

  return (
    <>
      <Grid container columnGap={2} wrap="flex" alignItems="center">
        <Grid flex={3}>
          <TextField
            fullWidth
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
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All</MenuItem>
              {subjects.map((subject) => (
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
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All</MenuItem>
              {types.map((type) => (
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
              value={searchBloom}
              onChange={(e) => setSearchBloom(e.target.value)}
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
        <Tooltip title="Clear Filters" placement="top" arrow>
          <IconButton onClick={resetFilters} size="small">
            <RestartAltRoundedIcon size="small" color="error" />
          </IconButton>
        </Tooltip>
        <Export
          anchorEl={exportAnchor}
          setAnchorEl={setExportAnchor}
          dlCsv={dlCsv}
          dlPdf={dlPdf}
        />
      </Grid>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          marginTop: 2,
          overflow: "auto",
          maxHeight: "60vh",
        }}
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
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2">{row.question}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.type}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{row.blooms_category}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.lesson}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.subject}</Typography>
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
