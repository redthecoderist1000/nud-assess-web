import {
  Box,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MultipleChoiceArea from "./answerArea/MultipleChoiceArea";
import { useContext } from "react";
import { questionContext } from "../CustomTab";
import TFArea from "./answerArea/TFArea";

function AnswerCard(props) {
  const { items, setItems } = useContext(questionContext);
  const { index, data, handleChangeItem } = props;

  let qType;

  switch (data.type) {
    case "Multiple Choice":
      qType = <MultipleChoiceArea index={index} />;
      break;
    case "Identification":
      qType = <p>Identiodicionm</p>;
      break;
    case "T/F":
      qType = <TFArea index={index} />;
      break;
    default:
      qType = <p>nothing</p>;
      break;
  }

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i != index);
    setItems(newItems);
  };

  return (
    <Card key={index} variant="outlined">
      <Box p={3}>
        <Stack direction="row" justifyContent="end">
          {/* <Typography variant="h6">{index + 1}.</Typography> */}
          <IconButton size="small" onClick={() => deleteItem(index)}>
            <DeleteOutlineRoundedIcon />
          </IconButton>
        </Stack>
        <Grid container spacing={4} mb={2}>
          <Grid flex={5}>
            <TextField
              fullWidth
              size="small"
              label="Question"
              value={data.question}
              required
              name="question"
              onChange={(e) => handleChangeItem(e, index)}
            />
          </Grid>

          <Grid flex={1}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="selectSpecLabel">Specification</InputLabel>
              <Select
                labelId="selectSpecLabel"
                label="Specification"
                value={data.blooms_category}
                name="blooms_category"
                onChange={(e) => handleChangeItem(e, index)}
              >
                <MenuItem value="Remembering">Remembering</MenuItem>
                <MenuItem value="Creating">Creating</MenuItem>
                <MenuItem value="Analyzing">Analyzing</MenuItem>
                <MenuItem value="Evaluating">Evaluating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid flex={1}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="selectTypeLabel">Type</InputLabel>
              <Select
                labelId="selectTypeLabel"
                label="Type"
                value={data.type}
                name="type"
                onChange={(e) => handleChangeItem(e, index)}
              >
                <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                <MenuItem value="T/F">True or False</MenuItem>
                <MenuItem value="Identification">Indentification</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* answer area */}
        {qType}
      </Box>
    </Card>
  );
}

export default AnswerCard;
