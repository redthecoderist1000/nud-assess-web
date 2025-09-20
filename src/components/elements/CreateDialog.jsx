import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import CreateDialogStep1 from "./CreateDialogStep1";
import CreateDialogStep2 from "./CreateDialogStep2";

function CreateDialog({ open, onClose, type }) {
  // type = quiz or question
  const navigate = useNavigate();
  const [step, setStep] = useState(type == "quiz" ? 0 : 1);
  const [data, setData] = useState({
    mode: "",
    repository: "",
  });

  const handleChoose = (step, input) => {
    if (step == 0) {
      setStep(1);
      setData({ ...data, mode: input });
    }
    if (step == 1) {
      setData((prev) => ({ ...prev, repository: input }));

      if (type == "quiz") {
        const params = new URLSearchParams({
          mode: data.mode,
          repository: input,
        });
        navigate(`/quiz-detail?${params.toString()}`);
      }
      if (type == "question") {
        const params = new URLSearchParams({
          repository: input,
        });
        navigate(`/GenerateQuestion?${params.toString()}`);
      }

      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      setData({
        mode: "",
        repository: "",
      });
      return;
    }

    setStep(type == "quiz" ? 0 : 1);
  }, [open]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="create-dialog-title"
      aria-describedby="create-dialog-description"
    >
      <DialogTitle>
        {step === 0 ? "Create Quiz" : "Create Question"}
      </DialogTitle>
      <DialogContent>
        {step == 0 ? (
          <CreateDialogStep1 onChoose={handleChoose} />
        ) : (
          <CreateDialogStep2 onChoose={handleChoose} />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateDialog;
