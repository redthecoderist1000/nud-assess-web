import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignQuizDialog from "../../components/AssignQuizDialog";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const dateFormat = (dateTime) => {
  return dayjs(dateTime).format("MMM DD, YYYY");
};

const QuizTab = ({ quizzes, classData }) => {
  const navigate = useNavigate();

  const [assignQuiz, setAssignQuiz] = useState(false);

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
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border-l-4 border-gray-200 border-l-blue-800 shadow-sm p-6 flex flex-col"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <h3 className="font-semibold text-lg text-[#23286b] mr-2">
                  {quiz.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  size="small"
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "#23286b",
                    borderColor: "#e0e0e0",
                    background: "#fff",
                    "&:hover": {
                      background: "#f3f3f3",
                      borderColor: "#cfcfcf",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/quiz", {
                      state: {
                        class_exam_id: quiz.class_exam_id,
                        class_id: classData.id,
                      },
                    });
                  }}
                >
                  View Results
                </Button>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    minWidth: "32px",
                    color: "#23286b",
                  }}
                >
                  <MoreVertIcon />
                </Button>
              </div>
            </div>
            <div className=" text-gray-700 text-sm">
              {quiz.description || "No description provided."}
            </div>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <div className="flex items-center gap-2">
                <AssignmentIcon fontSize="small" className="text-[#23286b]" />
                <div>
                  <div className="text-xs text-gray-400">Questions</div>
                  <div className="text-sm font-semibold">
                    {quiz.total_items} items
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HelpOutlineIcon fontSize="small" className="text-[#23286b]" />
                <div>
                  <div className="text-xs text-gray-400">Open Date</div>
                  <div className="text-sm font-semibold">
                    {quiz.open_time ? dateFormat(quiz.open_time) : "No date"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HelpOutlineIcon fontSize="small" className="text-[#23286b]" />
                <div>
                  <div className="text-xs text-gray-400">Due Date</div>
                  <div className="text-sm font-semibold">
                    {quiz.close_time ? dateFormat(quiz.close_time) : "No date"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AccessTimeIcon fontSize="small" className="text-[#23286b]" />
                <div>
                  <div className="text-xs text-gray-400">Duration</div>
                  <div className="text-sm font-semibold">
                    {quiz.time_limit ? `${quiz.time_limit} minutes` : "--"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AccessTimeIcon fontSize="small" className="text-[#23286b]" />
                <div>
                  <div className="text-xs text-gray-400">Status</div>
                  <div className="text-sm font-semibold">
                    {quiz.status ? quiz.status : "--"}
                  </div>
                </div>
              </div>
            </Stack>
          </div>
        ))}
      </Stack>

      <AssignQuizDialog
        open={assignQuiz}
        setOpen={setAssignQuiz}
        classId={classData.id}
      />
    </div>
  );
};

export default QuizTab;
