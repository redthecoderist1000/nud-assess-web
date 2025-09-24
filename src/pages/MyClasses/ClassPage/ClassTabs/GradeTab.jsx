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
import Export from "../../../../components/elements/Export";

const GradeTab = ({ class_id }) => {
  const { setSnackbar } = useContext(userContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const [allowExport, setAllowExport] = useState(false);

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
          <Export
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            dlCsv={() => handleExport("csv")}
            // dlPdf={() => handleExport("pdf")}
            disable={!allowExport}
          />
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
