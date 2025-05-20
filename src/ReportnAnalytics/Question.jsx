import React from "react";
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

// Sample Data
const totalQuestionsCreated = 100;
const totalQuestionsUsed = 50;

const mostMissedQuestions = [
  { question: "What is the main event in Philippines?", correctRate: 20 },
  { question: "What is 2 + 2?", correctRate: 30 },
  { question: "Define gravity.", correctRate: 25 },
  { question: "What is the capital of France?", correctRate: 15 },
  { question: "Explain photosynthesis.", correctRate: 10 },
  { question: "What is the boiling point of water?", correctRate: 35 },
  { question: "Who wrote Hamlet?", correctRate: 40 },
  { question: "What is the speed of light?", correctRate: 18 },
  { question: "What is the largest planet?", correctRate: 22 },
  { question: "What is the square root of 16?", correctRate: 28 },
];

const topicTags = [
  { topic: "Math", count: 15 },
  { topic: "Science", count: 10 },
  { topic: "History", count: 5 },
  { topic: "English", count: 20 },
];

const bloomLevels = [
  { level: "Remember", count: 15 },
  { level: "Understand", count: 10 },
  { level: "Apply", count: 15 },
  { level: "Analyze", count: 10 },
];

const tosPerformance = [
  { outcome: "LO1", performance: 85 },
  { outcome: "LO2", performance: 70 },
  { outcome: "LO3", performance: 60 },
  { outcome: "LO4", performance: 50 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const QuestionAnalytics = () => {
  return (
    <Box p={4}>
      {/* Top Row: Total Questions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center", height: "100px" }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Total Questions Created
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {totalQuestionsCreated}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center", height: "100px" }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Total Questions Used
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {totalQuestionsUsed}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Second Row: Most Missed Questions and Topic/Subject Tags */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Most Missed Questions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "300px"}}>
            <Typography variant="h6" gutterBottom>
              Top 10 Most Missed Questions
            </Typography>
            <TableContainer sx={{ maxHeight: "200px", overflowY: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Question</strong></TableCell>
                    <TableCell><strong>Correct Rate (%)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mostMissedQuestions.map((question, index) => (
                    <TableRow key={index}>
                      <TableCell>{question.question}</TableCell>
                      <TableCell>{question.correctRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Topic/Subject Tags */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "300px" }}>
            <Typography variant="h6" gutterBottom>
              Topic/Subject Tags
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicTags}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Third Row: Bloom Taxonomy Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, height: "300px" }}>
            <Typography variant="h6" gutterBottom>
              Bloom Taxonomy Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloomLevels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Fourth Row: Average Performance by TOS */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, height: "300px" }}>
            <Typography variant="h6" gutterBottom>
              Average Performance by TOS
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tosPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outcome" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#FF8042" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionAnalytics;