import { useContext, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GradeBookTable from "../component/GradeBookTable";
import { userContext } from "../../../../App";

const GradeTab = ({ class_id }) => {
  const { setSnackbar } = useContext(userContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const [allowExport, setAllowExport] = useState(false);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    handleClose();
    // Add export logic here
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-bold text-xl">Gradebook</h2>
          <div className="text-gray-500 text-sm">
            Click on quiz column headers to view detailed results and export
            data
          </div>
        </div>
        <div>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
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
              minWidth: "110px",
              padding: "6px 16px",
            }}
            onClick={handleExportClick}
            disabled={!allowExport}
          >
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleExport("csv")}>
              <ListItemIcon>
                <TableChartIcon sx={{ color: "#43a047" }} />
              </ListItemIcon>
              <ListItemText primary=".csv" />
            </MenuItem>
            {/* <MenuItem onClick={() => handleExport("docx")}>
              <ListItemIcon>
                <DescriptionIcon sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText primary=".docx" />
            </MenuItem> */}
            <MenuItem onClick={() => handleExport("pdf")}>
              <ListItemIcon>
                <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText primary=".pdf" />
            </MenuItem>
          </Menu>
        </div>
      </div>
      <GradeBookTable
        classId={class_id}
        setSnackbar={setSnackbar}
        setAllowExport={setAllowExport}
      />
    </div>
  );
};

export default GradeTab;
