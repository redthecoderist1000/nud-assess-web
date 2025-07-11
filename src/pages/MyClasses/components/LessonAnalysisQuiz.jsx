import {
  Card,
  Grid,
  LinearProgress,
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
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function LessonAnalysisQuiz(props) {
  const { class_exam_id } = props;
  const [lessonAnalysis, setLessonAnalysis] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: lessonAnalysisData, error: lessonAnalysisErr } =
      await supabase
        .from("vw_lessonanalysisperquiz")
        .select("*")
        .eq("class_exam_id", class_exam_id);

    if (lessonAnalysisErr) {
      console.log("error fetching lesson analysis:", lessonAnalysisErr);
    }
    setLessonAnalysis(lessonAnalysisData);
  };

  return (
    <Card sx={{ p: 2 }}>
      <h2 className="text-2xl font-bold mb-4">Lesson Analysis</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Lesson</b>
              </TableCell>
              <TableCell align="right">
                <b>Score</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessonAnalysis.map((row, index) => {
              const score = (row.correct / row.count) * 100;

              return (
                <TableRow key={index} sx={{ border: 0 }}>
                  {/* <Grid container spacing={2}>
                    <Grid size={1} border={1}> */}
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  {/* </Grid>
                    <Grid size={1} border={1}> */}
                  <TableCell align="left" width={500}>
                    <LinearProgress
                      value={score}
                      variant="determinate"
                      color={
                        score > 80
                          ? "primary"
                          : score < 50
                            ? "error"
                            : "warning"
                      }
                    />
                    <Typography variant="body2" align="center">
                      {score.toFixed(1)} %
                    </Typography>
                  </TableCell>
                  {/* </Grid>
                  </Grid> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default LessonAnalysisQuiz;
