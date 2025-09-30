import React, { useContext, useState } from "react";
import LogoutDialog from "./LogoutDialog";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
const env = import.meta.env;

const Privacy = () => {
  const { user, setSnackbar } = useContext(userContext);
  const [logout, setLogout] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurPassword, setShowCurPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const hasInput = Object.values(formData).some((value) => value !== "");

  const passwordRequirements = (
    <div className="text-xs">
      <p>Password must be at least:</p>
      <ul className="list-disc list-inside">
        <li>8 characters</li>
        <li>One uppercase letter (A-Z)</li>
        <li>One lowercase letter (a-z)</li>
        <li>One number (0-9)</li>
        <li>One special character (@$#!%*?&)</li>
      </ul>
    </div>
  );

  const checkPasswordStrength = () => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
    return regex.test(formData.newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPasswordStrength() && env.VITE_ENVIRONMENT === "deployed") {
      setSnackbar({
        open: true,
        message: "Password must satisfy the requirements.",
        severity: "error",
      });
      return;
    } else if (formData.newPassword !== formData.confirmPassword) {
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
          <Person2RoundedIcon sx={{ color: "#4F46E5" }} />
          <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Update your password and manage account access
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Stack rowGap={2}>
          <FormControl required variant="outlined" size="small" fullWidth>
            <InputLabel>Current Password</InputLabel>
            <OutlinedInput
              value={formData.currentPassword}
              label="Current Password"
              type={showCurPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              sx={{ backgroundColor: "#f3f4f6" }}
              endAdornment={
                <IconButton onClick={() => setShowCurPassword((prev) => !prev)}>
                  {showCurPassword ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              }
            />
          </FormControl>
          <Tooltip title={passwordRequirements} arrow placement="right">
            <FormControl required variant="outlined" size="small" fullWidth>
              <InputLabel>Enter New Password</InputLabel>
              <OutlinedInput
                value={formData.newPassword}
                type={showPassword ? "text" : "password"}
                label="Enter New Password"
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                sx={{ backgroundColor: "#f3f4f6" }}
                endAdornment={
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <VisibilityRoundedIcon />
                    )}
                  </IconButton>
                }
              />
            </FormControl>
          </Tooltip>

          <FormControl required variant="outlined" size="small" fullWidth>
            <InputLabel>Confirm New Password</InputLabel>
            <OutlinedInput
              value={formData.confirmPassword}
              label="Confirm New Password"
              type={showCPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              sx={{ backgroundColor: "#f3f4f6" }}
              endAdornment={
                <IconButton onClick={() => setShowCPassword((prev) => !prev)}>
                  {showCPassword ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              }
            />
          </FormControl>

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
          Sign Out
        </Button>
      </div>

      <LogoutDialog open={logout} onClose={() => setLogout(false)} />
    </div>
  );
};

export default Privacy;
