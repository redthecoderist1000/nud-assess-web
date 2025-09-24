import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../helper/Supabase";
import { userContext } from "../../App";

function CreateDialogStep2({ onChoose }) {
  const { user } = useContext(userContext);

  const [isIncharge, setIsIncharge] = useState(false);

  useEffect(() => {
    // if (!isOpen) {
    //   return;
    // }
    fetchData();
  }, []);

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
    <>
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
            onClick={() => onChoose(1, "Final Exam")}
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
            <Typography variant="caption" color="text.secondary" align="center">
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
            onClick={() => onChoose(1, "Quiz")}
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
            Contains questions available for quizzes. Shared with other faculty
            members.
          </Typography>
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
            onClick={() => onChoose(1, "Private")}
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
            Private Repository
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Contains questions visible to the owner only.
          </Typography>
        </Box>
      </Stack>
    </>
  );
}

export default CreateDialogStep2;
