import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { userContext } from "../../../App";
import { supabase } from "../../../helper/Supabase";

const QuestionRepoModal = (props) => {
  const { isOpen, onClose, onSelect } = props;
  const { user } = useContext(userContext);
  const [isIncharge, setIsIncharge] = useState(false);
  // if (!isOpen) return null;

  // check if incharge
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_subject")
      .select("id")
      .eq("faculty_incharge", user.user_id);

    if (error) {
      console.log("error fetching incharge:", error);
      return;
    }

    console.log(data);

    if (data.length > 0) {
      setIsIncharge(true);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        align="center"
        component={Typography}
        fontWeight="bold"
        variant="h5"
      >
        Question Repositories
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center" mb={1}>
          Choose where the questions will come from.
        </DialogContentText>
        <ul className="space-y-4 w-full">
          <li>
            {isIncharge ? (
              <button
                className="w-full bg-blue-200 text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-900 hover:text-white"
                onClick={() => onSelect("Final Exam")}
              >
                <b>Final Exam</b>
                <p className="text-sm ">
                  Contains questions available for final exams.
                </p>
              </button>
            ) : (
              <button
                className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg"
                disabled
              >
                <b>Final Exam</b>
                <p className="text-sm">
                  Contains questions available for final exams.
                </p>
                <p className="text-xs">
                  [Available for faculty incharge only.]
                </p>
              </button>
            )}
          </li>
          <li>
            <button
              className="w-full bg-blue-200 text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-900 hover:text-white"
              onClick={() => onSelect("Quiz")}
            >
              <b>Quizzes Repository</b>
              <p className="text-sm ">
                Contains questions available for quizzes
              </p>
            </button>
          </li>
          {/* <li>
            <button
              className="w-full bg-white text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-200"
              onClick={() => onSelect("Private")}
            >
              Private
            </button>
          </li> */}
        </ul>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" justifyContent="left" width="100%">
          <Button onClick={onClose} color="error" size="small">
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionRepoModal;
