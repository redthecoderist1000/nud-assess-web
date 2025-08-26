import { useRef, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import FileUpload from "../../../components/elements/FileUpload";

export default function AutoTab() {
  const [files, setFiles] = useState([]);

  return (
    <Box>
      <FileUpload files={files} setFiles={setFiles} />
    </Box>
  );
}
