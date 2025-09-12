import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

function AnnouncementItem({ announcement, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menu, setMenu] = useState(false);

  const initial = announcement.tbl_users
    ? announcement.tbl_users.f_name.charAt(0) +
      announcement.tbl_users.l_name.charAt(0)
    : "DSJ";
  const created_date = new Date(announcement.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  const start_date = new Date(announcement.start_date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  const full_name = announcement.tbl_users
    ? `${announcement.tbl_users.f_name} ${announcement.tbl_users.l_name}`
    : "";

  const is_scheduled = announcement.status === "Scheduled";

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenu(true);
  };

  const handleEdit = () => {
    setMenu(false);
    onEdit(announcement);
  };

  const handleDelete = () => {
    setMenu(false);
    onDelete(announcement);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 p-4 flex flex-col"
      style={{ borderLeft: "4px solid #facc15" }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Avatar sx={{ bgcolor: "#23286b", color: "white" }}>{initial}</Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">
                {announcement.title}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {full_name} • {created_date} •{" "}
              {is_scheduled ? "Scheduled on " + start_date : "Posted"}
            </div>
          </div>
        </div>
        <IconButton onClick={openMenu} sx={{ color: "#23286b" }}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menu}
          onClose={() => setMenu(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {announcement.status !== "Posted" && (
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditRoundedIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
          )}
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
      <div
        className="mt-3 text-gray-800 text-sm"
        dangerouslySetInnerHTML={{ __html: announcement.content }}
      />
    </div>
  );
}

export default AnnouncementItem;
