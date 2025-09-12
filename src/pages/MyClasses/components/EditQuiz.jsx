import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { extend } from "dayjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { SaudiRiyal } from "lucide-react";

function EditQuiz({ open, onClose, quiz, setSnackbar }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setFormData({});
      return;
    }

    // {
    //   class_exam_id: '8f1a4013-7cb2-4d42-97af-751380e82bf7',
    //   class_id: '9ee192f6-1546-4581-8554-83cd6fc048c3',
    //   exam_id: '21c43d8e-4aaf-41c0-bf4d-8a47f7099918',
    //   name: 'manual_quiz_3',
    //   answered: 2,
    //   total_items: 5,
    //   open_time: '2025-09-10T01:39:32.702+00:00',
    //   close_time: null,
    //   creator: 'red cabs ochavo',
    //   time_limit: 60,
    //   status: 'Open'
    // }

    // setFormData({
    //   class_exam_id: quiz?.class_exam_id || "",
    //   open_time: dayjs(quiz?.open_time) || null,
    //   close_time: dayjs(quiz?.close_time) || null,
    // });

    if (quiz.status === "Open") {
      setFormData({
        close_time: quiz?.close_time ? dayjs(quiz.close_time) : null,
      });
    } else {
      setFormData({
        open_time: quiz?.open_time ? dayjs(quiz.open_time) : null,
        close_time: quiz?.close_time ? dayjs(quiz.close_time) : null,
      });
    }
  }, [open, quiz]);

  //   check for changes
  const hasChanges = () => {
    if (quiz.status === "Open") {
      return (
        (formData.close_time && !quiz.close_time) ||
        (formData.close_time &&
          quiz.close_time &&
          !dayjs(formData.close_time).isSame(dayjs(quiz.close_time)))
      );
    } else {
      return (
        (formData.open_time && !quiz.open_time) ||
        (formData.open_time &&
          quiz.open_time &&
          !dayjs(formData.open_time).isSame(dayjs(quiz.open_time))) ||
        (formData.close_time && !quiz.close_time) ||
        (formData.close_time &&
          quiz.close_time &&
          !dayjs(formData.close_time).isSame(dayjs(quiz.close_time)))
      );
    }
  };

  const confirmEdit = async () => {
    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes detected.",
        severity: "info",
      });
      onClose();
      return;
    }

    if (quiz.status === "Open") {
      extendDue();
    } else {
      scheduleQuiz();
    }
  };

  const instaClose = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tbl_class_exam")
      .update({
        close_time: dayjs().toISOString(),
        status: "Close",
      })
      .eq("id", quiz.class_exam_id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to close quiz. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Quiz closed successfully.",
      severity: "success",
    });
    onClose();
  };

  const instaOpen = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tbl_class_exam")
      .update({
        open_time: dayjs().toISOString(),
        status: "Scheduled",
      })
      .eq("id", quiz.class_exam_id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to open quiz. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Quiz will be opened in a short while.",
      severity: "info",
    });
    onClose();
  };

  const extendDue = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tbl_class_exam")
      .update({
        close_time: formData.close_time.toISOString(),
      })
      .eq("id", quiz.class_exam_id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to extend due date. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }

    setSnackbar({
      open: true,
      message: "Due date extended successfully.",
      severity: "success",
    });
    onClose();
  };

  const scheduleQuiz = async () => {
    if (dayjs(formData.open_time).isAfter(dayjs(formData.close_time))) {
      setSnackbar({
        open: true,
        message: "Open date must be before close date.",
        severity: "error",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("tbl_class_exam")
      .update({
        open_time: formData.open_time.toISOString(),
        close_time: formData.close_time.toISOString(),
        status: "Scheduled",
      })
      .eq("id", quiz.class_exam_id);
    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to re-schedule quiz. Please try again.",
        severity: "error",
      });
      onClose();
      return;
    }
    setSnackbar({
      open: true,
      message: "Quiz re-scheduled successfully.",
      severity: "success",
    });
    onClose();
  };

  const actions = () => {
    switch (quiz?.status) {
      case "Scheduled":
        return (
          <Stack rowGap={2} mt={2}>
            <Button
              variant="contained"
              color="success"
              disableElevation
              onClick={instaOpen}
              loading={loading}
            >
              Open quiz
            </Button>
            <Divider>
              <Typography variant="caption" color="text.secondary">
                or
              </Typography>
            </Divider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Change open date"
                name="open_time"
                defaultValue={formData.open_time ? formData.open_time : dayjs()}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    error: false,
                    sx: { width: "100%", bgcolor: "white" },
                  },
                }}
                onChange={(e) => {
                  setFormData({ ...formData, open_time: e });
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Change close date"
                name="close_time"
                defaultValue={
                  formData.close_time ? formData.close_time : dayjs()
                }
                minDateTime={formData.open_time || dayjs()}
                slotProps={{
                  textField: {
                    error: false,
                    sx: { width: "100%", bgcolor: "white" },
                  },
                }}
                onChange={(e) => {
                  setFormData({ ...formData, close_time: e });
                }}
              />
            </LocalizationProvider>
          </Stack>
        );
      case "Open":
        return (
          <Stack rowGap={2} mt={2}>
            <Button
              variant="contained"
              color="error"
              disableElevation
              onClick={instaClose}
              loading={loading}
            >
              Close quiz
            </Button>
            <Divider>
              <Typography variant="caption" color="text.secondary">
                or
              </Typography>
            </Divider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Change due date"
                name="open_time"
                defaultValue={
                  formData.close_time ? formData.close_time : dayjs()
                }
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    error: false,
                    sx: { width: "100%", bgcolor: "white" },
                  },
                }}
                onChange={(e) => {
                  setFormData({ ...formData, close_time: e });
                }}
              />
            </LocalizationProvider>
          </Stack>
        );
      case "Close":
        return (
          <Stack rowGap={2} mt={2}>
            <Typography>Re-open quiz on:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Change open date"
                name="open_time"
                defaultValue={formData.open_time ? formData.open_time : dayjs()}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    error: false,
                    sx: { width: "100%", bgcolor: "white" },
                  },
                }}
                onChange={(e) => {
                  setFormData({ ...formData, open_time: e });
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Change close date"
                name="close_time"
                defaultValue={
                  formData.close_time ? formData.close_time : dayjs()
                }
                minDateTime={formData.open_time || dayjs()}
                slotProps={{
                  textField: {
                    error: false,
                    sx: { width: "100%", bgcolor: "white" },
                  },
                }}
                onChange={(e) => {
                  setFormData({ ...formData, close_time: e });
                }}
              />
            </LocalizationProvider>
          </Stack>
        );
      default:
        return "Unknown Action";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Quiz</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Name: <b>{quiz?.name}</b>
        </DialogContentText>
        <DialogContentText>
          Status: <b>{quiz?.status}</b>
        </DialogContentText>
        {/* <Divider>
          <Typography variant="caption" color="text.secondary">
            action
          </Typography>
        </Divider> */}
        {actions()}
      </DialogContent>

      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmEdit}
            variant="contained"
            color="warning"
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

export default EditQuiz;
