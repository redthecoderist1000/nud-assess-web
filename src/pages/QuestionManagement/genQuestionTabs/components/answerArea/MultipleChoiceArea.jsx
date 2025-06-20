import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { useContext } from "react";
import { questionContext } from "../../CustomTab";

function MultipleChoiceArea(props) {
  const { index } = props; // question index
  const { items, setItems } = useContext(questionContext);

  const addOption = () => {
    setItems(
      items.map((d, i) =>
        i == index
          ? {
              ...items[index],
              answers: [
                ...items[index].answers,
                {
                  answer: "",
                  is_correct: false,
                },
              ],
            }
          : d
      )
    );
  };

  const changeSelected = (a_index) => {
    const newItem = items.map((items, i_index) => {
      if (i_index == index) {
        const newAnswers = items.answers.map((ans, ai) =>
          ai == a_index
            ? { ...ans, is_correct: !ans.is_correct }
            : { ...ans, is_correct: false }
        );
        return { ...items, answers: newAnswers };
      }
      return items;
    });
    setItems(newItem);
  };

  const changeOption = (value, a_index) => {
    const newItem = items.map((items, i_index) => {
      if (i_index == index) {
        const newAnswers = items.answers.map((ans, ai) =>
          ai == a_index ? { ...ans, answer: value } : ans
        );
        return { ...items, answers: newAnswers };
      }
      return items;
    });
    setItems(newItem);
  };

  const removeOption = (q_index, a_index) => {
    const newItem = items.map((items, i_index) => {
      if (i_index == q_index) {
        const newAnswers = items.answers.filter((_, ai) =>
          ai == a_index ? false : true
        );
        return { ...items, answers: newAnswers };
      }
      return items;
    });

    setItems(newItem);
  };

  return (
    <Stack>
      <FormControl>
        <Stack spacing={1}>
          {items[index].answers.map((data, a_index) => {
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
                  onChange={(e) => {
                    changeOption(e.target.value, a_index);
                  }}
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

export default MultipleChoiceArea;
