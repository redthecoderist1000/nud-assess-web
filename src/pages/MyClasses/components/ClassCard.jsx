import {
  IconButton,
  List,
  ListItemButton,
  Popover,
  Divider,
  Typography,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";

const colorPalette = [
  "#4854a3",
  "#2C388F",
  "#4CAF50",
  "#FF9800",
  "#E91E63",
  "#00BCD4",
  "#9C27B0",
  "#F44336",
  "#3F51B5",
  "#009688",
  "#FFC107",
  "#8BC34A",
  "#FF5722",
  "#607D8B",
  "#673AB7",
  "#2196F3",
  "#CDDC39",
  "#795548",
  "#00BFAE",
  "#B71C1C",
  "#1DE9B6",
];
function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

const ClassCard = ({
  cls,
  open,
  selectedClass,
  anchorEl,
  handleOpenPopover,
  handleClosePopover,
  handleArchiveDialog,
  handleActivate,
}) => {
  const navigate = useNavigate();

  const onssClick = () => {
    const params = new URLSearchParams({
      class_id: cls.id,
    });
    navigate(`/class?${params.toString()}`);
  };

  return (
    <>
      <div
        className="
      relative flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow-sm
      transition duration-300 ease-in-out hover:shadow-md
      w-full
      cursor-pointer
    "
        onClick={onssClick}
      >
        <div className="flex items-center mb-2">
          <div
            className="w-11 h-11 flex items-center justify-center rounded-lg"
            style={{ background: getColor(cls.class_name || String(cls.id)) }}
          >
            <SchoolIcon style={{ color: "#fff", fontSize: 28 }} />
          </div>
          <div className="ml-4 flex-1">
            <div className="font-bold text-base text-gray-900">
              {cls.class_name}
            </div>
            <div className="text-sm text-gray-500 line-clamp-2">
              {cls.description}
            </div>
          </div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPopover(e, cls);
            }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </div>
        <div className="flex items-center mt-2">
          <div className="text-sm text-[#4854a3]">
            {cls.member_count} students
          </div>
          <div className="mx-4 text-sm text-[#4854a3]">
            {cls.quiz_count} quizzes
          </div>
          <span className="ml-auto font-bold text-gray-800 text-sm">
            {cls.ave_score.toFixed(2)}% avg
          </span>
        </div>
      </div>
      <Popover
        open={open && selectedClass.id === cls.id}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          {cls.is_active ? (
            <>
              <ListItemButton onClick={() => handleArchiveDialog(cls)}>
                <ArchiveRoundedIcon className="text-gray-600" />
                <Typography className="ml-2">Archive</Typography>
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton onClick={() => handleActivate(cls)}>
                <ArchiveRoundedIcon className="text-green-600" />
                <Typography className="ml-2">Activate</Typography>
              </ListItemButton>
            </>
          )}
        </List>
      </Popover>
    </>
  );
};

export default ClassCard;
