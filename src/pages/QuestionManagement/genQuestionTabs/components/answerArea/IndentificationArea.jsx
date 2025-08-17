import { TextField } from "@mui/material";
import { useContext } from "react";
import { questionContext } from "../../CustomTab";

function IndentificationArea(props) {
  const { index } = props;
  const { items, setItems } = useContext(questionContext);

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
