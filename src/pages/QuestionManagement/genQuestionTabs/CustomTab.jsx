import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AnswerCard from "./components/AnswerCard";

function CustomTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    {
      question: "",
      type: "Multiple Choice",
      blooms_category: "",
      answers: [],
    },
  ]);

  const handleChangeItem = (e, index) => {
    setItems((prev) =>
      prev.map((d, i) =>
        index == i ? { ...d, [e.target.name]: e.target.value } : d
      )
    );
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i != index);

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        question: "",
        type: "Multiple Choice",
        blooms_category: "",
        answers: [],
      },
    ]);
  };

  return (
    <>
      <Stack rowGap={3} pb={4}>
        {items.map((data, index) => {
          return (
            <AnswerCard
              data={data}
              index={index}
              key={index}
              handleChangeItem={handleChangeItem}
              deleteItem={deleteItem}
            />
          );
        })}
        <div>
          <Button size="small" variant="text" onClick={addItem}>
            + Add Question
          </Button>
        </div>
      </Stack>

      {/* action buttons */}
      <div>
        {loading ? (
          <LinearProgress />
        ) : (
          <div className="flex justify-between">
            <button
              className="bg-red-600 text-white px-8 py-2 rounded font-semibold hover:bg-red-700 transition"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-900 text-white px-8 py-2 rounded font-semibold hover:bg-blue-800 transition"
              onClick={() => {}}
            >
              Upload questions
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CustomTab;
