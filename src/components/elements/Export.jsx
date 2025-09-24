import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
} from "@mui/material";
import SystemUpdateAltRoundedIcon from "@mui/icons-material/SystemUpdateAltRounded";

import CalendarViewMonthRoundedIcon from "@mui/icons-material/CalendarViewMonthRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

function Export({ anchorEl, setAnchorEl, disable, dlCsv, dlPdf, dlWord }) {
  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={disable ?? false}
      >
        <Tooltip title="Export" placement="top" arrow>
          <SystemUpdateAltRoundedIcon />
        </Tooltip>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {dlCsv && (
          <ListItemButton onClick={dlCsv} dense>
            <ListItemIcon>
              <CalendarViewMonthRoundedIcon color="success" />
            </ListItemIcon>
            <ListItemText primary=".csv" />
          </ListItemButton>
        )}
        {dlPdf && (
          <ListItemButton onClick={dlPdf} dense>
            <ListItemIcon>
              <PictureAsPdfRoundedIcon color="error" />
            </ListItemIcon>
            <ListItemText primary=".pdf" />
          </ListItemButton>
        )}
        {dlWord && (
          <ListItemButton onClick={dlWord} dense>
            <ListItemIcon>
              <DescriptionRoundedIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary=".docx" />
          </ListItemButton>
        )}
      </Menu>
    </>
  );
}

export default Export;
