import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ClassAnalyticsChart from "./components/ClassAnalyticsChart";
import CreateClass from "./components/CreateClass";
import ClassGrid from "./components/ClassGrid";
import { supabase } from "../../helper/Supabase";
import { userContext } from "../../App";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
} from "@mui/material";

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
  const [selectedAnalyticsClass, setSelectedAnalyticsClass] = useState(null);

  useEffect(() => {
    fetchData();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class" },
        () => {
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
      setLoading(false);
      return;
    }

    setLoading(false);
    setArchiveDialog(false);
    setAnchorEl(null);
    setSelectedClass({});
  };

  const handleActivate = async (cls) => {
    setLoading(true);

    const { error } = await supabase
      .from("tbl_class")
      .update({ is_active: true })
      .eq("id", cls.id);

    if (error) {
      console.error("Error activating class:", error);
      setLoading(false);
      return;
    }

    setLoading(false);
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
      setLoading(false);
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

  const filteredClasses = classes.filter((cls) => {
    if (activeTab === "active") {
      return cls.is_active;
    } else {
      return !cls.is_active;
    }
  });

  const handleClassDoubleClick = (cls) => {
    navigate("/class", { state: cls });
  };

  const handleClassClick = (cls) => {
    // setSelectedAnalyticsClass(cls);
    navigate("/class", { state: cls });
  };

  return (
    <Container maxWidth="xl" sx={{ my: 5 }}>
      <motion.div
        className="flex flex-col gap-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full bg-white border-b border-gray-200 py-3 mb-3 flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-0">
              My Classes
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-0">
              Organize class schedules, assignments, and analytics in one place.
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-[#4854a3] hover:bg-[#2C388F] text-white font-medium py-2 px-4 rounded-lg text-sm"
            onClick={() => setCreateModalVisible(true)}
          >
            Create Class
          </button>
        </div>

        <div className="flex gap-5">
          <div className="w-7/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex bg-[#f3f4f6] rounded-full p-1"
                style={{ minWidth: 260, maxWidth: 300 }}
              >
                <button
                  className={`flex-1 py-2 text-center rounded-full font-bold transition-colors
                ${activeTab === "active" ? "bg-white text-black shadow-sm" : "text-gray-700"}
              `}
                  style={{
                    border: "none",
                    background: activeTab === "active" ? "#fff" : "transparent",
                    boxShadow:
                      activeTab === "active"
                        ? "0 1px 4px rgba(0,0,0,0.03)"
                        : "none",
                  }}
                  onClick={() => setActiveTab("active")}
                >
                  Active
                </button>
                <button
                  className={`flex-1 py-2 text-center rounded-full font-bold transition-colors
                ${activeTab === "archived" ? "bg-white text-black shadow-sm" : "text-gray-700"}
              `}
                  style={{
                    border: "none",
                    background:
                      activeTab === "archived" ? "#fff" : "transparent",
                    boxShadow:
                      activeTab === "archived"
                        ? "0 1px 4px rgba(0,0,0,0.03)"
                        : "none",
                  }}
                  onClick={() => setActiveTab("archived")}
                >
                  Archive
                </button>
              </div>
            </div>

            {activeTab === "archived" && filteredClasses.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No Archive Class
              </div>
            ) : (
              <ClassGrid
                classes={filteredClasses}
                open={open}
                selectedClass={selectedClass}
                anchorEl={anchorEl}
                handleOpenPopover={handleOpenPopover}
                handleClosePopover={handleClosePopover}
                handleArchiveDialog={() => setArchiveDialog(true)}
                handleActivate={handleActivate}
                handleDeleteDialog={() => setDeleteDialog(true)}
                handleSelectAnalyticsClass={handleClassClick}
                onDoubleClick={handleClassDoubleClick}
              />
            )}
          </div>

          <div className="w-1/3 mt-15">
            <ClassAnalyticsChart
              classes={classes}
              selectedClass={selectedAnalyticsClass}
            />
          </div>
        </div>

        <CreateClass
          onCancel={() => {}}
          open={createModalVisible}
          setOpen={setCreateModalVisible}
        />

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
    </Container>
  );
};

export default ClassManagementPage;
