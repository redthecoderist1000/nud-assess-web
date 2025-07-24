import {
  Button,
  Card,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../helper/Supabase";
import InchargeDialog from "../components/subjectInfo/InchargeDialog";
import AddLessonDialog from "../components/subjectInfo/AddLessonDialog";
import EditLessonDialog from "../components/subjectInfo/EditLessonDialog";
import RemoveLessonDialog from "../components/subjectInfo/RemoveLessonDialog";
import AddAssigned from "../components/subjectInfo/AddAssigned";
import RemoveAssignedDialog from "../components/subjectInfo/RemoveAssignedDialog";

function SubjectInfoPage() {
  const location = useLocation();
  const { subjectId, progSubId } = location.state;

  const [info, setInfo] = useState({});
  const [assigned, setAssigned] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [inchargeDialog, setInchargeDialog] = useState(false);
  const [addLessonDialog, setAddLessonDialog] = useState(false);

  // assign faculaty
  const [assignDialog, setAssignDialog] = useState(false);

  // remove assign faculty
  const [removeAssignDialog, setRemoveAssignDialog] = useState(false);

  // edit lesson
  const [selectedLesson, setSelectedLesson] = useState({ id: "", name: "" });
  // remove lesson
  const [removeLessonDialog, setRemoveLessonDialog] = useState(false);

  useEffect(() => {
    fetchInfo();
    fetchAssigned();
    fetchLesson();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_subject" },
        (payload) => {
          fetchInfo();
        }
      )
      .subscribe();

    supabase
      .channel("assigned-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_faculty_subject" },
        (payload) => {
          fetchAssigned();
        }
      )
      .subscribe();

    supabase
      .channel("lesson-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_lesson" },
        (payload) => {
          fetchLesson();
        }
      )
      .subscribe();
  }, []);

  const fetchInfo = async () => {
    const { data: infoData, error: infoErr } = await supabase
      .from("tbl_subject")
      .select(
        "id, name, subject_code, tbl_department(id,shorthand_name), tbl_users(id, suffix, f_name, m_name, l_name)"
      )
      .eq("id", subjectId)
      .single();

    if (infoErr) {
      console.log("error info:", infoErr);
      return;
    }
    setInfo(infoData);
  };

  const fetchAssigned = async () => {
    const { data: assignedData, error: assignedErr } = await supabase
      .from("vw_facultysubject")
      .select("*")
      .eq("subject_id", subjectId);

    if (assignedErr) {
      console.log("error assigned:", assignedErr);
      return;
    }

    setAssigned(assignedData);
  };

  const fetchLesson = async () => {
    const { data: lessonData, eror: lessonErr } = await supabase
      .from("tbl_lesson")
      .select("*")
      .eq("subject_id", subjectId);

    if (lessonErr) {
      console.log("error lesson:", lessonErr);
      return;
    }

    setLesson(lessonData);
    // console.log("sakses lesson:", lessonData);
  };

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <div className="mb-6">
        <h1 className="text-5xl font-semibold mb-2">Subject Information</h1>
        {/* <p className="text-gray-600">
          Organize class schedules, assignments, and analytics in one place.
        </p> */}
      </div>

      <Grid container spacing={2} mb={5}>
        <Grid flex={2}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Subject Name
            </Typography>
            <Typography variant="body1">{info.name}</Typography>
          </Paper>
        </Grid>
        <Grid flex={1}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Subject Code
            </Typography>
            <Typography variant="body1">{info.subject_code}</Typography>
          </Paper>
        </Grid>

        <Grid flex={1}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Department
            </Typography>
            <Typography variant="body1">
              {info.tbl_department?.shorthand_name}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="space-between" mb={1} px={2}>
        <Typography variant="h5" fontWeight="bold">
          Faculty Incharge
        </Typography>
        <Stack direction="row" columnGap={2}>
          <Button
            variant="contained"
            size="small"
            color="success"
            disableElevation
            onClick={() => setInchargeDialog(true)}
          >
            Assign
          </Button>
        </Stack>
      </Stack>
      {info.tbl_users ? (
        <Card variant="outlined" sx={{ py: 1, px: 2 }}>
          <Typography variant="body2">
            {info.tbl_users.suffix} {info.tbl_users.f_name}{" "}
            {info.tbl_users.m_name} {info.tbl_users.l_name}
          </Typography>
        </Card>
      ) : (
        <Typography align="center" variant="body2" color="textDisabled">
          No faculty incharge yet.
        </Typography>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={1}
        px={2}
        mt={4}
      >
        <Typography variant="h5" fontWeight="bold">
          Faculty Assigned
        </Typography>
        <Stack direction="row" columnGap={2}>
          <Button
            variant="contained"
            size="small"
            color="success"
            disableElevation
            onClick={() => setAssignDialog(true)}
          >
            Add
          </Button>
          {assigned.length != 0 && (
            <Button
              size="small"
              color="error"
              variant="contained"
              disableElevation
              onClick={() => setRemoveAssignDialog(true)}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>
      {assigned.length == 0 ? (
        <Typography align="center" variant="body2" color="textDisabled">
          No faculty assigned yet.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assigned.map((data, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data.fullname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        mb={1}
        px={2}
        mt={4}
      >
        <Typography variant="h5" fontWeight="bold">
          Lessons
        </Typography>
        <Stack direction="row" columnGap={2}>
          <Button
            variant="contained"
            size="small"
            color="success"
            disableElevation
            onClick={() => setAddLessonDialog(true)}
          >
            Add
          </Button>
          {lesson.length != 0 && (
            <Button
              size="small"
              color="error"
              variant="contained"
              disableElevation
              onClick={() => setRemoveLessonDialog(true)}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>
      {lesson.length == 0 ? (
        <Typography align="center" variant="body2" color="textDisabled">
          No lesson added yet.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lesson.map((data, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data.title}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      disableElevation
                      onClick={() =>
                        setSelectedLesson({ id: data.id, name: data.title })
                      }
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <InchargeDialog
        open={inchargeDialog}
        setOpen={setInchargeDialog}
        subjectId={subjectId}
      />

      <AddLessonDialog
        open={addLessonDialog}
        setOpen={setAddLessonDialog}
        subjectId={subjectId}
        subjectName={info.name}
      />
      <EditLessonDialog
        set={setSelectedLesson}
        selectedLesson={selectedLesson}
      />

      <RemoveLessonDialog
        open={removeLessonDialog}
        setOpen={setRemoveLessonDialog}
        subjectId={subjectId}
      />

      <AddAssigned
        open={assignDialog}
        setOpen={setAssignDialog}
        subjectId={subjectId}
        departmentId={info.tbl_department?.id}
        progSubId={progSubId}
      />

      <RemoveAssignedDialog
        open={removeAssignDialog}
        setOpen={setRemoveAssignDialog}
        progSubId={progSubId}
      />
    </Container>
  );
}

export default SubjectInfoPage;
