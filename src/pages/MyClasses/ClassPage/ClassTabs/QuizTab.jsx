import React, { useState } from "react";
import { Alert, Button, Snackbar, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignQuizDialog from "../../components/AssignQuizDialog";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import QuizItem from "../../components/QuizItem";
import DeleteQuiz from "../../components/DeleteQuiz";
import EditQuiz from "../../components/EditQuiz";

const dateFormat = (dateTime) => {
  return dayjs(dateTime).format("MMM DD, YYYY");
};

const QuizTab = ({ quizzes, classData }) => {
  const [assignQuiz, setAssignQuiz] = useState(false);
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [editQuiz, setEditQuiz] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  return (
    <div>
      {/* button top */}
      <div className="flex items-center justify-end mb-4">
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          sx={{
            background: "#23286b",
            color: "#fff",
            textTransform: "none",
            fontWeight: 400,
            fontSize: "0.875rem",
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
              background: "#23286b",
              boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.5)",
            },
            minWidth: "140px",
            padding: "6px 16px",
          }}
          disabled={classData.is_active === false}
          onClick={() => setAssignQuiz(true)}
        >
          Assign Quiz
        </Button>
      </div>
      {/* list */}
      <Stack
        spacing={2}
        pb={15}
        sx={{
          maxHeight: "calc(100vh - 220px)", // adjust as needed
          overflowY: "auto",
          pr: 1, // padding to avoid content hiding behind scrollbar
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e2e8f0",
            borderRadius: 4,
          },
        }}
      >
        {quizzes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No quizzes assigned yet.
          </div>
        ) : (
          quizzes.map((quiz, index) => (
            <QuizItem
              key={index}
              quiz={quiz}
              classId={classData.id}
              setDeleteQuiz={() => setDeleteQuiz(quiz)}
              setEditQuiz={() => setEditQuiz(quiz)}
            />
          ))
        )}
      </Stack>

      <DeleteQuiz
        open={!!deleteQuiz}
        onClose={() => setDeleteQuiz(null)}
        quiz={deleteQuiz}
        setSnackbar={setSnackbar}
      />

      <AssignQuizDialog
        open={assignQuiz}
        setOpen={setAssignQuiz}
        classId={classData.id}
        setSnackbar={setSnackbar}
      />

      <EditQuiz
        open={!!editQuiz}
        onClose={() => setEditQuiz(null)}
        quiz={editQuiz}
        setSnackbar={setSnackbar}
      />

      {/* snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default QuizTab;
