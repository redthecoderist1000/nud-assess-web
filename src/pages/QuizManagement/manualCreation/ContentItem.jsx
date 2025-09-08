import { Card, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

function ContentItem({ item }) {
  const [collapse, setCollapse] = useState(true);

  // check if all required content are selected
  const allSelected = item.content.every(
    (content) => content.selected == content.required
  );

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" columnGap={1}>
          {allSelected ? (
            <CheckCircleRoundedIcon
              fontSize="small"
              color="success"
              sx={{ fontSize: 15 }}
            />
          ) : (
            <CancelRoundedIcon color="error" sx={{ fontSize: 15 }} />
          )}
          <Typography variant="body2" fontWeight="600" lineHeight={1.2}>
            {item.topic}
          </Typography>
        </Stack>

        <IconButton size="small" onClick={() => setCollapse(!collapse)}>
          {collapse ? (
            <ExpandMoreRoundedIcon fontSize="small" />
          ) : (
            <ExpandLessRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Stack>
      <Collapse in={collapse} timeout="auto" unmountOnExit>
        <Stack mt={1} ml={2}>
          {item.content.map((content, index) => (
            <Stack
              key={index}
              direction={"row"}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Typography variant="body2">{content.cognitive_level}</Typography>
              <Typography variant="caption" color="textDisabled">
                {content.selected} / {content.required}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}

export default ContentItem;
