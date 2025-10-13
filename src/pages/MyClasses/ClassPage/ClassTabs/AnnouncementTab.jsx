import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import JoditEditor from "jodit-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { supabase } from "../../../../helper/Supabase";
import AnnouncementItem from "../../components/AnnouncementItem";
import DeleteAnnounce from "../../components/DeleteAnnounce";
import EditAnnounce from "../../components/EditAnnounce";
import { userContext } from "../../../../App";
import GeneralDialog from "../../../../components/elements/GeneralDialog";

const AnnouncementTab = ({ class_id, is_active }) => {
  const { setSnackbar } = useContext(userContext);
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    start_date: null,
  });

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [announcementList, setAnnouncementList] = useState([]);

  const editor = useRef(null);
  const config = useMemo(
    () => ({
      required: true,
      readonly: false,
      placeholder: "Start typing content...",
      toolbarAdaptive: false,
      uploader: { insertImageAsBase64URI: true }, // configure image upalods
      addNewLine: false,
      statusbar: false,
      buttons: ["bold", "italic", "underline"],
    }),
    []
  );

  const [toEdit, setToEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  const stripHtml = (html = "") =>
    typeof DOMParser !== "undefined"
      ? new DOMParser().parseFromString(html, "text/html").body.textContent ||
        ""
      : html.replace(/<[^>]*>/g, ""); // fallback for non-browser

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleJodit = (e) => {
    handleEditorChange(e);
  };

  const validate = (e) => {
    e.preventDefault();
    const text = stripHtml(formData.content).trim();
    if (!formData.title || !text) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }
    setDialog({
      open: true,
      title: "Post Announcement",
      content: "Are you sure you want to post this announcement?",
      action: submitForm,
    });
  };

  const submitForm = async () => {
    // create payload
    const payload = {
      title: formData.title,
      content: formData.content,
      class_id: class_id,
      ...(formData.start_date && { start_date: formData.start_date }),
      ...(formData.start_date &&
        new Date(formData.start_date) > new Date() && { status: "Scheduled" }),
    };

    setLoading(true);
    const { data, error } = await supabase
      .from("tbl_announcement")
      .insert(payload)
      .select()
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Error creating announcement. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    setSnackbar({
      open: true,
      message: "Announcement posted successfully",
      severity: "success",
    });
    setFormData({ content: "", title: "", start_date: null });
    setDialog({ ...dialog, open: false });
    setLoading(false);
  };

  const handleStartDate = (e) => {
    setFormData({ ...formData, start_date: e });
  };

  useEffect(() => {
    setLoadingList(true);
    fetchAnnouncements();
    // setLoadingList(false);

    const announcementChannel = supabase
      .channel("announcement_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_announcement",
          filter: `class_id=eq.${class_id}`,
        },
        (payload) => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(announcementChannel);
    };
  }, [class_id]);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("tbl_announcement")
      .select("*, tbl_users ( f_name, l_name )")
      .eq("class_id", class_id)
      .order("created_at", { ascending: false });

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching announcements. Please try again.",
        severity: "error",
      });
      return;
    }

    setAnnouncementList(data);
    setLoadingList(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-bold text-xl">Class Announcements</h2>
          <div className="text-gray-500 text-sm">
            Keep your students informed with important updates and notices
          </div>
        </div>
      </div>
      {/* Quick Announcement Card */}
      {is_active && (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 flex items-start gap-4">
          <NotificationsActiveIcon
            sx={{
              background: "#23286b",
              color: "#fff",
              borderRadius: "50%",
              padding: "8px",
              fontSize: 36,
              marginRight: "8px",
            }}
          />
          <div className="flex-1">
            <div className="font-semibold mb-1">Post Announcement</div>
            <form onSubmit={validate}>
              <Stack rowGap={2}>
                <Grid container spacing={2}>
                  <Grid flex={3}>
                    <TextField
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Title"
                      variant="outlined"
                      fullWidth
                      sx={{ bgcolor: "white" }}
                    />
                  </Grid>
                  <Grid flex={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Post announcement on:"
                        name="open_time"
                        value={formData.start_date}
                        minDateTime={dayjs()}
                        slotProps={{
                          textField: {
                            sx: { width: "100%", bgcolor: "white" },
                          },
                        }}
                        onChange={handleStartDate}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <JoditEditor
                  ref={editor}
                  value={formData.content}
                  config={config}
                  onBlur={handleJodit}
                  onChange={handleEditorChange}
                />
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    maxWidth: "200px",
                    background: "#23286b",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    borderRadius: "8px",
                    "&:hover": {
                      background: "#23286b",
                      boxShadow: "none",
                    },
                  }}
                  type="submit"
                  loading={loading}
                >
                  Post Announcement
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      )}
      {/* Announcement List */}
      {loadingList ? (
        <div className="mt-5">
          <LinearProgress />
        </div>
      ) : (
        <div className="mt-4">
          {announcementList.length === 0 ? (
            <div className="text-gray-500">No announcements yet.</div>
          ) : (
            announcementList.map((a, index) => {
              return (
                <AnnouncementItem
                  key={index}
                  announcement={a}
                  onEdit={setToEdit}
                  onDelete={setToDelete}
                />
              );
            })
          )}
        </div>
      )}

      <DeleteAnnounce
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        announcement={toDelete}
        setSnackbar={setSnackbar}
        fetchAnnouncements={fetchAnnouncements}
      />

      <EditAnnounce
        open={!!toEdit}
        onClose={() => setToEdit(null)}
        announcement={toEdit}
        setSnackbar={setSnackbar}
      />

      <GeneralDialog dialog={dialog} setDialog={setDialog} />
    </div>
  );
};

export default AnnouncementTab;
