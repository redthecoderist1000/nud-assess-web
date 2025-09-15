import {
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import logo from "../../assets/images/logo.png";

function LoadingScreen() {
  return (
    <Grid container sx={{ height: "100vh" }} alignItems="center">
      <Stack sx={{ width: "100%" }} alignItems="center" spacing={2}>
        {/* logo */}
        <img src={logo} alt="logo" style={{ height: "70px" }} />
        {/* linear progress */}
        {/* <LinearProgress
          sx={{
            bgcolor: "white",
            color: "#35408E",
            width: "50%",
            height: "10px",
            borderRadius: "5px",
          }}
          color="#35408E"
        /> */}
        <CircularProgress sx={{ color: "#35408E" }} />
        {/* text */}
        {/* <Typography color="#35408E">Loading...</Typography> */}
      </Stack>
    </Grid>
  );
}

export default LoadingScreen;
