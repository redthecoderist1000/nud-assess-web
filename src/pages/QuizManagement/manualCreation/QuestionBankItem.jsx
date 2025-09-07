import { ListItemButton, Stack, Typography } from "@mui/material";
import React from "react";

function QuestionBankItem({ data, onClick }) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Stack rowGap={1} width={"100%"}>
        <Typography variant="caption" color="textDisabled" fontWeight={600}>
          {data.lesson_name}
        </Typography>
        <Typography variant="body1">{data.question}</Typography>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant="caption" color="textDisabled" fontWeight={600}>
            {data.cognitive_level}
          </Typography>
          <Typography variant="caption" color="textDisabled" fontWeight={600}>
            {data.question_type}
          </Typography>
        </Stack>

        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant="caption" color="textDisabled">
            Created by: {data.created_by}
          </Typography>
          <Typography variant="caption" color="textDisabled">
            Use count: {data.usage}
          </Typography>
        </Stack>
      </Stack>
    </ListItemButton>
  );
}

export default QuestionBankItem;
