import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TOS_pdf_export from "../../../components/printables/TOS_pdf";
import Exam_pdf from "../../../components/printables/Exam_pdf";
import ExamKey_pdf from "../../../components/printables/ExamKey_pdf";
import Export from "../../../components/elements/Export";
import TOS_csv_export from "../../../components/printables/TOS_csv";

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
  const handleClose = () => {
    setOpen({ open: false, exam_id: null });
  };
  const [value, setValue] = useState(0);
  const [data, setData] = useState(null);
  const [tosAnchor, setTosAnchor] = useState(null);
  const [questionAnchor, setQuestionAnchor] = useState(null);

  useEffect(() => {
    if (!openInfo.open) {
      setValue(0);
      setData(null);
      return;
    }
    // console.log("fetching...");
    fetchData();
  }, [openInfo.open]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .rpc("get_exam_info", { p_exam_id: openInfo.exam_id })
      .single();

    if (error) {
      //   setOpen({ open: false, exam_id: null });
      console.log(error);
      return;
    }
    setData(data);
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

  return (
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
        <CustomTabPanel value={value} index={0}>
          <Export
            anchorEl={tosAnchor}
            setAnchorEl={setTosAnchor}
            dlCsv={exportTOScsv}
            dlPdf={exportTOSpdf}
          />
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
          <Export
            anchorEl={questionAnchor}
            setAnchorEl={setQuestionAnchor}
            dlPdf={export_Exam}
          />
          <Stack maxHeight={500} overflow="auto">
            {data != null &&
              data.exam != null &&
              data.exam.map((item, index) => {
                return (
                  <Accordion key={index} disableGutters elevation={0}>
                    <AccordionSummary>
                      <Typography variant="body2">
                        {index + 1}. {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {item.type === "Multiple Choice" ? (
                        <Stack spacing={1} ml={2}>
                          <Typography variant="body2">Options:</Typography>
                          {item.answers.map((ans, idx) => {
                            return (
                              <Typography
                                key={idx}
                                variant="body2"
                                fontWeight={ans.is_correct ? 600 : 400}
                                color={ans.is_correct ? "green" : "inherit"}
                              >
                                {ans.answer}
                              </Typography>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Typography variant="body2">
                          Correct Answer: {item.answers[0].answer}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Stack>
        </CustomTabPanel>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "left" }}>
        <Button onClick={handleClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizInfoDialog;
