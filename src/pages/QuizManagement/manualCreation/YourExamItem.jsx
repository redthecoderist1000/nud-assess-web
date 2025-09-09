import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import React, { useState } from "react";
import { supabase } from "../../../helper/Supabase";

function YourExamItem({ data, onRemove, hidden }) {
  const [imageUrl, setImageUrl] = useState(null);

  const answer = () => {
    if (data.question_type === "Multiple Choice") {
      return data.answer.map((choice, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            backgroundColor: choice.is_correct ? "lightgreen" : "white",
            p: 1,
          }}
        >
          <Typography variant="body2">{choice.answer}</Typography>
        </Card>
      ));
    } else {
      return (
        <Card variant="outlined" sx={{ p: 1 }}>
          <Typography variant="body2">{data.answer[0].answer}</Typography>
        </Card>
      );
    }
  };

  // question_image/0.6658258055113795-FeXC3HEVUAAfibl.jpg
  // get image from supabase storage bucket

  // const getImage = async () => {

  const fetchImage = async () => {
    const { data: imageData } = await supabase.storage
      .from("question_image")
      .createSignedUrl(data.image, 3600);

    setImageUrl(imageData?.signedUrl);
    // console.log("image url:", imageData?.signedUrl);
  };

  if (data.image && data.id) {
    fetchImage();
  } else if (data.image && !data.id && imageUrl == null) {
    // if no id (new question) and has image and imageUrl is null, set imageUrl to local image
    const localImageUrl = URL.createObjectURL(data.image);
    setImageUrl(localImageUrl);
  }

  // };

  return (
    <div hidden={hidden}>
      <Stack spacing={1} p={3}>
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignContent={"center"}
        >
          <Typography variant="body1" fontWeight={600} color="textDisabled">
            {data.lesson_name}
          </Typography>
          <IconButton
            size="small"
            color="error"
            onClick={onRemove}
            sx={{ zIndex: 10 }}
          >
            <DeleteRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stack direction="row" justifyContent={"space-between"}>
          <Typography variant="body1" fontWeight={600} color="textDisabled">
            {data.cognitive_level}
          </Typography>
          <Typography variant="body1" fontWeight={600} color="textDisabled">
            {data.question_type}
          </Typography>
        </Stack>
        <Typography variant="h6">{data.question}</Typography>
        {data.image && (
          <Stack alignItems={"center"}>
            {imageUrl == null ? (
              <CircularProgress />
            ) : (
              <Stack
                maxHeight={300}
                maxWidth={600}
                width={"fit-content"}
                overflow={"auto"}
                borderRadius={5}
              >
                <img
                  src={imageUrl}
                  alt="question image"
                  style={{
                    height: "auto",
                  }}
                />
              </Stack>
            )}
          </Stack>
        )}
        {/* answer section */}
        <Stack spacing={0.5}>{answer()}</Stack>
        {/* etc details */}
        {data.id && (
          <Stack direction="row" justifyContent={"space-between"}>
            <Typography variant="subtitle2" color="textDisabled">
              Created by: {data.created_by}
            </Typography>
            <Typography variant="subtitle2" color="textDisabled">
              Usage count: {data.usage}
            </Typography>
          </Stack>
        )}
      </Stack>
    </div>
  );
}

export default YourExamItem;
