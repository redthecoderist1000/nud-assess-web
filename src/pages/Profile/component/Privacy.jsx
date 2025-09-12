import React, { useContext, useState } from "react";
import LogoutDialog from "./LogoutDialog";
import { Button, Stack, TextField } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";

const Privacy = ({ setSnackbar }) => {
  const { user } = useContext(userContext);
  const [logout, setLogout] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const hasInput = Object.values(formData).some((value) => value !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New password and confirmation do not match.",
        severity: "error",
      });
      return;
    }
    setLoading(true);

    // check current password by login in
    const { error: checkError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: formData.currentPassword,
    });

    if (checkError) {
      setSnackbar({
        open: true,
        message: "Current password is incorrect.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setSnackbar({
        open: true,
        message: "New password must be different from current password.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });

    if (updateError) {
      setSnackbar({
        open: true,
        message: "Failed to update password.",
        severity: "error",
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setLoading(false);
      return;
    }

    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

    setSnackbar({
      open: true,
      message: "Password updated successfully.",
      severity: "success",
    });
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Privacy Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-indigo-600">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-1.33-2.67-4-8-4z"
                fill="currentColor"
              />
            </svg>
          </span>
          <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Update your password and manage account access
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Stack rowGap={2}>
          <TextField
            required
            value={formData.currentPassword}
            label="Current Password"
            variant="outlined"
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            fullWidth
            sx={{ backgroundColor: "#f3f4f6" }}
          />
          <TextField
            required
            value={formData.newPassword}
            label="Enter New Password"
            variant="outlined"
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            fullWidth
            sx={{ backgroundColor: "#f3f4f6" }}
          />
          <TextField
            required
            value={formData.confirmPassword}
            label="Confirm Password"
            variant="outlined"
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            fullWidth
            sx={{ backgroundColor: "#f3f4f6" }}
          />
          <Button
            fullWidth
            type="submit"
            sx={{
              backgroundColor: "#2D3B87",
              "&:hover": { backgroundColor: "#1e2a78" },
            }}
            disableElevation
            variant="contained"
            startIcon={<CheckRoundedIcon />}
            disabled={!hasInput}
          >
            Update Password
          </Button>
        </Stack>
      </form>
      <hr className="border-gray-300 my-6" />
      {/* Log Out Section */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-900 mb-1">Sign Out</h3>
        <p className="text-gray-500 text-sm mb-2">
          Sign out of your TestBank Pro account on this device
        </p>

        <Button
          variant="contained"
          color="error"
          fullWidth
          disableElevation
          startIcon={<LogoutRoundedIcon />}
          onClick={() => setLogout(true)}
        >
          Sign Out Account
        </Button>
      </div>

      <LogoutDialog open={logout} onClose={() => setLogout(false)} />
    </div>
  );
};

export default Privacy;
