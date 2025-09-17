import { useRef, useState, useCallback, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import { userContext } from "../../App";

export default function FileUpload({ files, setFiles }) {
  //   const [files, setFiles] = useState([]);
  const { setSnackbar } = useContext(userContext);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const MAX_FILES = 3; // maximum number of files
  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

  const addFiles = useCallback((fileList) => {
    setError("");
    const arr = Array.from(fileList);
    const pdfs = arr.filter((f) => f.type === "application/pdf");
    if (pdfs.length !== arr.length) {
      setSnackbar({
        open: true,
        message: "Only PDF files are accepted. Non-PDF files were ignored.",
        severity: "warning",
      });
    }

    // enforce max file size
    const oversized = pdfs.filter((f) => f.size > MAX_BYTES);
    const validPdfs = pdfs.filter((f) => f.size <= MAX_BYTES);
    if (oversized.length > 0) {
      setSnackbar({
        open: true,
        message: `${oversized.length} file(s) exceed 10 MB and were ignored.`,
        severity: "warning",
      });
    }

    if (validPdfs.length === 0) return;

    setFiles((prev) => {
      const existing = new Map(prev.map((f) => [f.name + f.size, f]));
      const remainingSlots = MAX_FILES - existing.size;
      if (remainingSlots <= 0) {
        setSnackbar({
          open: true,
          message: `Maximum ${MAX_FILES} files allowed. Some files were ignored.`,
          severity: "warning",
        });
        return prev;
      }

      let addedCount = 0;
      for (const f of validPdfs) {
        const key = f.name + f.size;
        if (!existing.has(key) && addedCount < remainingSlots) {
          existing.set(key, f);
          addedCount++;
        }
        if (addedCount >= remainingSlots) break;
      }

      if (addedCount < validPdfs.length && addedCount > 0) {
        setSnackbar({
          open: true,
          message: `Only ${addedCount} file(s) added. Maximum ${MAX_FILES} files allowed.`,
          severity: "warning",
        });
      } else if (
        addedCount === 0 &&
        validPdfs.length > 0 &&
        existing.size < MAX_FILES
      ) {
        setSnackbar({
          open: true,
          message: `No new files were added. They may be duplicates or invalid PDFs.`,
          severity: "info",
        });
      }

      return Array.from(existing.values());
    });
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = (e) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = null;
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setError("");
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <Box component="section" width="100%">
      <input
        // required
        name="fileInput"
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
      <Paper
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        elevation={0}
        sx={{
          p: 1,
          border: "2px dashed",
          cursor: files.length > 0 ? "cursor" : "pointer",
          justifyItems: files.length > 0 ? "start" : "center",
          borderColor: "divider",
          bgcolor: isDragging ? "action.hover" : "background.paper",
        }}
        onClick={
          files.length > 0
            ? () => {}
            : () => inputRef.current && inputRef.current.click()
        }
        aria-label="Drop PDF files here or click to select"
      >
        {files.length > 0 ? (
          <Stack
            columnGap={1}
            rowGap={1}
            direction={"row"}
            flexWrap="wrap"
            alignItems="center"
          >
            {files.map((f, i) => (
              <Chip
                key={i}
                sx={{
                  justifyContent: "space-between",
                  width: "fit-content",
                  p: 1,
                }}
                icon={<PictureAsPdfRoundedIcon color="error" sx={{ mr: 1 }} />}
                label={
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ maxWidth: 320 }}
                  >
                    <Tooltip title={f.name}>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          maxWidth: "200px", // adjust to fit your layout
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {f.name}
                      </Box>
                    </Tooltip>

                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", ml: 0.5 }}
                    >
                      ({formatBytes(f.size)})
                    </Typography>
                  </Stack>
                }
                onDelete={() => removeFile(i)}
              />
            ))}
            {files.length <= 4 && (
              <Stack direction="row" spacing={2}>
                <Button
                  size="small"
                  color="error"
                  disableElevation
                  onClick={clearAll}
                >
                  clear
                </Button>
              </Stack>
            )}
          </Stack>
        ) : (
          <Stack alignItems="center" justifyContent="center">
            <Stack direction={"row"} spacing={2} alignItems="center">
              <DriveFolderUploadRoundedIcon
                fontSize="large"
                sx={{ color: "grey.700" }}
              />
              <div>
                <Typography variant="subtitle1">
                  Upload PDF files here
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Drag and drop your files or click to select files
                </Typography>
              </div>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
            >
              Files must be: maximum of {MAX_FILES} files, each up to{" "}
              {MAX_BYTES / 1024 / 1024}mb. Only PDF files are accepted.
            </Typography>
          </Stack>
        )}
        {/* error */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
