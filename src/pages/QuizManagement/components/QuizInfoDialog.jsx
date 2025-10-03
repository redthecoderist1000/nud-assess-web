import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import TOS_pdf_export from "../../../components/printables/TOS_pdf";
import Exam_pdf from "../../../components/printables/Exam_pdf";
import ExamKey_pdf from "../../../components/printables/ExamKey_pdf";
import Export from "../../../components/elements/Export";
import TOS_csv_export from "../../../components/printables/TOS_csv";
import ImagePreview from "./resultPage/ImagePreview";
import { userContext } from "../../../App";

const TosTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quizinfo-tabpanel-${index}`}
      aria-labelledby={`quizinfo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const QuizInfoDialog = ({ openInfo, setOpen }) => {
  const { setSnackbar } = useContext(userContext);
  const handleClose = () => {
    setOpen({ open: false, exam_id: null });
  };
  const [value, setValue] = useState(0);
  const [data, setData] = useState(null);
  const [tosAnchor, setTosAnchor] = useState(null);
  const [questionAnchor, setQuestionAnchor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgPrev, setImagePrev] = useState({ open: false, image: null });

  useEffect(() => {
    if (!openInfo.open) {
      setLoading(true);
      setValue(0);
      setData(null);
      return;
    }
    fetchData();
  }, [openInfo.open]);

  const fetchData = async () => {
    try {
      const { data: exam_data, error } = await supabase
        .rpc("get_exam_info", { p_exam_id: openInfo.exam_id })
        .single();

      if (error) {
        setSnackbar({
          open: true,
          message: "Error fetching exam data",
        });
        return;
      }

      if (exam_data.exam?.length > 0) {
        const examWithImages = await Promise.all(
          exam_data.exam.map(async (item) => {
            const imageUrl = item.image
              ? await fetchImage(item.image).catch(() => null)
              : null;
            return { ...item, image: imageUrl };
          })
        );

        exam_data.exam = examWithImages;
      }

      setData(exam_data);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const summarizeLessons = (rows) => {
    const summary = {
      hours: 0,
      percentage: 0,
      remembering: 0,
      understanding: 0,
      applying: 0,
      analyzing: 0,
      creating: 0,
      evaluating: 0,
      totalItems: 0,
    };

    rows.forEach((rows) => {
      summary.hours += parseFloat(rows.hours);
      summary.percentage += parseFloat(rows.percentage);
      summary.remembering += rows.remembering;
      summary.understanding += rows.understanding;
      summary.applying += rows.applying;
      summary.analyzing += rows.analyzing;
      summary.creating += rows.creating;
      summary.evaluating += rows.evaluating;
      summary.totalItems += rows.totalItems;
    });

    return summary;
  };

  const tosTotal = summarizeLessons(data?.tos || []);

  const exportTOSpdf = () => {
    TOS_pdf_export(data?.tos || [], data?.exam_details.name || "Quiz");
  };

  const exportTOScsv = () => {
    TOS_csv_export(data?.tos || [], data?.exam_details.name || "Quiz");
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const export_Exam = () => {
    const forExport = data.exam;
    if (data.exam_details.is_random) {
      shuffleArray(forExport);
    }

    Exam_pdf(forExport, data.exam_details);
    ExamKey_pdf(forExport, data.exam_details);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchImage = async (image) => {
    const { data: imageData } = await supabase.storage
      .from("question_image")
      .createSignedUrl(image, 3600);

    return imageData?.signedUrl;
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openInfo.open}
        onClose={handleClose}
        aria-labelledby="quiz-info-title"
        aria-describedby="quiz-info-content"
      >
        <DialogTitle id="quiz-info-title">Quiz Information</DialogTitle>

        <DialogContent>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" m={5}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              {/* details */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Exam Name
                    </Typography>
                    <Typography variant="body1">
                      {data.exam_details.name}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Subject
                    </Typography>
                    <Typography variant="body1">
                      {data.exam_details.subject}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Mode
                    </Typography>
                    <Typography variant="body1">
                      {data.exam_details.mode}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Created By
                    </Typography>
                    <Typography variant="body1">
                      {data.exam_details.created_by}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="caption" fontWeight="bold">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {data.exam_details.created_at}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />
                <Grid container>
                  <Grid flex={3}>
                    <Stack>
                      <Typography variant="caption" fontWeight="bold">
                        Description
                      </Typography>
                      <Stack maxHeight={100} overflow="auto">
                        <Typography variant="body2">
                          {data.exam_details.desciption ?? "No description"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid flex={3}>
                    <Stack>
                      <Typography variant="caption" fontWeight="bold">
                        Objective
                      </Typography>
                      <Stack maxHeight={100} overflow="auto">
                        <Typography variant="body2">
                          {data.exam_details.objective ?? "No objective"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid container>
                  <Grid flex={1}>
                    <Stack>
                      <Typography variant="caption" fontWeight="bold">
                        Total Items
                      </Typography>
                      <Typography variant="body2">
                        {data.exam_details.total_items}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid flex={1}>
                    <Stack>
                      <Typography variant="caption" fontWeight="bold">
                        Time Limit (mins)
                      </Typography>
                      <Typography variant="body2">
                        {data.exam_details.time_limit ?? "No time limit"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid flex={1}>
                    <Stack>
                      <Typography variant="caption" fontWeight="bold">
                        Shuffled Items
                      </Typography>
                      <Typography variant="body2">
                        {data.exam_details.is_random ? "True" : "False"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid flex={1}>
                    <Stack>
                      <Typography variant="caption" fontWeight="bold">
                        Allow Review
                      </Typography>
                      <Typography variant="body2">
                        {data.exam_details.allow_review ? "True" : "False"}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
              {/* tab bar */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="quiz info tabs"
                >
                  <Tab label="TOS" />
                  <Tab
                    label="Questions"
                    disabled={data?.exam == null || data?.exam.length === 0}
                  />
                </Tabs>
              </Box>
              {/* tab panels */}
              <CustomTabPanel value={value} index={0}>
                <Stack alignItems="end">
                  <Export
                    anchorEl={tosAnchor}
                    setAnchorEl={setTosAnchor}
                    dlCsv={exportTOScsv}
                    dlPdf={exportTOSpdf}
                  />
                </Stack>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TosTableCell rowSpan={2}>
                          <b>Lesson</b>
                        </TosTableCell>
                        <TosTableCell rowSpan={2}>
                          <b>Hours</b>
                        </TosTableCell>
                        <TosTableCell rowSpan={2}>
                          <b>Percentage</b>
                        </TosTableCell>
                        <TosTableCell colSpan={2} bgcolor="#e3f2fd">
                          <b>EASY</b>
                        </TosTableCell>
                        <TosTableCell colSpan={2} bgcolor="#fffde7">
                          <b>MEDIUM</b>
                        </TosTableCell>
                        <TosTableCell colSpan={2} bgcolor="#ffebee">
                          <b>HARD</b>
                        </TosTableCell>
                        <TosTableCell rowSpan={2}>
                          <b>Total Items</b>
                        </TosTableCell>
                      </TableRow>
                      <TableRow>
                        <TosTableCell bgcolor="#e3f2fd">
                          <b>Remembering (30%)</b>
                        </TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">
                          <b>Understanding (20%)</b>
                        </TosTableCell>
                        <TosTableCell bgcolor="#fffde7">
                          <b>Applying (20%)</b>
                        </TosTableCell>
                        <TosTableCell bgcolor="#fffde7">
                          <b>Analyzing (10%)</b>
                        </TosTableCell>
                        <TosTableCell bgcolor="#ffebee">
                          <b>Creating (10%)</b>
                        </TosTableCell>
                        <TosTableCell bgcolor="#ffebee">
                          <b>Evaluating (10%)</b>
                        </TosTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data != null &&
                        data.tos.map((row, index) => (
                          <TableRow key={index}>
                            <TosTableCell>{row.topic}</TosTableCell>
                            <TosTableCell>{row.hours}</TosTableCell>
                            <TosTableCell>{row.percentage} %</TosTableCell>
                            <TosTableCell bgcolor="#e3f2fd">
                              {row.remembering}
                            </TosTableCell>
                            <TosTableCell bgcolor="#e3f2fd">
                              {row.understanding}
                            </TosTableCell>
                            <TosTableCell bgcolor="#fffde7">
                              {row.applying}
                            </TosTableCell>
                            <TosTableCell bgcolor="#fffde7">
                              {row.analyzing}
                            </TosTableCell>
                            <TosTableCell bgcolor="#ffebee">
                              {row.creating}
                            </TosTableCell>
                            <TosTableCell bgcolor="#ffebee">
                              {row.evaluating}
                            </TosTableCell>
                            <TosTableCell>{row.totalItems}</TosTableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TosTableCell>
                          <b>Total</b>
                        </TosTableCell>
                        <TosTableCell>{tosTotal.hours}</TosTableCell>
                        <TosTableCell>100%</TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">
                          {tosTotal.remembering}
                        </TosTableCell>
                        <TosTableCell bgcolor="#e3f2fd">
                          {tosTotal.understanding}
                        </TosTableCell>
                        <TosTableCell bgcolor="#fffde7">
                          {tosTotal.applying}
                        </TosTableCell>
                        <TosTableCell bgcolor="#fffde7">
                          {tosTotal.analyzing}
                        </TosTableCell>
                        <TosTableCell bgcolor="#ffebee">
                          {tosTotal.creating}
                        </TosTableCell>
                        <TosTableCell bgcolor="#ffebee">
                          {tosTotal.evaluating}
                        </TosTableCell>
                        <TosTableCell bgcolor="#e0e0e0">
                          {tosTotal.totalItems}
                        </TosTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Stack alignItems={"end"}>
                  <Export
                    anchorEl={questionAnchor}
                    setAnchorEl={setQuestionAnchor}
                    dlPdf={export_Exam}
                  />
                </Stack>
                <Stack maxHeight={500} overflow="auto">
                  {data != null &&
                    data.exam != null &&
                    data.exam.map((item, index) => {
                      return (
                        <Accordion
                          key={index}
                          disableGutters
                          variant="outlined"
                        >
                          <AccordionSummary>
                            {/* <Stack alignItems={"start"}> */}
                            {item.image != null && (
                              <Tooltip
                                title="Click to preview image"
                                placement="top"
                                arrow
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setImagePrev({
                                      open: true,
                                      image: item.image,
                                    });
                                  }}
                                >
                                  <img
                                    src={item.image}
                                    alt={`question ${index + 1} image preview`}
                                    style={{
                                      height: 30,
                                      width: 30,
                                      objectFit: "cover",
                                      marginRight: 10,
                                      borderRadius: 5,
                                      cursor: "pointer",
                                      pointerEvents: "auto",
                                    }}
                                  />
                                </div>
                              </Tooltip>
                            )}
                            <Typography variant="body2">
                              {index + 1}. {item.question}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {item.type === "Multiple Choice" ? (
                              <Stack spacing={1} ml={2}>
                                <Typography
                                  variant="caption"
                                  color="textDisabled"
                                >
                                  Options:
                                </Typography>
                                {item.answers.map((ans, idx) => {
                                  return (
                                    <Typography
                                      key={idx}
                                      variant="body2"
                                      fontWeight={ans.is_correct ? 600 : 400}
                                      color={
                                        ans.is_correct ? "green" : "inherit"
                                      }
                                    >
                                      {ans.answer}
                                    </Typography>
                                  );
                                })}
                              </Stack>
                            ) : (
                              <Typography
                                variant="body2"
                                color="green"
                                fontWeight={600}
                              >
                                Correct Answer: {item.answers[0].answer}
                              </Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </Stack>
              </CustomTabPanel>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "left" }}>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
        <ImagePreview imgPrev={imgPrev} setImagePrev={setImagePrev} />
      </Dialog>
    </>
  );
};

export default QuizInfoDialog;
