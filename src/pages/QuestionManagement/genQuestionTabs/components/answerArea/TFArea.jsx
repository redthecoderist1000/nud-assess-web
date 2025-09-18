import React, { useContext } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { questionContext as AutoContext } from "../../AutoTab";

function TFArea(props) {
  const { index } = props;
  const context = useContext(AutoContext);
  const { items, setItems } = context;

  const setAnswer = (e) => {
    console.log("event:", e.target.value);

    const newAnswer = items.map((d, i) =>
      index == i ? { ...d, answers: { answer: e.target.value } } : d
    );
    setItems(newAnswer);
  };

  return (
    <div>
      <FormControl fullWidth>
        <RadioGroup value={items[index].answers.answer} onClick={setAnswer}>
          <Stack direction="row" justifyContent="space-evenly">
            <FormControlLabel
              value="True"
              control={
                <Radio
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label="True"
            />
            <FormControlLabel
              value="False"
              control={
                <Radio
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label="False"
            />
          </Stack>
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default TFArea;
