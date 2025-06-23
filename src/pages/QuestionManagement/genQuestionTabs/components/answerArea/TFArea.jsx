import React, { useContext } from "react";
import { questionContext } from "../../CustomTab";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

function TFArea(props) {
  const { index } = props;
  const { items, setItems } = useContext(questionContext);

  return (
    <div>
      <FormControl fullWidth>
        <RadioGroup>
          <Stack direction="row" justifyContent="space-evenly">
            <FormControlLabel
              value="true"
              control={
                <Radio
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label="True"
            />
            <FormControlLabel
              value="false"
              control={
                <Radio
                  color="success"
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label="False"
            />
          </Stack>
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default TFArea;
