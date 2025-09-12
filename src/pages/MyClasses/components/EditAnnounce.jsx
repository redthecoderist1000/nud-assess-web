import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../helper/Supabase";

function EditAnnounce({ open, onClose, announcement, setSnackbar }) {
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    start_date: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      return;
    }
    setFormData({
      title: announcement.title,
      content: announcement.content,
      start_date: dayjs(announcement.start_date),
    });
  }, [open]);

  const confirmEdit = async () => {
    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes made.",
        severity: "info",
      });
      onClose();
      return;
    }
    setLoading(true);

    const payload = {
      title: formData.title,
      content: formData.content,
      start_date: formData.start_date.toISOString(),
    };

    const isSame = dayjs(formData.start_date).isSame(
      dayjs(announcement.start_date),
      "minute"
    );
    const isFuture = dayjs(formData.start_date).isAfter(
      dayjs(announcement.start_date)
    );

    if (
      announcement.status === "Scheduled" ||
      (announcement.status === "Posted" && isFuture)
    ) {
      payload.status = "Scheduled";
    } else if (announcement.status === "Posted" && isSame) {
      payload.status = "Posted";
    }

    const { error } = await supabase
      .from("tbl_announcement")
      .update(payload)
      .eq("id", announcement.id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Error editing announcement. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Announcement edited successfully",
      severity: "success",
    });
    onClose();
  };

  const instaPost = async () => {
    setLoading(true);

    const payload = {
      start_date: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("tbl_announcement")
      .update(payload)
      .eq("id", announcement.id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Error posting announcement. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Announcement will be posted in a short while",
      severity: "success",
    });
    onClose();
  };

  const handleStartDate = (newValue) => {
    setFormData((prev) => ({ ...prev, start_date: newValue }));
  };

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

  //   check for changes
  const hasChanges = () => {
    const currentContent = stripHtml(formData.content).trim();
    const originalContent = stripHtml(announcement.content).trim();

    return (
      formData.title !== announcement.title ||
      currentContent !== originalContent ||
      !dayjs(formData.start_date).isSame(
        dayjs(announcement.start_date),
        "minute"
      )
    );
  };

  const minDate =
    announcement?.status == "Posted" ? dayjs(announcement.start_date) : dayjs();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Announcement</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography variant="body1">
              Scheduled on:{" "}
              {dayjs(announcement?.start_date).format(
                "MMM D, YYYY [at] h:mm A"
              )}
            </Typography>
            {announcement?.status === "Scheduled" && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={instaPost}
                loading={loading}
                disableElevation
              >
                Post Now
              </Button>
            )}
          </Stack>
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
                  defaultValue={formData.start_date}
                  minDateTime={minDate}
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmEdit}
            variant="contained"
            color="success"
            disableElevation
            loading={loading}
          >
            Edit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default EditAnnounce;
