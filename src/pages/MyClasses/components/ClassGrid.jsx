import { Typography } from "@mui/material";
import ClassCard from "./ClassCard";

const ClassGrid = ({
  classes,
  open,
  selectedClass,
  anchorEl,
  handleOpenPopover,
  handleClosePopover,
  handleArchiveDialog,
  handleActivate,
  handleDeleteDialog,
}) => (
  <div className="flex-1">
    {/* <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"> */}
    <div className="grid grid-cols-2 gap-4">
      {classes.map((cls, index) => (
        <ClassCard
          key={index}
          cls={cls}
          open={open}
          selectedClass={selectedClass}
          anchorEl={anchorEl}
          handleOpenPopover={handleOpenPopover}
          handleClosePopover={handleClosePopover}
          handleArchiveDialog={handleArchiveDialog}
          handleActivate={handleActivate}
          handleDeleteDialog={handleDeleteDialog}
        />
      ))}
    </div>
    {/* </div> */}
  </div>
);

export default ClassGrid;
