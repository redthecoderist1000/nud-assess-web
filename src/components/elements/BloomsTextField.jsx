import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import suggestQuestion from "../../helper/SuggestQuestion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

function BloomsTextField({
  value,
  onChange,
  cognitive_level,
  onUseSuggest,
  disabled = false,
}) {
  const [suggestion, setSuggestion] = useState("");
  const [suggestionUsed, setSuggestionUsed] = useState(false);
  const timeoutRef = useRef(null); // ⏱️ store timeout ID

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // cancel previous timeout
    }
    setSuggestion("");

    if (!suggestionUsed && !disabled) {
      timeoutRef.current = setTimeout(async () => {
        if (
          value.length < 5 ||
          cognitive_level === "" ||
          cognitive_level === undefined
        )
          return;
        const { data, error } = await suggestQuestion(cognitive_level, value);

        if (error) {
          setSuggestion("");
          return;
        }

        setSuggestion(data);
      }, 500); // delay in ms
    }
    return () => clearTimeout(timeoutRef.current); // cleanup on unmount
  }, [value, cognitive_level]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      useSuggestion();
    }
  };

  const useSuggestion = () => {
    if (suggestion) {
      onUseSuggest({ target: { name: "question", value: suggestion } });
      setSuggestion("");
      setSuggestionUsed(true);
    }
  };

  return (
    <FormControl fullWidth size="small" required disabled={disabled}>
      <InputLabel htmlFor="blooms-text-field">Question</InputLabel>
      <OutlinedInput
        label="Question"
        id="blooms-text-field"
        value={value}
        required
        name="question"
        onChange={(e) => {
          onChange(e);
          setSuggestionUsed(false);
        }}
        onKeyDown={handleKeyDown}
        //   sx={{ backgroundColor: "red", position: "relative" }}
        style={{ backgroundColor: "transparent", position: "relative" }}
        endAdornment={
          suggestion &&
          !disabled && (
            <Tooltip title="use suggestion" placement="top" arrow>
              <AutoAwesomeRoundedIcon
                onClick={useSuggestion}
                color="primary"
                sx={{
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          )
        }
      />
      {suggestion && !suggestionUsed && !disabled && (
        <Typography
          variant="caption"
          color="textSecondary"
          alignItems={"center"}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: "small" }} color="primary" />{" "}
          Suggestion: {suggestion}
        </Typography>
      )}
    </FormControl>
  );
}

export default BloomsTextField;
