import React, { useContext, useEffect, useState } from "react";
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
import { userContext } from "../../../../App";
import { supabase } from "../../../../helper/Supabase";

const dateFormat = (dateTime) => {
  return dayjs(dateTime).format("MMM DD, YYYY");
};

const QuizTab = ({ quizzes, class_id }) => {
  const { setSnackbar } = useContext(userContext);
  const [assignQuiz, setAssignQuiz] = useState(false);
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [editQuiz, setEditQuiz] = useState(null);
  const [is_active, set_IsActive] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_class")
      .select("is_active")
      .eq("id", class_id)
      .single();

    if (error) {
      console.log("fail to fetch class status:", error);
      return;
    }
    set_IsActive(data.is_active);
  };

  useEffect(() => {
    fetchData();
  }, [class_id]);

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
          disabled={!is_active}
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
              classId={class_id}
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
        classId={class_id}
        setSnackbar={setSnackbar}
      />

      <EditQuiz
        open={!!editQuiz}
        onClose={() => setEditQuiz(null)}
        quiz={editQuiz}
        setSnackbar={setSnackbar}
      />
    </div>
  );
};

export default QuizTab;
