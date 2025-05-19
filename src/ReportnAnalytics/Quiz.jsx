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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample Data
const scoreDistribution = [
  { range: "90-100%", count: 5 },
  { range: "80-89%", count: 10 },
  { range: "70-79%", count: 15 },
  { range: "60-69%", count: 8 },
  { range: "<60%", count: 2 },
];

const passFailData = [
  { name: "Pass", value: 72 },
  { name: "Fail", value: 28 },
];

const questionPerformance = [
  { question: "Q1", correctRate: 90 },
  { question: "Q2", correctRate: 75 },
  { question: "Q3", correctRate: 50 },
  { question: "Q4", correctRate: 30 },
  { question: "Q5", correctRate: 20 },
];

const bloomLevels = [
  { level: "Remember", count: 10 },
  { level: "Apply", count: 3 },
  { level: "Analyze", count: 2 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const QuizAnalytics = () => {
  return (
    <Box p={4}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Quiz Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Detailed insights into quiz performance, question analysis, and student outcomes.
      </Typography>

      {/* Grid Layout */}
      <Grid container spacing={4}>
        {/* Total Overview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Score Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pass/Fail Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pass vs. Fail
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={passFailData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Question Performance */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Question Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questionPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="correctRate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bloom's Taxonomy Levels (Horizontal Bar Chart) */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bloom's Taxonomy Levels
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={bloomLevels}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="level" />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Suggested Improvements */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Suggested Improvements
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - Focus on improving questions with a correct rate below 50%.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - Ensure balanced representation of Bloom's taxonomy levels.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - Address topics with low performance in Table of Specification (TOS).
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizAnalytics;