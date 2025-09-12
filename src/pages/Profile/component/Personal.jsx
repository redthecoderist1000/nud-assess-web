import React, { useContext, useState } from "react";
import { userContext } from "../../../App";
import { Button, Stack, TextField } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import { supabase } from "../../../helper/Supabase";

const Personal = ({ setSnackbar }) => {
  const { user, setUser } = useContext(userContext);
  const [formData, setFormData] = useState({
    f_name: user?.f_name || "",
    m_name: user?.m_name || "",
    l_name: user?.l_name || "",
  });
  const [loading, setLoading] = useState(false);

  const hasChanges =
    formData.f_name !== (user?.f_name || "") ||
    formData.m_name !== (user?.m_name || "") ||
    formData.l_name !== (user?.l_name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      setSnackbar({
        open: true,
        message: "No changes detected.",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("tbl_users")
      .update({
        f_name: formData.f_name,
        m_name: formData.m_name,
        l_name: formData.l_name,
      })
      .eq("id", user.user_id)
      .select()
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to update personal info.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    setUser({
      ...user,
      f_name: data.f_name,
      m_name: data.m_name,
      l_name: data.l_name,
    });

    setSnackbar({
      open: true,
      message: "Personal info updated successfully!",
      severity: "success",
    });

    setLoading(false);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Person2RoundedIcon sx={{ color: "#4F46E5" }} />
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
        </div>
        <p className="text-gray-500 text-sm">Update your personal details</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Stack rowGap={2}>
          <TextField
            value={formData.f_name}
            label="First Name"
            variant="outlined"
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, f_name: e.target.value })
            }
            fullWidth
            sx={{ backgroundColor: "#f3f4f6" }}
          />
          <TextField
            value={formData.m_name}
            label="Middle Name"
            variant="outlined"
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, m_name: e.target.value })
            }
            fullWidth
            sx={{ backgroundColor: "#f3f4f6" }}
          />
          <TextField
            value={formData.l_name}
            label="Last Name"
            variant="outlined"
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, l_name: e.target.value })
            }
            fullWidth
            sx={{ backgroundColor: "#f3f4f6" }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disableElevation
            disabled={!hasChanges}
            loading={loading}
            startIcon={<CheckRoundedIcon />}
            sx={{
              backgroundColor: "#2D3B87",
              "&:hover": { backgroundColor: "#1a2561" },
            }}
          >
            Update Personal Info
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default Personal;
