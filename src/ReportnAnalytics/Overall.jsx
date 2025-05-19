import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import QuizIcon from "@mui/icons-material/Quiz";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

// Sample data for charts and tables
const quizData = [
  { name: "Week 1", quizzes: 10 },
  { name: "Week 2", quizzes: 15 },
  { name: "Week 3", quizzes: 20 },
  { name: "Week 4", quizzes: 25 },
];

const userData = [
  { name: "Jan", users: 50 },
  { name: "Feb", users: 75 },
  { name: "Mar", users: 100 },
  { name: "Apr", users: 150 },
];

const tableRows = [
  { id: 1, subject: "Math", passRate: "85%", avgScore: "78%" },
  { id: 2, subject: "Science", passRate: "90%", avgScore: "82%" },
  { id: 3, subject: "History", passRate: "75%", avgScore: "70%" },
];

const tableColumns = [
  { field: "subject", headerName: "Subject", width: 150 },
  { field: "passRate", headerName: "Pass Rate", width: 150 },
  { field: "avgScore", headerName: "Average Score", width: 150 },
];

const Overall = () => {
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {/* Total Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <QuizIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h6">Total Quizzes Created</Typography>
              <Typography variant="h4" color="primary">
                120
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <PeopleIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4" color="primary">
                500
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <BarChartIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h6">Average Score</Typography>
              <Typography variant="h4" color="primary">
                78%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Grid Layout for Charts and Table */}
      <Grid container spacing={2} mt={2}>
        {/* Line Chart: Quizzes Taken Per Week */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Quizzes Taken Per Week
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quizzes" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart: New Users Registered Over Time */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              New Users Registered Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Data Table: Top Performing Subjects */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Subjects
            </Typography>
            <DataGrid
              rows={tableRows}
              columns={tableColumns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overall;