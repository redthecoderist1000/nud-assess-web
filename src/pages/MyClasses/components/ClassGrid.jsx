import { Card, Grid, Typography } from "@mui/material";
import ClassCard from "./ClassCard";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";

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
  activeTab,
}) => (
  <Grid container spacing={2}>
    {/* <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"> */}
    <Grid flex={3}>
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
    </Grid>
    {activeTab === 1 && (
      <Grid flex={1}>
        <Card elevation={0} variant="outlined" sx={{ p: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            alignItems={"center"}
            display="flex"
            gap={1}
          >
            <InfoOutlineRoundedIcon color="warning" />
            Notice!
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, textAlign: "justify" }}
          >
            Archived classes will be automatically deleted after 30 days. Please
            make sure to back up any important data before this period ends.
          </Typography>
        </Card>
      </Grid>
    )}
    {/* </div> */}
  </Grid>
);

export default ClassGrid;
