import { Stack, Typography } from "@mui/material";
import React from "react";

function TFArea(props) {
  const { items, qIndex, setItems, hasId } = props;

  return (
    <Stack direction="row">
      <Typography color="textDisabled">Answer:</Typography>
      <Typography fontWeight="bold" color="textDisabled">
        {items[0].answer}
      </Typography>
    </Stack>
  );
}

export default TFArea;
