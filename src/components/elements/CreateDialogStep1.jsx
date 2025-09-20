import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useContext } from "react";

import ShuffleIcon from "@mui/icons-material/Shuffle";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { userContext } from "../../App";

function CreateDialogStep1({ onChoose }) {
  const { user } = useContext(userContext);

  return (
    <Stack spacing={2}>
      <Box
        component="button"
        onClick={() => onChoose(0, "Random")}
        sx={{
          textAlign: "left",
          bgcolor: "#f8fafc",
          border: "2px solid #e5e7eb",
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
          transition: "border-color 0.2s",
          "&:hover": { borderColor: "#3b82f6", bgcolor: "#eff6ff" },
          boxShadow: 0,
        }}
      >
        <Avatar sx={{ bgcolor: "#3b82f6", width: 40, height: 40 }}>
          <ShuffleIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color="#2563eb">
            Random Bank
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use random questions from the bank to create a comprehensive quiz
          </Typography>
        </Box>
      </Box>
      <Box
        component="button"
        onClick={() => onChoose(0, "AI-Generated")}
        disabled={!user.allow_ai}
        sx={{
          width: "100%",
          textAlign: "left",
          bgcolor: "#f8fafc",
          border: "2px solid #e5e7eb",
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: user.allow_ai ? "pointer" : "not-allowed",
          opacity: user.allow_ai ? 1 : 0.6,
          transition: "border-color 0.2s",
          "&:hover": user.allow_ai
            ? { borderColor: "#059669", bgcolor: "#ecfdf5" }
            : {},
          boxShadow: 0,
        }}
      >
        <Avatar sx={{ bgcolor: "#059669", width: 40, height: 40 }}>
          <AutoAwesomeRoundedIcon />
        </Avatar>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color={user.allow_ai ? "#059669" : "text.disabled"}
          >
            AI-Generated
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use AI to create a customized set of questions based on your
            requirements
          </Typography>
          {!user.allow_ai && (
            <Typography variant="caption" color="text.disabled">
              [Disabled by your admin]
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        component="button"
        onClick={() => onChoose(0, "Manual")}
        sx={{
          width: "100%",
          textAlign: "left",
          bgcolor: "#f8fafc",
          border: "2px solid #e5e7eb",
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
          opacity: 1,
          transition: "border-color 0.2s",
          "&:hover": { borderColor: "#96057eff", bgcolor: "#ffebfcff" },
          boxShadow: 0,
        }}
      >
        <Avatar sx={{ bgcolor: "#96057eff", width: 40, height: 40 }}>
          <SettingsSuggestRoundedIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color={"#96057eff"}>
            Manual Creation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your own quiz by selecting questions from the question bank.
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export default CreateDialogStep1;
