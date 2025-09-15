import {
  Button,
  FormControl,
  IconButton,
  Radio,
  Stack,
  TextField,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import React from "react";

function MultipleChoiceArea2(props) {
  const { index, answers } = props; // question index

  const changeSelected = (a_index) => {};

  const changeOption = (value, a_index) => {};

  const removeOption = (q_index, a_index) => {};

  const addOption = () => {};

  return (
    <Stack>
      <FormControl>
        <Stack spacing={1}>
          {answers.map((data, a_index) => {
            return (
              <Stack direction="row" key={a_index}>
                <Radio
                  checked={data.is_correct}
                  onClick={() => changeSelected(a_index)}
                  size="small"
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
                <TextField
                  required
                  label={"option " + (a_index + 1)}
                  size="small"
                  value={data.answer}
                  onChange={(e) => changeOption(e.target.value, a_index)}
                />
                <IconButton
                  size="small"
                  onClick={() => removeOption(index, a_index)}
                >
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      </FormControl>

      <div>
        <Button variant="text" size="small" onClick={addOption}>
          add option
        </Button>
      </div>
    </Stack>
  );
}

export default MultipleChoiceArea2;
