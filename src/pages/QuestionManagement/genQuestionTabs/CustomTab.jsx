import { Box, Button, LinearProgress, Stack } from "@mui/material";
import { createContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnswerCard from "./components/AnswerCard";
import { supabase } from "../../../helper/Supabase";

export const questionContext = createContext();

function CustomTab(props) {
  const { subject, lesson } = props;
  const location = useLocation();
  const repository = location.state.repository;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    {
      question: "",
      type: "Multiple Choice",
      blooms_category: "",
      repository: repository,
      answers: [
        {
          answer: "",
          is_correct: true,
        },
      ],
    },
  ]);

  const handleChangeItem = (e, index) => {
    // console.log("change name:", e.target.name);
    // console.log("change value:", e.target.value);

    let newItems = items;

    // if type ung changes
    if (e.target.name == "type") {
      let newAnswer;
      switch (e.target.value) {
        case "T/F":
          newAnswer = {
            answer: "True",
          };
          break;
        case "Multiple Choice":
          newAnswer = [
            {
              answer: "",
              is_correct: true,
            },
          ];
          break;
        case "Identification":
          newAnswer = {
            answer: "",
          };
          break;
        default:
          break;
      }

      newItems = items.map((d, i) =>
        index == i
          ? {
              ...d,
              type: e.target.value,
              answers: newAnswer,
            }
          : d
      );

      setItems(newItems);
      return;
    }

    // not type
    newItems = items.map((d, i) =>
      index == i ? { ...d, [e.target.name]: e.target.value } : d
    );
    setItems(newItems);
  };

  const handleChangeQuestion = (e, index) => {
    setItems((prev) =>
      prev.map((d, i) => (index == i ? { ...d, question: e } : d))
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        question: "",
        type: "Multiple Choice",
        blooms_category: "",
        repository: repository,
        answers: [
          {
            answer: "",
            is_correct: true,
          },
        ],
      },
    ]);
  };

  const uploadQuestion = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!subject || !lesson) {
      console.error("select subject and lesson first");
      setLoading(false);

      return;
    }

    items.map(async (d, i) => {
      const { data: question_id, error } = await supabase
        .from("tbl_question")
        .insert({
          question: d.question,
          type: d.type,
          blooms_category: d.blooms_category,
          repository: d.repository,
          lesson_id: lesson,
        })
        .select("id")
        .single();

      if (Array.isArray(d.answers)) {
        // multiple answers (Multiple Chiooice, etc.)
        d.answers.map(async (ans, _) => {
          await supabase.from("tbl_answer").insert({
            question_id: question_id.id,
            answer: ans.answer,
            is_correct: ans.is_correct,
          });
        });
      } else {
        // siingle answer (T/F, Identification, etc.)
        await supabase
          .from("tbl_answer")
          .insert({ question_id: question_id.id, answer: d.answers.answer });
      }
    });

    setItems([]);
    setLoading(false);
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
                handleChangeQuestion={handleChangeQuestion}
                lesson_id={lesson}
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
