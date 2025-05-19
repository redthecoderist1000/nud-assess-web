import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
} from "recharts";

// Sample data
const subjectPerformance = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 90 },
  { subject: "History", score: 75 },
  { subject: "English", score: 80 },
];

const passFailData = [
  { name: "Pass", value: 70 },
  { name: "Fail", value: 30 },
];

const engagementData = [
  { name: "Participation", value: 80 },
  { name: "Completion", value: 60 },
];

const scoreImprovement = [
  { quiz: "Quiz 1", score: 70 },
  { quiz: "Quiz 2", score: 75 },
  { quiz: "Quiz 3", score: 80 },
  { quiz: "Quiz 4", score: 85 },
];

const classComparison = [
  { class: "Class A", avgScore: 85 },
  { class: "Class B", avgScore: 78 },
  { class: "Class C", avgScore: 82 },
];

const Class = () => {
  return (
    <Box p={4}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Class Report and Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Detailed analytics for class performance and engagement.
      </Typography>

      {/* Grid Layout */}
      <Grid container spacing={4}>
        {/* Average Score Per Subject */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average Score Per Subject
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Subject-Wise Performance (Radar Chart) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Subject-Wise Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={subjectPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pass/Fail Percentage */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pass/Fail Percentage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={passFailData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Student Engagement */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Student Engagement
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Score Improvement Trends */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Score Improvement Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreImprovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Comparison with Other Classes */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comparison with Other Classes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Class;