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
  CircularProgress,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
import styled from "@emotion/styled";
import Export from "../../../components/elements/Export";
import MyQuiz_csv from "../../../components/printables/MyQuiz_csv";
import MyQuiz_pdf from "../../../components/printables/MyQuiz_pdf";
import QuizInfoDialog from "../components/QuizInfoDialog";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 600,
  textAlign: "left",
  fontSize: "15px",
}));

function MyQuizTab() {
  const { user, setSnackbar } = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    show_archive: false,
    subject: "All",
    repository: "All",
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [openInfo, setOpenInfo] = useState({ open: false, exam_id: null });
  const [subOptions, setSubOptions] = useState([]);
  const [repoOptions, setRepoOptions] = useState([]);

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

    const uniqueRepo = Array.from(
      new Set(data.map((exam) => exam.repository).filter(Boolean))
    );

    const uniqueSubjects = Array.from(
      new Map(
        data.map((data) => [
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
    setRows(data);
    setLoading(false);
  };

  const visibleRows = useMemo(
    () =>
      rows
        .filter((row) => {
          const matchExamName = row.exam_name
            .toLowerCase()
            .includes(filter.search.toLowerCase());

          const matchSubjectName = row.subject_name
            .toLowerCase()
            .includes(filter.search.toLowerCase());

          const isArchived = filter.show_archive
            ? row.archived_at !== null
            : row.archived_at === null;

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

          return (
            (matchExamName || matchSubjectName) &&
            isArchived &&
            matchSubject &&
            matchRepo
          );
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

  const headCells = [
    { id: "exam_name", label: "Exam Name" },
    { id: "subject_name", label: "Subject" },
    { id: "total_items", label: "Total Items" },
    { id: "usage_count", label: "Usage Count" },
    { id: "archived_at", label: "Archived At" },
  ];

  const dlCsv = () => {
    MyQuiz_csv(rows, user);
  };
  const dlPdf = () => {
    MyQuiz_pdf(rows, user);
  };

  const resetFilters = () => {
    setFilter({
      search: "",
      show_archive: false,
      subject: "All",
      repository: "All",
    });
  };

  if (loading) {
    return (
      <Stack alignItems={"center"}>
        <CircularProgress />
      </Stack>
    );
  } else if (rows.length <= 0) {
    return (
      <Typography color="textDisabled" align="center" variant="body2">
        No quiz created yet
      </Typography>
    );
  }

  return (
    <>
      <Grid container direction={"row"} spacing={2} alignItems="center">
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

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={filter.show_archive}
                onClick={() =>
                  setFilter({ ...filter, show_archive: !filter.show_archive })
                }
              />
            }
            label={
              <Typography variant="caption" color="textSecondary">
                Show archived
              </Typography>
            }
          />
        </FormGroup>
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
              {headCells.map((headCell, index) => {
                if (headCell.id === "archived_at") {
                  return (
                    <StyledTableCell key={index}>
                      <Tooltip
                        title="Quizzes created 3 years ago are archived"
                        placement="top"
                        arrow
                      >
                        <InfoOutlineRoundedIcon
                          sx={{ fontSize: "small", mr: 0.5 }}
                        />
                      </Tooltip>
                      {headCell.label}
                    </StyledTableCell>
                  );
                }
                return (
                  <StyledTableCell key={index}>
                    {headCell.label}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length == 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  <Typography variant="body2">no results found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, index) => {
                const formatted = new Date(row.archived_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                );

                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    hover
                    onClick={() =>
                      setOpenInfo({ open: true, exam_id: row.exam_id })
                    }
                    style={{ cursor: "pointer" }}
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
                      <Typography variant="body2">
                        {row.subject_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.total_items}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.usage_count}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={row.archived_at ? "inherit" : "textSecondary"}
                      >
                        {row.archived_at ? formatted : "Not Archived"}
                      </Typography>
                    </TableCell>
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
      <QuizInfoDialog openInfo={openInfo} setOpen={setOpenInfo} />
    </>
  );
}

export default MyQuizTab;
