import React, { useContext } from "react";
import { motion } from "framer-motion";
import { userContext } from "../../../App";
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

const QuizModal = (props) => {
  const { isOpen, onClose, onSelectOption } = props;
  const { user } = useContext(userContext);

  // console.log(user);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        align="center"
        component={Typography}
        fontWeight="bold"
        variant="h5"
      >
        Create Quiz
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center" mb={1}>
          Choose how your quiz will be created.
        </DialogContentText>
        <ul className="space-y-4 w-full">
          <li>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => onSelectOption("Random")}
            >
              <b>Random Bank</b>
              <p className="text-sm text-gray-200">
                Use random questions from the bank
              </p>
            </button>
          </li>
          <li>
            {user.allow_ai ? (
              <button
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800"
                onClick={() => onSelectOption("AI-Generated")}
              >
                <b>AI-Generated</b>
                <p className="text-sm text-gray-200">
                  Use AI to create a set of questions
                </p>
              </button>
            ) : (
              <button
                className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg"
                disabled
              >
                <b>AI-Generated</b>
                <p className="text-sm text-gray-400">
                  Use AI to create a set of questions
                </p>
                <p className="text-xs text-gray-400">
                  [Disabled by your admin]
                </p>
              </button>
            )}
          </li>
          {/* <li>
            <button
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
              onClick={() => onSelectOption("Premade Exam")}
            >
              Premade Exam
              <p className="text-sm text-gray-200">Use a premade exam</p>
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
      {/* </motion.div> */}
    </Dialog>
  );
};

export default QuizModal;
