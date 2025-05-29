import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import temporaryImage from "../../assets/images/temporaryimage.png";
import ClassAnalyticsChart from "../elements/ClassAnalyticsChart";
import CreateClass from "../elements/CreateClass";
import { useEffect } from "react";
import { supabase } from "../../helper/Supabase";
import { userContext } from "../../App";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const ClassManagementPage = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [classes, setClasses] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [archiveDialog, setArchiveDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredClasses = classes.filter((cls) => {
    if (activeTab == "active") {
      return cls.is_active;
    } else {
      return !cls.is_active;
    }
  });

  useEffect(() => {
    fetchData();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_class")
      .select("*")
      .eq("created_by", user.user_id);

    if (error) {
      console.log("Failed to fetch data:", error);
      return;
    }
    setClasses(data);
  };

  const open = Boolean(anchorEl);

  const handleOpenPopover = (e, classData) => {
    setAnchorEl(e.currentTarget);
    setSelectedClass(classData);
  };

  const handleArchive = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("tbl_class")
      .update({ is_active: false })
      .eq("id", selectedClass.id);

    if (error) {
      console.error("Error archiving class:", error);
      return;
    }

    setLoading(false);
    setArchiveDialog(false);
    setAnchorEl(null);
    setSelectedClass({});
  };

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tbl_class")
      .delete()
      .eq("id", selectedClass.id);

    if (error) {
      console.error("Error deleting class:", error);
      return;
    }
    setLoading(false);
    setDeleteDialog(false);
    setAnchorEl(null);
    setSelectedClass({});
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex gap-5 p-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-7/10 p-5 rounded-lg">
          <div className="mb-6">
            <h1 className="text-5xl font-semibold mb-2">Class Management</h1>
            <p className="text-gray-600">
              Organize class schedules, assignments, and analytics in one place.
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <span
                className={`cursor-pointer font-bold ${activeTab === "active" ? "text-yellow-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </span>
              <span
                className={`cursor-pointer font-bold ${activeTab === "archived" ? "text-yellow-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("archived")}
              >
                Archive
              </span>
            </div>
            <button
              className="bg-[#35408E] text-white px-4 py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
              onClick={() => setCreateModalVisible(true)}
            >
              Create
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="relative flex items-center bg-yellow-300 rounded-lg p-3 h-30 transition duration-300 ease-in-out hover:from-yellow-500 hover:to-yellow-300"
              >
                <div
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => {
                    navigate("/class", { state: cls });
                  }}
                >
                  <img
                    src={
                      cls.image ||
                      temporaryImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Class"
                    className="w-25 h-15 bg-gray-300 rounded-md object-cover"
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    ml={2}
                    sx={{ width: "100%" }}
                  >
                    <strong>{cls.class_name}</strong>
                  </Stack>
                </div>
                <div className="relative"></div>
                <IconButton onClick={(e) => handleOpenPopover(e, cls)}>
                  <MoreVertRoundedIcon />
                </IconButton>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClosePopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <List>
                    {cls.is_active ? (
                      <>
                        <ListItemButton onClick={() => setArchiveDialog(true)}>
                          <ArchiveRoundedIcon className="text-gray-600" />
                          <Typography className="ml-2">Archive</Typography>
                        </ListItemButton>
                        <Divider />
                      </>
                    ) : (
                      <></>
                    )}
                    <ListItemButton onClick={() => setDeleteDialog(true)}>
                      <DeleteRoundedIcon className="text-red-600" />
                      <Typography className="ml-2">Delete</Typography>
                    </ListItemButton>
                  </List>
                </Popover>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 mt-30">
          <ClassAnalyticsChart classes={classes} />
        </div>

        {createModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <CreateClass onCancel={() => setCreateModalVisible(false)} />
            </div>
          </div>
        )}
        {/* archive dialog */}
        <Dialog open={archiveDialog} onClose={() => setArchiveDialog(false)}>
          <DialogTitle>Archive Class: {selectedClass.class_name}</DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              Are you sure you want to archive this class? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Stack direction="row" justifyContent="space-between" width="100%">
              <Button onClick={() => setArchiveDialog(false)} color="error">
                Cancel
              </Button>
              <Button
                onClick={handleArchive}
                variant="contained"
                loading={loading}
              >
                Archive
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>

        {/* delete dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Class: {selectedClass.class_name}</DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this class? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Stack direction="row" justifyContent="space-between" width="100%">
              <Button onClick={() => setDeleteDialog(false)} color="error">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                loading={loading}
              >
                Delete
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClassManagementPage;
