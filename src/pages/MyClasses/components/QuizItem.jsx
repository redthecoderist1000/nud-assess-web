import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import dayjs from "dayjs";

function QuizItem({ quiz, classId, setDeleteQuiz, setEditQuiz }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menu, setMenu] = useState(false);

  const dateFormat = (dateTime) => {
    return dayjs(dateTime).format("MMM DD, YYYY");
  };
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenu(true);
  };

  const handleDelete = () => {
    setMenu(false);
    setDeleteQuiz();
  };

  const handleEdit = () => {
    setMenu(false);
    setEditQuiz();
  };

  return (
    <div className="bg-white rounded-xl border-l-4 border-gray-200 border-l-blue-800 shadow-sm p-6 flex flex-col">
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
                  class_id: classId,
                },
              });
            }}
          >
            View Results
          </Button>
          <IconButton
            size="small"
            sx={{
              color: "#23286b",
            }}
            onClick={openMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menu}
            onClose={() => setMenu(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditRoundedIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
          </Menu>
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
  );
}

export default QuizItem;
