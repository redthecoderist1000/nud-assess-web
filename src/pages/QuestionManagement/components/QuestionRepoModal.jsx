import React, { useContext, useEffect, useState } from "react";
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
import { userContext } from "../../../App";
import { supabase } from "../../../helper/Supabase";

const QuestionRepoModal = (props) => {
  const { isOpen, onClose, onSelect } = props;
  const { user } = useContext(userContext);
  const [isIncharge, setIsIncharge] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_subject")
      .select("id")
      .eq("faculty_incharge", user.user_id);

    if (error) {
      console.log("error fetching incharge:", error);
      return;
    }

    if (data.length > 0) {
      setIsIncharge(true);
    }
  };

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
          width: { xs: "100%", sm: 600 },
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
          Question Repositories
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          pt: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography align="left" color="text.secondary" sx={{ mb: 2 }}>
          Choose where the questions will come from.
        </Typography>
        <Stack spacing={2}>
          <Box
            sx={{
              border: "1.5px solid #e5e7eb",
              borderRadius: 2,
              bgcolor: "#fff",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              disabled={!isIncharge}
              onClick={() => isIncharge && onSelect("Final Exam")}
              sx={{
                bgcolor: isIncharge ? "#e0edff" : "#2563eb",
                color: isIncharge ? "#2563eb" : "#2563eb",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "none",
                py: 1.5,
                mb: 1,
                opacity: isIncharge ? 1 : 0.6,
                "&:hover": {
                  bgcolor: isIncharge ? "#2563eb" : "#e0edff",
                  color: isIncharge ? "#fff" : "#2563eb",
                },
              }}
            >
              FINAL EXAM
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Contains questions available for final exams.
            </Typography>
            {!isIncharge && (
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                [Available for faculty incharge only.]
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              border: "1.5px solid #e5e7eb",
              borderRadius: 2,
              bgcolor: "#fff",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={() => onSelect("Quiz")}
              sx={{
                bgcolor: "#e0edff",
                color: "#2563eb",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "none",
                py: 1.5,
                mb: 1,
                "&:hover": {
                  bgcolor: "#2563eb",
                  color: "#fff",
                },
              }}
            >
              Quizzes Repository
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Contains questions available for quizzes
            </Typography>
          </Box>
        </Stack>
        {/* <Divider sx={{ my: 0 }} /> */}
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: 2,
          mt: "-8px",
          justifyContent: "start",
        }}
      >
        <Button onClick={onClose} color="error" size="medium">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionRepoModal;
