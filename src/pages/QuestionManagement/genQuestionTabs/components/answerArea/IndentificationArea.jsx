import { TextField } from "@mui/material";
import { useContext } from "react";
import { questionContext as AutoContext } from "../../AutoTab";

function IndentificationArea(props) {
  const { index } = props;
  const context = useContext(AutoContext);
  const { items, setItems, lesson } = context;

  const setAnswer = (e) => {
    const newAnswer = items.map((d, i) =>
      index == i ? { ...d, answers: { answer: e.target.value } } : d
    );
    setItems(newAnswer);
  };

  return (
    <TextField
      required
      size="small"
      fullWidth
      sx={{ maxWidth: "sm" }}
      label="Answer"
      value={items[index].answers.answer}
      type="text"
      onChange={setAnswer}
    />
  );
}

export default IndentificationArea;
