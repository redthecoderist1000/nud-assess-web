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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// Sample Data
const overallPerformance = [
  { quiz: "Quiz 1", score: 75 },
  { quiz: "Quiz 2", score: 80 },
  { quiz: "Quiz 3", score: 85 },
  { quiz: "Quiz 4", score: 90 },
];

const learningOutcomePerformance = [
  { outcome: "LO1", score: 85 },
  { outcome: "LO2", score: 60 },
  { outcome: "LO3", score: 45 },
  { outcome: "LO4", score: 70 },
];

const topicPerformance = [
  { topic: "Algebra", score: 88 },
  { topic: "Geometry", score: 60 },
  { topic: "Trigonometry", score: 75 },
  { topic: "Calculus", score: 90 },
];

const bloomPerformance = [
  { level: "Remember", score: 88 },
  { level: "Apply", score: 60 },
  { level: "Analyze", score: 45 },
];

const quizBreakdown = [
  { quiz: "Quiz 1", score: 75, date: "2023-01-01", pass: true },
  { quiz: "Quiz 2", score: 80, date: "2023-02-01", pass: true },
  { quiz: "Quiz 3", score: 85, date: "2023-03-01", pass: true },
  { quiz: "Quiz 4", score: 90, date: "2023-04-01", pass: true },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Student = () => {
  return (
    <Box p={4}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Question Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Detailed insights into overall performance, learning outcomes, topics, and Bloom's taxonomy.
      </Typography>

      {/* Grid Layout */}
      <Grid container spacing={4}>
        {/* Overall Performance Summary */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Performance Summary
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={overallPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance per Learning Outcome */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance per Learning Outcome
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={learningOutcomePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outcome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance by Topic/Subject */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance by Topic/Subject
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={topicPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis />
                <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bloom's Taxonomy Mastery */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bloom's Taxonomy Mastery
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bloomPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="level" />
                <Tooltip />
                <Bar dataKey="score" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quiz Performance Breakdown */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quiz Performance Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Pass/Fail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizBreakdown.map((quiz) => (
                    <TableRow key={quiz.quiz}>
                      <TableCell>{quiz.quiz}</TableCell>
                      <TableCell>{quiz.score}</TableCell>
                      <TableCell>{quiz.date}</TableCell>
                      <TableCell>{quiz.pass ? "Pass" : "Fail"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Student;