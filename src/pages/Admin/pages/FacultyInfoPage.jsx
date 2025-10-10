import {
  Button,
  Card,
  CircularProgress,
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
import AssignSubjectDialog from "../components/facultyInfo/AssignSubjectDialog";
import RemoveSubjectDialog from "../components/facultyInfo/RemoveSubjectDialog";
import DisableAiDialog from "../components/facultyInfo/DisableAiDialog";
import { userContext } from "../../../App";
import TransferDeptDialog from "../components/facultyInfo/TransferDeptDialog";
import { BarChart, PieChart } from "@mui/x-charts";
import PromoteDialog from "../components/facultyInfo/PromoteDialog";

function FacultyInfo() {
  const navigate = useNavigate();
  const { setSnackbar } = useContext(userContext);
  const [searchParam] = useSearchParams();
  const facultyId = searchParam.get("facultyId");

  const [info, setInfo] = useState({});
  const [load, setLoad] = useState([]);
  const [questionGen, setQuestionGen] = useState([]);
  const [quizGen, setQuizGen] = useState({});
  const [assignDialog, setAssignDialog] = useState(false);
  const [removeDialog, setRemoveDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [promoteDialog, setPromoteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [disableAi, setDisableAi] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase
      .rpc("get_facultyinformation", {
        p_faculty_id: facultyId,
      })
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch faculty data. Please try again.",
        severity: "error",
      });
      navigate(-1);
      return;
    }

    if (data.faculty_info == null) {
      setSnackbar({
        open: true,
        message: "Faculty information not found.",
        severity: "error",
      });
      navigate(-1);
      return;
    }

    console.log("sakses info:", data.subject_load);
    setInfo(data.faculty_info);
    setLoad(data.subject_load);
    setQuestionGen(data.question_gen);
    setQuizGen(data.quiz_gen);
    setLoading(false);
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
        {loading ? (
          <></>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Grid sx={{ flex: "1 1 300px", minWidth: 250 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="caption" fontWeight="bold">
                  Name
                </Typography>
                <Typography variant="body1">{`${info.full_name}`}</Typography>
              </Paper>
            </Grid>
            <Grid sx={{ flex: "1 1 300px", minWidth: 250 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="caption" fontWeight="bold">
                  Email
                </Typography>
                <Typography variant="body1">{info.email}</Typography>
              </Paper>
            </Grid>
            <Grid sx={{ flex: "1 1 200px", minWidth: 200 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="caption" fontWeight="bold">
                  Department
                </Typography>
                <Typography variant="body1">{info.dept_shortname}</Typography>
              </Paper>
            </Grid>
            <Grid sx={{ flex: "1 1 200px", minWidth: 200 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="caption" fontWeight="bold">
                  Role
                </Typography>
                <Typography variant="body1">{info.role}</Typography>
              </Paper>
            </Grid>
            <Grid sx={{ flex: "1 1 200px", minWidth: 200 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="caption" fontWeight="bold">
                  Total Load
                </Typography>
                <Typography variant="body1">
                  {load ? load.length : 0}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
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
                loading={loading}
              >
                Add
              </Button>
              {load && load.length != 0 && (
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  disableElevation
                  onClick={() => setRemoveDialog(true)}
                  loading={loading}
                >
                  Remove
                </Button>
              )}
            </Stack>
          </Stack>
          {loading ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : load == null ? (
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
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
        {/* geenrate content */}
        <Card variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold">
            Generated Content
          </Typography>
          {loading ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container alignItems={"center"}>
              <Grid flex={3}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                  Questions
                </Typography>
                <BarChart
                  xAxis={[
                    {
                      data:
                        questionGen?.map((data) => data.cognitive_level) ?? [],
                    },
                  ]}
                  series={[
                    {
                      label: "AI Generated",
                      data: questionGen?.map((item) => item?.ai_count) ?? [],
                      color: "#0050a0ff",
                    },
                    {
                      label: "Custom Generated",
                      data:
                        questionGen?.map((item) => item?.custom_count) ?? [],
                      color: "#e08700ff",
                    },
                  ]}
                  grid={{
                    horizontal: { show: true },
                    vertical: { show: false },
                  }}
                  borderRadius={5}
                  height={300}
                />
              </Grid>
              <Grid flex={2}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                  Quizzes
                </Typography>
                <PieChart
                  height={300}
                  series={[
                    {
                      data:
                        quizGen.ai_count +
                          quizGen.random_count +
                          quizGen.manual_count ==
                        0
                          ? []
                          : [
                              {
                                id: 0,
                                value: quizGen.ai_count,
                                label: `AI Generated (${quizGen.ai_count})`,
                                color: "#0050a0ff",
                              },
                              {
                                id: 1,
                                value: quizGen.random_count,
                                label: `Random Generated (${quizGen.random_count})`,
                                color: "#8300a3ff",
                              },
                              {
                                id: 2,
                                value: quizGen.manual_count,
                                label: `Manual Generated (${quizGen.manual_count})`,
                                color: "#e08700ff",
                              },
                            ],
                    },
                  ]}
                />
              </Grid>
            </Grid>
          )}
        </Card>
        {/* settings */}
        <Card variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
          <Stack rowGap={2}>
            <Typography variant="h5" fontWeight="bold">
              Additional Settings
            </Typography>

            {loading ? (
              <Stack alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <>
                {/* ai */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      alignSelf="center"
                    >
                      AI Content Generation
                    </Typography>
                    <Typography variant="caption" alignSelf="center">
                      Enable or disable the use of AI for generating content.
                    </Typography>
                  </div>
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
                <Divider />

                {/* transfer dept */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      alignSelf="center"
                    >
                      Transfer department
                    </Typography>
                    <Typography variant="caption" alignSelf="center">
                      Transfer faculty to another department.
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    disableElevation
                    onClick={() => setTransferDialog(true)}
                  >
                    Transfer
                  </Button>
                </Stack>
                <Divider />
                {/* admin privilege */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      alignSelf="center"
                    >
                      Administrator access
                    </Typography>
                    <Typography variant="caption" alignSelf="center">
                      Give or revoke admin access
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    color={info.role == "Faculty" ? "success" : "error"}
                    disableElevation
                    onClick={() => setPromoteDialog(true)}
                  >
                    {info.role == "Faculty" ? "promote" : "revoke"}
                  </Button>
                </Stack>
              </>
            )}
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
        fetchData={fetchData}
      />
      <DisableAiDialog
        open={disableAi}
        setOpen={setDisableAi}
        facultyId={facultyId}
        name={info.full_name}
        allowAi={info.allow_ai}
      />

      <TransferDeptDialog
        open={transferDialog}
        setOpen={setTransferDialog}
        selectedFaculty={facultyId}
        currDept={info.dept_id}
      />

      <PromoteDialog
        open={promoteDialog}
        setOpen={setPromoteDialog}
        facultyId={facultyId}
        name={info.full_name}
        role={info.role}
      />
    </Container>
  );
}

export default FacultyInfo;
