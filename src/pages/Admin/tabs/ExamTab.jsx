import { useContext, useEffect, useMemo, useState } from "react";
import { userContext } from "../../../App";
import {
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import UnarchiveRoundedIcon from "@mui/icons-material/UnarchiveRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import { supabase } from "../../../helper/Supabase";

const headCells = [
  { label: "Exam" },
  { label: "Repository" },
  { label: "Subject" },
  { label: "Responses" },
  { label: "Average Score" },
  { label: "Created At" },
  { label: "Action" },
];

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

const ExamTab = () => {
  const { user, setSnackbar } = useContext(userContext);
  const [filter, setFilter] = useState({
    search: "",
    type: "all",
    cognitive: "all",
    lesson: "all",
    subject: "all",
    repository: "all",
    archived: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const [subjectOption, setSubjectOption] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchExams();

    const examSubscription = supabase
      .channel("exam")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_exam" },
        (payload) => {
          fetchExams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(examSubscription);
    };
  }, []);

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("vw_allquiz")
      .select("*")
      .eq("program_id", user.prog_id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch exams",
        severity: "error",
      });
      return;
    }
    // console.log(data);
    setRows(data);

    // unique subject options
    const subjects = [...new Set(data.map((item) => item.subject_name))];
    setSubjectOption(subjects);
  };

  const visibleExam = useMemo(
    () =>
      [...rows]
        .filter((value) => {
          const search = filter.search.trim();
          const lesson = filter.lesson;
          const subject = filter.subject;
          const repository = filter.repository;
          const archived = filter.archived;

          const matchSearch = value.exam_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchSubject =
            subject === "all" || value.subject_name === subject;

          const matchRepository =
            repository === "all" || value.repository === repository;

          const matchArchived = archived
            ? value.archived_at !== null
            : value.archived_at === null;

          return (
            matchSearch && matchSubject && matchRepository && matchArchived
          );
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, filter, rows]
  );

  const handleArchive = async (id) => {
    const { error } = await supabase
      .from("tbl_exam")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to archive exam.",
        severity: "error",
      });
      return;
    }
    setSnackbar({
      open: true,
      message: "Exam archived successfully.",
      severity: "success",
    });
  };

  const handleRestore = async (id) => {
    const { error } = await supabase
      .from("tbl_exam")
      .update({ archived_at: null })
      .eq("id", id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to restore exam.",
        severity: "error",
      });
      return;
    }
    setSnackbar({
      open: true,
      message: "Exam restored successfully.",
      severity: "success",
    });
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Exam Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          View exams and restore archived exams.
        </p>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Showing all exams from <b>{user.prog_name}</b>
        </p>
      </div>

      <Stack direction="row" justifyContent="space-between" mt={5} mb={2}>
        <Stack direction="row" spacing={2}>
          <OutlinedInput
            fullWidth
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="Search question..."
            size="small"
            sx={{ maxWidth: 300, minWidth: 200 }}
            endAdornment={
              filter.search && (
                <CloseRoundedIcon
                  onClick={() => setFilter({ ...filter, search: "" })}
                  sx={{ cursor: "pointer", color: "grey.500" }}
                />
              )
            }
          />

          <Select
            size="small"
            fullWidth
            defaultValue={"all"}
            value={filter.subject}
            sx={{ maxWidth: 300 }}
            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          >
            <MenuItem value="all">All Subjects</MenuItem>
            {subjectOption.map((data, index) => (
              <MenuItem key={index} value={data}>
                {data}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            fullWidth
            defaultValue={"all"}
            value={filter.repository}
            sx={{ maxWidth: 300 }}
            onChange={(e) =>
              setFilter({ ...filter, repository: e.target.value })
            }
          >
            <MenuItem value="all">All Repository</MenuItem>
            <MenuItem value="Quiz">Quiz</MenuItem>
            <MenuItem value="Final Exam">Final Exam</MenuItem>
          </Select>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={filter.archived}
                  onClick={() =>
                    setFilter({ ...filter, archived: !filter.archived })
                  }
                />
              }
              label={
                <Typography variant="caption" color="textSecondary">
                  Archived only
                </Typography>
              }
            />
          </FormGroup>

          <Tooltip title="Clear Filter" placement="top" arrow>
            <IconButton
              color="error"
              onClick={() =>
                setFilter({
                  search: "",
                  subject: "all",
                  repository: "all",
                  archived: false,
                })
              }
              aria-label="clear filter"
              size="small"
              sx={{ alignSelf: "center" }}
            >
              <RestartAltRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f6f7fb" }}>
              {headCells.map((headCell, index) => (
                <StyledTableCell key={index}>
                  <b>{headCell.label}</b>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleExam.length == 0 ? (
              <TableRow>
                <StyledTableCell colSpan={headCells.length}>
                  no results found
                </StyledTableCell>
              </TableRow>
            ) : (
              visibleExam.map((row, index) => {
                return (
                  <TableRow key={index} tabIndex={-1}>
                    <StyledTableCell component="th" scope="row">
                      {row.exam_name}
                    </StyledTableCell>
                    <StyledTableCell>{row.repository}</StyledTableCell>
                    <StyledTableCell>{row.subject_name}</StyledTableCell>
                    <StyledTableCell>{row.used_count}</StyledTableCell>
                    <StyledTableCell>{row.avg_score}</StyledTableCell>
                    <StyledTableCell>{row.created_at}</StyledTableCell>
                    <StyledTableCell>
                      {row.archived_at === null ? (
                        <Tooltip title="Archive" placement="top">
                          <IconButton
                            color="error"
                            onClick={() => handleArchive(row.exam_id)}
                            size="small"
                          >
                            <ArchiveRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Restore" placement="top">
                          <IconButton
                            color="success"
                            onClick={() => handleRestore(row.exam_id)}
                            size="small"
                          >
                            <UnarchiveRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </StyledTableCell>
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
    </div>
  );
};

export default ExamTab;
