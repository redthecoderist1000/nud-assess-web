import {
  Button,
  Card,
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
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function ItemAnalysisQuiz(props) {
  const { class_exam_id, exam_name } = props;
  const [itemAnalysis, setItemAnalysis] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: itemAnalysisData, error: itemAnalysisErr } = await supabase
      .from("vw_itemanalysisperquiz")
      .select("*")
      .eq("class_exam_id", class_exam_id);

    if (itemAnalysisErr) {
      console.log("error fetching item analysis:", itemAnalysisErr);
    }
    setItemAnalysis(itemAnalysisData);
  };

  const dlCsv = () => {
    const text = exam_name;
    let filename = text.replaceAll(" ", "_");

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `${filename}_item_analysis`,
    });

    const data = itemAnalysis.map((data) => {
      return {
        Question: data.question,
        Correct: data.correct,
        Incorrect: data.in_correct,
      };
    });

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" mb={2} justifyContent="space-between">
        <h2 className="text-2xl font-bold ">Item Analysis</h2>

        <IconButton size="small" onClick={dlCsv}>
          <PrintRoundedIcon />
        </IconButton>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Question</b>
              </TableCell>
              <TableCell align="right">
                <b>Correct</b>
              </TableCell>
              <TableCell align="right">
                <b>Incorrect</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemAnalysis.map((row, index) => (
              <TableRow key={index} sx={{ border: 0 }}>
                <TableCell component="th" scope="row">
                  {row.question}
                </TableCell>
                <TableCell align="right">{row.correct}</TableCell>
                <TableCell align="right">{row.in_correct}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ItemAnalysisQuiz;
