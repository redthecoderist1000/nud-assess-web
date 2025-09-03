import React, { useContext } from "react";
import { userContext } from "../../../App";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import PsychologyIcon from "@mui/icons-material/Psychology";

const QuizModal = (props) => {
  const { isOpen, onClose, onSelectOption } = props;
  const { user } = useContext(userContext);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: { xs: 1, sm: "auto" },
          borderRadius: { xs: 2, sm: 3 },
          width: { xs: "100%", sm: "auto" },
        },
      }}
    >
      <DialogTitle
        align="left"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 0,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
        }}
      >
        <Avatar sx={{ bgcolor: "#3b82f6", width: 32, height: 32 }}>
          <DescriptionIcon />
        </Avatar>
        <Typography fontWeight="bold" variant="h6">
          Create Quiz
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          pt: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={{ xs: 1, sm: 2 }} sx={{ mt: { xs: 1, sm: 3 } }}>
          <Box
            component="button"
            onClick={() => onSelectOption("Random")}
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
            onClick={() => user.allow_ai && onSelectOption("AI-Generated")}
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
              <PsychologyIcon />
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
                Use AI to create a customized set of questions based on your requirements
              </Typography>
              {!user.allow_ai && (
                <Typography variant="caption" color="text.disabled">
                  [Disabled by your admin]
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
        <Divider sx={{ my: 0}} />
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, mt: "-8px"}}>
        <Button onClick={onClose} color="error" size="medium" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizModal;