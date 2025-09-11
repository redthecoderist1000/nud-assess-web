import React, { useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  IconButton,
  TextField,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import JoditEditor from "jodit-react";

const defaultAnnouncements = [
  {
    id: 1,
    title: "Midterm Exam Schedule",
    author: "Dr. Sarah Johnson",
    date: "3/1/2024 • 8:00:00 AM",
    content:
      "The midterm exam will be held on March 15th. Please review chapters 1-5 and be prepared for both theoretical and practical questions.",
  },
];

const AnnouncementTab = () => {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    // created_by: user.user_id,
  });

  const handleMenuOpen = (event, announcement) => {
    setAnchorEl(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAnnouncement(null);
  };

  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      toolbarAdaptive: false,
      uploader: { insertImageAsBase64URI: true }, // configure image upalods
      addNewLine: false,
      statusbar: false,
      buttons: ["bold", "italic", "underline"],
    }),
    []
  );
  const handleJodit = (e) => {
    // setFormData({ ...formData, content: e });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-bold text-xl">Class Announcements</h2>
          <div className="text-gray-500 text-sm">
            Keep your students informed with important updates and notices
          </div>
        </div>
      </div>
      {/* Quick Announcement Card */}
      <div className="p-6 bg-[#f8f9fb] rounded-2xl border border-gray-200 shadow-sm mt-6 flex items-start gap-4">
        <NotificationsActiveIcon
          sx={{
            background: "#23286b",
            color: "#fff",
            borderRadius: "50%",
            padding: "8px",
            fontSize: 36,
            marginRight: "8px",
          }}
        />
        <div className="flex-1">
          <div className="font-semibold mb-1">Post Announcement</div>
          <TextField
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Title"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <JoditEditor
            ref={editor}
            value={formData.content}
            config={config}
            onBlur={handleJodit}
          />
          <Button
            variant="contained"
            sx={{
              background: "#23286b",
              color: "#fff",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                background: "#23286b",
                boxShadow: "none",
              },
              minWidth: "150px",
              padding: "6px 16px",
              alignSelf: "flex-end",
              display: "block",
            }}
          >
            Post Announcement
          </Button>
        </div>
      </div>
      {/* Announcement List */}
      <div className="mt-4">
        {defaultAnnouncements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 p-6 flex flex-col"
            style={{ borderLeft: "4px solid #facc15" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="bg-[#23286b] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-lg">
                  DSJ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{a.title}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {a.author} • {a.date}
                  </div>
                </div>
              </div>
              <IconButton
                onClick={(e) => handleMenuOpen(e, a)}
                sx={{ color: "#23286b" }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl && selectedAnnouncement?.id === a.id)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
              </Menu>
            </div>
            <div className="mt-3 text-gray-800 text-sm">{a.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementTab;
