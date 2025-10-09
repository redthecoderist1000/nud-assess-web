import {
  Card,
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
import ItemAnalysis_pdf from "../../../components/printables/ItemAnalysis_pdf";
import Export from "../../../components/elements/Export";
import ItemAnalysis_csv from "../../../components/printables/ItemAnalysis_csv";

function ItemAnalysisQuiz(props) {
  const { class_exam_id, exam_info } = props;
  const [itemAnalysis, setItemAnalysis] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchData();

    const classChannel = supabase
      .channel("item-analysis-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_result",
        },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(classChannel);
    };
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
    ItemAnalysis_csv(itemAnalysis, exam_info);
  };

  const dlpdf = () => {
    ItemAnalysis_pdf(itemAnalysis, exam_info);
  };

  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <Stack direction="row" mb={2} justifyContent="space-between">
        <h2 className="text-2xl font-bold ">Item Analysis</h2>

        {itemAnalysis.length > 0 && (
          <Export
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            dlCsv={dlCsv}
            dlPdf={dlpdf}
          />
        )}
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>No.</b>
              </TableCell>
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
            {itemAnalysis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              itemAnalysis.map((row, index) => (
                <TableRow key={index} sx={{ border: 0 }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.question}
                  </TableCell>
                  <TableCell align="right">{row.correct}</TableCell>
                  <TableCell align="right">{row.in_correct}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ItemAnalysisQuiz;
