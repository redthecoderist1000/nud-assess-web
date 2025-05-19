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
const tosCoverage = [
  { outcome: "LO1", planned: 30, actual: 25 },
  { outcome: "LO2", planned: 20, actual: 15 },
  { outcome: "LO3", planned: 25, actual: 30 },
  { outcome: "LO4", planned: 25, actual: 20 },
];

const outcomePerformance = [
  { outcome: "LO1", accuracy: 85 },
  { outcome: "LO2", accuracy: 38 },
  { outcome: "LO3", accuracy: 72 },
  { outcome: "LO4", accuracy: 65 },
];

const questionDifficulty = [
  { question: "Q1", correctRate: 90, difficulty: "Easy" },
  { question: "Q2", correctRate: 65, difficulty: "Moderate" },
  { question: "Q3", correctRate: 45, difficulty: "Difficult" },
  { question: "Q4", correctRate: 30, difficulty: "Difficult" },
];

const bloomLevels = [
  { level: "Remember", count: 10 },
  { level: "Understand", count: 8 },
  { level: "Apply", count: 5 },
  { level: "Analyze", count: 3 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Question = () => {
  return (
    <Box p={4}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Question Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Detailed insights into TOS alignment, question difficulty, and performance.
      </Typography>

      {/* Grid Layout */}
      <Grid container spacing={4}>
        {/* TOS Alignment: Planned vs Actual */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              TOS Alignment: Planned vs Actual
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tosCoverage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outcome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Outcome-Based Performance */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Outcome-Based Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outcomePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outcome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Question Difficulty */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Question Difficulty
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questionDifficulty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="correctRate" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bloom's Taxonomy Levels */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bloom's Taxonomy Levels
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloomLevels}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {bloomLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Question;