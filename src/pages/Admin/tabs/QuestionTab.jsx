import styled from "@emotion/styled";
import {
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
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

import React, { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

const headCells = [
  { label: "Question" },
  { label: "Type" },
  { label: "Cognitive Level" },
  { label: "Repository" },
  { label: "Lesson" },
  { label: "Subject" },
  { label: "Responses" },
  { label: "Success Rate" },
  { label: "Action" },
];

const QuestionTab = () => {
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
  const [lessonOption, setLessonOption] = useState([]);

  useEffect(() => {
    fetchData();

    const questionChannel = supabase
      .channel("questions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_question" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questionChannel);
    };
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("vw_allquestions")
      .select("*")
      .eq("program_id", user.prog_id);

    if (error) {
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true,
      });
      return;
    }
    // console.log(data);
    setRows(data);

    // unique subject options
    const subjects = [...new Set(data.map((item) => item.subject_name))];
    setSubjectOption(subjects);

    // unique lesson options
    const lessons = [...new Set(data.map((item) => item.lesson_name))];
    setLessonOption(lessons);
  };
  const visibleFaculty = useMemo(
    () =>
      [...rows]
        .filter((value) => {
          const search = filter.search.trim();
          const lesson = filter.lesson;
          const subject = filter.subject;
          const type = filter.type;
          const cognitive = filter.cognitive;
          const repository = filter.repository;
          const archived = filter.archived;

          const matchSearch = value.question
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchLesson = lesson === "all" || value.lesson_name === lesson;
          const matchSubject =
            subject === "all" || value.subject_name === subject;
          const matchType = type === "all" || value.question_type === type;
          const matchCognitive =
            cognitive === "all" || value.cognitive_level === cognitive;
          const matchRepository =
            repository === "all" || value.repository === repository;

          const matchArchived = archived
            ? value.archived_at !== null
            : value.archived_at === null;

          return (
            matchSearch &&
            matchLesson &&
            matchSubject &&
            matchType &&
            matchCognitive &&
            matchRepository &&
            matchArchived
          );
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, filter, rows]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleArchive = async (id) => {
    const { error } = await supabase
      .from("tbl_question")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setSnackbar({
        message: "Failed to archive question. Please try again.",
        severity: "error",
        open: true,
      });
      return;
    }
    setSnackbar({
      message: "Question archived successfully",
      severity: "success",
      open: true,
    });
  };

  const handleRestore = async (id) => {
    const { error } = await supabase
      .from("tbl_question")
      .update({ archived_at: null })
      .eq("id", id);

    if (error) {
      setSnackbar({
        message: "Failed to restore question. Please try again.",
        severity: "error",
        open: true,
      });
      return;
    }
    setSnackbar({
      message: "Question restored successfully",
      severity: "success",
      open: true,
    });
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Question Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          View questions and restore archived questions.
        </p>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Showing all questions from <b>{user.prog_name}</b>
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
            value={filter.type}
            sx={{ maxWidth: 300 }}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
            <MenuItem value="T/F">True or False</MenuItem>
            <MenuItem value="Identification">Identification</MenuItem>
          </Select>
          <Select
            size="small"
            fullWidth
            defaultValue={"all"}
            value={filter.cognitive}
            sx={{ maxWidth: 300 }}
            onChange={(e) =>
              setFilter({ ...filter, cognitive: e.target.value })
            }
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="Remembering">Remembering</MenuItem>
            <MenuItem value="Understanding">Understanding</MenuItem>
            <MenuItem value="Applying">Applying</MenuItem>
            <MenuItem value="Analyzing">Analyzing</MenuItem>
            <MenuItem value="Evaluating">Evaluating</MenuItem>
            <MenuItem value="Creating">Creating</MenuItem>
          </Select>
          <Select
            size="small"
            fullWidth
            defaultValue={"all"}
            value={filter.lesson}
            sx={{ maxWidth: 300 }}
            onChange={(e) => setFilter({ ...filter, lesson: e.target.value })}
          >
            <MenuItem value="all">All Lessons</MenuItem>
            {lessonOption.map((data, index) => (
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
                  type: "all",
                  cognitive: "all",
                  lesson: "all",
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
            {visibleFaculty.length == 0 ? (
              <TableRow>
                <StyledTableCell colSpan={headCells.length}>
                  no results found
                </StyledTableCell>
              </TableRow>
            ) : (
              visibleFaculty.map((row, index) => {
                return (
                  <TableRow key={index} tabIndex={-1}>
                    <StyledTableCell component="th" scope="row">
                      {row.question}
                    </StyledTableCell>
                    <StyledTableCell>{row.question_type}</StyledTableCell>
                    <StyledTableCell>{row.cognitive_level}</StyledTableCell>
                    <StyledTableCell>{row.repository}</StyledTableCell>
                    <StyledTableCell>{row.lesson_name}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title={row.subject_name} placement="left">
                        {row.subject_code}
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>{row.answered_count}</StyledTableCell>
                    <StyledTableCell>{row.success_rate}</StyledTableCell>
                    <StyledTableCell>
                      {row.archived_at === null ? (
                        <Tooltip title="Archive" placement="top">
                          <IconButton
                            color="error"
                            onClick={() => handleArchive(row.question_id)}
                            size="small"
                          >
                            <ArchiveRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Restore" placement="top">
                          <IconButton
                            color="success"
                            onClick={() => handleRestore(row.question_id)}
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

export default QuestionTab;
