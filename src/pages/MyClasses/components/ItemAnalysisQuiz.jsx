import {
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import CalendarViewMonthRoundedIcon from "@mui/icons-material/CalendarViewMonthRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import SystemUpdateAltRoundedIcon from "@mui/icons-material/SystemUpdateAltRounded";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function ItemAnalysisQuiz(props) {
  const { class_exam_id, exam_name } = props;
  const [itemAnalysis, setItemAnalysis] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

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
    let filename = exam_name.replaceAll(" ", "_");

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `${filename}_item_analysis_${new Date().toISOString().split("T")[0]}`, // Add date
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: `Item Analysis Report - ${exam_name}`,
      useTextFile: false,
      useBom: true,
      headers: ["Question", "Correct", "Incorrect", "Success %"],
    });

    const data = itemAnalysis
      .sort(
        (a, b) =>
          b.correct / (b.correct + b.in_correct) -
          a.correct / (a.correct + a.in_correct)
      )
      .map((data, index) => {
        return {
          Question: data.question,
          Correct: data.correct,
          Incorrect: data.in_correct,
          "Success Rate": `${((data.correct / (data.correct + data.in_correct)) * 100).toFixed(1)}%`,
        };
      });

    // Add summary row
    const totalCorrect = itemAnalysis.reduce(
      (sum, item) => sum + item.correct,
      0
    );
    const totalIncorrect = itemAnalysis.reduce(
      (sum, item) => sum + item.in_correct,
      0
    );

    data.push({
      Question: "TOTAL",
      Correct: totalCorrect,
      Incorrect: totalIncorrect,
    });

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };
  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <Stack direction="row" mb={2} justifyContent="space-between">
        <h2 className="text-2xl font-bold ">Item Analysis</h2>

        <Tooltip title="Export" placement="top" arrow>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <SystemUpdateAltRoundedIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <ListItemButton onClick={dlCsv} dense>
            <ListItemIcon>
              <CalendarViewMonthRoundedIcon color="success" />
            </ListItemIcon>
            <ListItemText primary=".csv" />
          </ListItemButton>
          <ListItemButton onClick={() => {}} dense>
            <ListItemIcon>
              <PictureAsPdfRoundedIcon color="error" />
            </ListItemIcon>
            <ListItemText primary=".pdf" />
          </ListItemButton>
        </Menu>
      </Stack>
      {itemAnalysis.length <= 0 ? (
        <Typography align="center" variant="body2" color="textDisabled">
          No data available.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
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
      )}
    </Card>
  );
}

export default ItemAnalysisQuiz;
