import { Stack, Typography } from "@mui/material";

function QuestionDetailItem({ title, body }) {
  return (
    <Stack direction="row" columnGap={1}>
      <Typography variant="body2" fontWeight={600}>
        {title}:
      </Typography>
      <Typography variant="body2">{body}</Typography>
    </Stack>
  );
}

export default QuestionDetailItem;
