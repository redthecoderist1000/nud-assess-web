import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useEffect } from "react";

const ImagePreview = ({ imgPrev, setImagePrev }) => {
  return (
    <Dialog
      open={imgPrev.open}
      fullWidth
      maxWidth="md"
      onClose={() => setImagePrev({ open: false, image: null })}
      aria-labelledby="prev-image-title"
      aria-describedby="prev-image-description"
    >
      <DialogTitle id="prev-image-title">Preview Image</DialogTitle>
      <DialogContent>
        <img
          src={imgPrev.image}
          alt={`image preview`}
          style={{
            width: "100%",
            // objectFit: "cover",
            borderRadius: 5,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
