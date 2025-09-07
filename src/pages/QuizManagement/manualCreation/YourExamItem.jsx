import { Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

function YourExamItem({ data }) {
  const answer = () => {
    if (data.question_type === "Multiple Choice") {
      return data.answer.map((choice, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            backgroundColor: choice.is_correct ? "lightgreen" : "white",
            p: 1,
          }}
        >
          <Typography variant="body2">{choice.answer}</Typography>
        </Card>
      ));
    } else {
      return (
        <Card variant="outlined" sx={{ p: 1 }}>
          <Typography variant="body2">{data.answer[0].answer}</Typography>
        </Card>
      );
    }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body1" fontWeight={600} color="textDisabled">
        {data.lesson_name}
      </Typography>
      <Stack direction="row" justifyContent={"space-between"}>
        <Typography variant="body1" fontWeight={600} color="textDisabled">
          {data.cognitive_level}
        </Typography>
        <Typography variant="body1" fontWeight={600} color="textDisabled">
          {data.question_type}
        </Typography>
      </Stack>
      <Typography variant="h6">{data.question}</Typography>
      {/* answer section */}
      <Stack spacing={0.5}>{answer()}</Stack>
      {/* etc details */}
      <Stack direction="row" justifyContent={"space-between"}>
        <Typography variant="subtitle2" color="textDisabled">
          Created by: {data.created_by}
        </Typography>
        <Typography variant="subtitle2" color="textDisabled">
          Usage count: {data.usage}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default YourExamItem;
