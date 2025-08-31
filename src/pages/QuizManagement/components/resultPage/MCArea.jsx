import { FormControl, Radio, Stack, TextField } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import React from "react";

function MCArea(props) {
  const { items, qIndex, setItems, hasId } = props;

  const handleChangeAnswer = (e, aIndex) => {
    const { value } = e.target;

    setItems((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const question = next[qIndex] ? { ...next[qIndex] } : { answers: [] };
      const answers = Array.isArray(question.answers)
        ? [...question.answers]
        : [];
      answers[aIndex] = { ...(answers[aIndex] || {}), answer: value };
      question.answers = answers;
      next[qIndex] = question;
      return next;
    });
  };

  const handleSelectCorrect = (aIndex) => {
    setItems((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const question = next[qIndex] ? { ...next[qIndex] } : { answers: [] };
      const answers = (question.answers || []).map((a, i) => ({
        ...(a || {}),
        is_correct: i === aIndex,
      }));
      question.answers = answers;
      next[qIndex] = question;
      return next;
    });
  };

  return (
    <Stack>
      <FormControl>
        <Stack spacing={1}>
          {items.map((data, index) => {
            return (
              <Stack key={index} direction="row">
                <Radio
                  checked={data.is_correct}
                  onClick={(e) => handleSelectCorrect(index)}
                  size="small"
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                  disabled={hasId}
                />
                <TextField
                  multiline
                  fullWidth
                  required
                  label={"option " + (index + 1)}
                  size="small"
                  value={data.answer}
                  onChange={(e) => handleChangeAnswer(e, index)}
                  disabled={hasId}
                />
              </Stack>
            );
          })}
        </Stack>
      </FormControl>
    </Stack>
  );
}

export default MCArea;
