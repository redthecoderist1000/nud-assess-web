import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function PersonListItem({ person, setRemDialog }) {
  const name = `${person.f_name || ""} ${person.l_name || ""}`.trim();

  const getInitials = () => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => setRemDialog(person.class_member_id)}
        >
          <DeleteIcon color="error" />
        </IconButton>
      }
      sx={{
        bgcolor: "background.paper",
        borderRadius: 4,
        border: "1px solid #e0e0e0",
        borderLeft: "4px solid #003488ff",
        mb: 2,
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "#feffb2ff", color: "black" }}>
          {getInitials()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} secondary={person.email} />
    </ListItem>
  );
}

export default PersonListItem;
