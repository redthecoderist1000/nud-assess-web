import {
  Button,
  Card,
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
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AssignSubjectDialog from "../components/AssignSubjectDialog";
import RemoveSubjectDialog from "../components/RemoveSubjectDialog";
import DisableAiDialog from "../components/DisableAiDialog";
import { userContext } from "../../../App";

function FacultyInfo() {
  const navigate = useNavigate();
  const { setSnackbar } = useContext(userContext);
  const [searchParam] = useSearchParams();
  const facultyId = searchParam.get("facultyId");

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
      setSnackbar({
        open: true,
        message: "Error fetching faculty info",
        severity: "error",
      });
      navigate(-1);
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

  const fetchData = async () => {
    const { data, error } = await supabase
      .rpc("get_facultyinformation", {
        p_faculty_id: facultyId,
      })
      .single();

    if (error) {
      console.log("Failed to fetch data:", error);
      return;
    }
    // console.log(data);
    setInfo(data.faculty_info);
    setLoad(data.subject_load);
  };

  useEffect(() => {
    fetchData();

    const faculty_channel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_faculty_subject",
          filter: `faculty_id=eq.${facultyId}`,
        },
        (payload) => {
          // fetchLoad();
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_users",
          filter: `id=eq.${facultyId}`,
        },
        (payload) => {
          // fetchInfo();
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(faculty_channel);
    };
  }, []);

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Faculty Information
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Manage faculty and assign subjects.
        </p>
      </div>
      <Stack spacing={3}>
        {/* info */}
        <Grid container spacing={2} m>
          <Grid flex={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="caption" fontWeight="bold">
                Name
              </Typography>
              <Typography variant="body1">{`${info.full_name}`}</Typography>
            </Paper>
          </Grid>
          <Grid flex={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="caption" fontWeight="bold">
                Email
              </Typography>
              <Typography variant="body1">{info.email}</Typography>
            </Paper>
          </Grid>
          <Grid flex={1}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="caption" fontWeight="bold">
                Department
              </Typography>
              <Typography variant="body1">{info.dept_shortname}</Typography>
            </Paper>
          </Grid>
          <Grid flex={1}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="caption" fontWeight="bold">
                Role
              </Typography>
              <Typography variant="body1">{info.role}</Typography>
            </Paper>
          </Grid>
          <Grid flex={1}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="caption" fontWeight="bold">
                Total Load
              </Typography>
              <Typography variant="body1">{load.length}</Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* load */}
        <Card variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
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
          {load.length == 0 ? (
            <Typography align="center" variant="body2" color="textDisabled">
              No assigned subject yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
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
                      <TableCell>{data.subject_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
        {/* settings */}
        <Card variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
          <Stack rowGap={2}>
            <Typography variant="h5" fontWeight="bold">
              Additional Settings
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" alignSelf="center">
                {!info.role == "Faculty" ? "Promote" : "Disable"}
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
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" alignSelf="center">
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
            </Stack>
          </Stack>
        </Card>
      </Stack>

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
