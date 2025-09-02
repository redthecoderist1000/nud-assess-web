import React, { useState } from "react";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TableChartIcon from "@mui/icons-material/TableChart";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GradeBookTable from "../component/GradeBookTable";

const GradeTab = ({ classData }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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
            Click on quiz column headers to view detailed results and export data
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
          >
            Export All
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: { minWidth: 180, paddingY: 1 }
            }}
          >
            <Typography sx={{ px: 2, py: 1, fontWeight: 500, color: "#23286b" }}>
              Export as
            </Typography>
            <MenuItem onClick={() => handleExport("csv")}>
              <ListItemIcon>
                <TableChartIcon sx={{ color: "#43a047" }} />
              </ListItemIcon>
              <ListItemText primary=".csv" />
            </MenuItem>
            <MenuItem onClick={() => handleExport("docx")}>
              <ListItemIcon>
                <DescriptionIcon sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText primary=".docx" />
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>
              <ListItemIcon>
                <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText primary=".pdf" />
            </MenuItem>
          </Menu>
        </div>
      </div>
      <GradeBookTable classId={classData.id} />
    </div>
  );
};

export default GradeTab;