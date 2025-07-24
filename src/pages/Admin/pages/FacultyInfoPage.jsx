import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
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
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { useLocation } from "react-router-dom";
import AssignSubjectDialog from "../components/AssignSubjectDialog";
import RemoveSubjectDialog from "../components/RemoveSubjectDialog";
import DisableAiDialog from "../components/DisableAiDialog";

function FacultyInfo() {
  const location = useLocation();
  const { facultyId } = location.state;

  const [info, setInfo] = useState({});
  const [load, setLoad] = useState([]);
  const [assignDialog, setAssignDialog] = useState(false);
  const [removeDialog, setRemoveDialog] = useState(false);

  const [disableAi, setDisableAi] = useState(false);

  const fetchInfo = async () => {
    const { data: infoData, error: infoErr } = await supabase
      .from("tbl_users")
      .select(
        "suffix, f_name,m_name,l_name,role,email,tbl_department(name, shorthand_name),allow_ai"
      )
      .eq("id", facultyId)
      .single();

    if (infoErr) {
      console.log("error fetching info:", infoErr);
      return;
    }
    setInfo(infoData);
  };

  const fetchLoad = async () => {
    const { data: loadData, error: loadErr } = await supabase
      .from("vw_facultysubject")
      .select("*")
      .eq("id", facultyId)
      .neq("subject_code", null);

    if (loadErr) {
      console.log("error fetching load:", loadErr);
      return;
    }
    setLoad(loadData);
    // console.log("sakses load:", loadData);
  };

  useEffect(() => {
    fetchInfo();
    fetchLoad();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_faculty_subject" },
        (payload) => {
          fetchLoad();
        }
      )
      .subscribe();

    supabase
      .channel("tbl_users_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_users" },
        (payload) => {
          fetchInfo();
        }
      )
      .subscribe();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <div className="mb-6">
        {/* <Stack direction="row"> */}
        {/* <IconButton size="small">
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton> */}
        <h1 className="text-5xl font-semibold mb-2">Faculty Information</h1>
        {/* </Stack> */}
        {/* <p className="text-gray-600">
          Organize class schedules, assignments, and analytics in one place.
        </p> */}
      </div>

      <Grid container spacing={2} mb={5}>
        <Grid flex={2}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Name
            </Typography>
            <Typography variant="body1">{`${info.suffix} ${info.f_name} ${info.m_name} ${info.l_name}`}</Typography>
          </Paper>
        </Grid>
        <Grid flex={2}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Email
            </Typography>
            <Typography variant="body1">{info.email}</Typography>
          </Paper>
        </Grid>
        <Grid flex={1}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Department
            </Typography>
            <Typography variant="body1">
              {info.tbl_department?.shorthand_name ?? ""}
            </Typography>
          </Paper>
        </Grid>
        <Grid flex={1}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Role
            </Typography>
            <Typography variant="body1">{info.role}</Typography>
          </Paper>
        </Grid>
        <Grid flex={1}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              Total Load
            </Typography>
            <Typography variant="body1">{load.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" mb={1} px={2}>
        <Typography variant="h5" fontWeight="bold">
          Subject Load
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
          {load.length != 0 && (
            <Button
              size="small"
              color="error"
              variant="contained"
              disableElevation
              onClick={() => setRemoveDialog(true)}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Subject Code</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {load.map((data, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{data.subject_code}</TableCell>
                <TableCell>{data.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Divider />
      <Typography variant="h5" fontWeight="bold">
        Created
      </Typography> */}
      {/* <Divider />
      <Stack direction="row" columnGap={4} mt={2}>
        <Typography variant="caption" color="textDisabled" alignSelf="center">
          {!info.allow_ai ? "Enable" : "Disable"} AI privilage?
        </Typography>
        <Button
          variant="contained"
          size="small"
          color={!info.allow_ai ? "success" : "error"}
          disableElevation
          onClick={() => setDisableAi(true)}
        >
          {!info.allow_ai ? "Enable" : "Disable"}
        </Button>
      </Stack> */}

      {/* dialogs */}
      <AssignSubjectDialog
        open={assignDialog}
        setOpen={setAssignDialog}
        selectedFaculty={facultyId}
      />
      <RemoveSubjectDialog
        open={removeDialog}
        setOpen={setRemoveDialog}
        selectedFaculty={facultyId}
      />
      <DisableAiDialog
        open={disableAi}
        setOpen={setDisableAi}
        facultyId={facultyId}
        name={`${info.suffix} ${info.f_name} ${info.m_name} ${info.l_name}`}
        allowAi={info.allow_ai}
      />
    </Container>
  );
}

export default FacultyInfo;
