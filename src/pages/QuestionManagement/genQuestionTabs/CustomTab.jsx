import { Box, Button, LinearProgress, Stack } from "@mui/material";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnswerCard from "./components/AnswerCard";

export const questionContext = createContext();

function CustomTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    {
      question: "",
      type: "Multiple Choice",
      blooms_category: "",
      answers: [
        {
          answer: "",
          is_correct: false,
        },
      ],
    },
  ]);

  const handleChangeItem = (e, index) => {
    setItems((prev) =>
      prev.map((d, i) =>
        index == i ? { ...d, [e.target.name]: e.target.value } : d
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        question: "",
        type: "Multiple Choice",
        blooms_category: "",
        answers: [
          {
            answer: "",
            is_correct: false,
          },
        ],
      },
    ]);
  };

  const uploadQuestion = (e) => {
    e.preventDefault();
  };

  return (
    <Box component="form" onSubmit={uploadQuestion}>
      <Stack rowGap={3} pb={4}>
        {items.map((data, index) => {
          return (
            <questionContext.Provider value={{ items, setItems }} key={index}>
              <AnswerCard
                data={data}
                index={index}
                handleChangeItem={handleChangeItem}
              />
            </questionContext.Provider>
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
              type="submit"
            >
              Upload questions
            </button>
          </div>
        )}
      </div>
    </Box>
  );
}

export default CustomTab;
