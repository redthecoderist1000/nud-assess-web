import { useContext, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { userContext } from "../App";
import { supabase } from "../helper/Supabase";

function AnnouncementTab() {
  const { user } = useContext(userContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    created_by: user.user_id,
  });
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      toolbarAdaptive: false,
      uploader: { insertImageAsBase64URI: true }, // configure image upalods
      addNewLine: false,
      statusbar: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        // "|",
        // "strikethrough",
        // "superscript",
        // "subscript",
        "|",
        "ul",
        "ol",
        "|",
        // "font",
        // "align",
        // "|",
        // "link",
        // "image",
      ],
    }),
    []
  );

  const handleJodit = (e) => {
    setFormData({ ...formData, content: e });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (formData.title == "" || formData.content == "") {
      setError("There are missing fields");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tbl_announcement")
      .insert(formData)
      .select("*")
      .single();

    if (error) {
      setError("Cannot post announcement");
      setLoading(false);
      return;
    }
    setFormData({ ...formData, content: "", title: "" });

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Announcements</h1>
      <Stack rowGap={2}>
        <TextField
          label="Title"
          type="text"
          variant="outlined"
          size="small"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
        ></TextField>
        <JoditEditor
          ref={editor}
          value={formData.content}
          config={config}
          onBlur={handleJodit}
        />
        <p className="text-red-500">{error}</p>
        {loading ? (
          <CircularProgress size="20px" />
        ) : (
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        )}
      </Stack>
    </div>
  );
}

export default AnnouncementTab;
