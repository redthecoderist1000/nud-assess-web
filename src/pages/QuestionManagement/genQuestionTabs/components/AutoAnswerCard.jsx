import {
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
import React from "react";
import MultipleChoiceArea2 from "./answerCard2.jsx/MultipleChoiceArea2";

function AutoAnswerCard(props) {
  const { question, index } = props;
  const deleteItem = (index) => {};

  const handleChangeItem = (e, index) => {};

  let qType;

  switch (question.type) {
    case "Multiple Choice":
      qType = <MultipleChoiceArea2 index={index} />;
      break;
    case "Identification":
      qType = <></>;
      break;
    case "T/F":
      qType = <></>;
      break;
    default:
      qType = <MultipleChoiceArea2 index={index} answers={question.answers} />;
      break;
  }

  return (
    <Stack>
      <Grid container direction="row" columnGap={1}>
        <Grid flex={3}>
          <Card variant="outlined" sx={{ p: 3 }}>
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
                  value={question.question}
                  required
                  name="question"
                  onChange={(e) => handleChangeItem(e, index)}
                />
              </Grid>
              <Grid flex={1}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="selectSpecLabel">Cognitive Level</InputLabel>
                  <Select
                    labelId="selectSpecLabel"
                    label="Cognitive Level"
                    value={question.specification}
                    name="specification"
                    onChange={(e) => handleChangeItem(e, index)}
                  >
                    <MenuItem value="Remembering">Remembering</MenuItem>
                    <MenuItem value="Creating">Creating</MenuItem>
                    <MenuItem value="Analyzing">Analyzing</MenuItem>
                    <MenuItem value="Evaluating">Evaluating</MenuItem>
                    <MenuItem value="Applying">Applying</MenuItem>
                    <MenuItem value="Understanding">Understanding</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid flex={1}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="selectTypeLabel">Type</InputLabel>
                  <Select
                    labelId="selectTypeLabel"
                    label="Type"
                    value={question.type}
                    defaultValue="Multiple Choice"
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
            {qType}
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default AutoAnswerCard;
