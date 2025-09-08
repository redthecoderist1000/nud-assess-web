import { Stack } from "@mui/material";
import React from "react";

function NewQuestionTab({ hidden }) {
  return (
    <div hidden={hidden}>
      <Stack spacing={1} p={3}>
        New Question Tab
      </Stack>
    </div>
  );
}

export default NewQuestionTab;
