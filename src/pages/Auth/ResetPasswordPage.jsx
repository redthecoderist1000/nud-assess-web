import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../helper/Supabase";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { userContext } from "../../App";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { setSnackbar } = useContext(userContext);
  const [error, setError] = useState({});
  const [code, setCode] = useState(null);
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    cpassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const hash = location.hash;
    const params = new URLSearchParams(hash.slice(1));
    // const access_token = params.get("access_token");
    // setAccessToken(access_token);
    // console.log("Access Token from URL:", access_token);

    const code = params.get("code");
    const error = params.get("error");
    const error_code = params.get("error_code");
    const error_description = params.get("error_description");

    if (error) {
      setError({
        error: error,
        error_code: error_code,
        error_description: error_description,
      });
      return;
    }
    if (code) {
      // console.log("Code from URL:", code);
      setCode(code);
      return;
    }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.cpassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
      return;
    }

    if (!checkPasswordStrength()) {
      setSnackbar({
        open: true,
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        severity: "error",
      });
      return;
    }

    try {
      if (code) {
        // console.log(code);
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.log("Error exchanging code:", error);
          setSnackbar({
            open: true,
            message: error.message,
            severity: "error",
          });
          return;
        }
        // console.log("Data from code exchange:", data);
        const { error: sessionError } = await supabase.auth.setSession(
          data?.session.access_token
        );
        if (sessionError) {
          // console.log("Error setting session:", sessionError);
          setSnackbar({
            open: true,
            message: "Error setting session: " + sessionError.message,
            severity: "error",
          });
          return;
        }
      }
      // if (accessToken) {
      //   const { data, error } = await supabase.auth.setSession({
      //     access_token: accessToken,
      //   });
      //   if (error) {
      //     console.log(error);
      //     setSnackbar({
      //       open: true,
      //       message: "Error setting session with access token",
      //       severity: "error",
      //     });
      //     return;
      //   }
      // }

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        console.log("Error updating user:", error);
        setSnackbar({
          open: true,
          message: error.message,
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Password updated successfully. Proceed to log in.",
          severity: "success",
        });
        signOut();
        setFormData({ password: "", cpassword: "" });
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const checkPasswordStrength = () => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
    return regex.test(formData.password);
  };

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

  return (
    <Container maxWidth="sm">
      {isSuccess ? (
        <Card sx={{ p: 4, mt: 8 }} elevation={3}>
          <Stack alignItems={"center"} spacing={2}>
            <Typography variant="h5">Reset Password</Typography>
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: 60 }}
            />
            <Typography variant="body1">Success</Typography>
            <Typography variant="body2" color="textSecondary">
              You can now log in with your new password.
            </Typography>
          </Stack>
        </Card>
      ) : error.error ? (
        <Card sx={{ p: 4, mt: 8 }} elevation={3}>
          <Stack alignItems={"center"} spacing={2}>
            <Typography variant="h5">Reset Password</Typography>
            <HighlightOffRoundedIcon color="error" sx={{ fontSize: 60 }} />
            <Typography variant="body1">{error.error}</Typography>
            <Typography variant="body2" color="textSecondary">
              {error.error_description}
            </Typography>
          </Stack>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card sx={{ p: 4, mt: 8 }} elevation={3}>
            <Stack spacing={2}>
              <Typography variant="h5">Reset Password</Typography>
              <Tooltip title={passwordRequirements} arrow placement="right">
                <FormControl size="small" variant="outlined" fullWidth required>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput
                    label="New Password"
                    type={showPass ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    endAdornment={
                      <IconButton onClick={() => setShowPass(!showPass)}>
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    }
                  />
                </FormControl>
              </Tooltip>

              <FormControl size="small" variant="outlined" fullWidth required>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput
                  label="Confirm Password"
                  type={showCPass ? "text" : "password"}
                  value={formData.cpassword}
                  onChange={(e) =>
                    setFormData({ ...formData, cpassword: e.target.value })
                  }
                  endAdornment={
                    <IconButton onClick={() => setShowCPass(!showCPass)}>
                      {showCPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disableElevation
                sx={{
                  bgcolor: "#35408E",
                  color: "white",
                  "&:hover": { bgcolor: "#2c347a" },
                }}
              >
                Reset Password
              </Button>
            </Stack>
          </Card>
        </form>
      )}
    </Container>
  );
};

export default ResetPasswordPage;
