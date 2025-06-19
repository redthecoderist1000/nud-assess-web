import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample Data
const totalMetrics = {
  totalQuizzesCreated: 20,
  totalQuizzesTaken: 150,
  averageScore: 75,
  passRate: 85,
};

const scoreRangeDistribution = [
  { range: "0-50%", count: 10 },
  { range: "51-70%", count: 30 },
  { range: "71-90%", count: 50 },
  { range: "91-100%", count: 20 },
];

const highestLowestScore = {
  highest: 98,
  lowest: 45,
};

const studentsPerQuiz = [
  { quiz: "Quiz 1", students: 30 },
  { quiz: "Quiz 2", students: 25 },
  { quiz: "Quiz 3", students: 40 },
  { quiz: "Quiz 4", students: 35 },
];

const completionRate = [
  { quiz: "Quiz 1", rate: 90 },
  { quiz: "Quiz 2", rate: 85 },
  { quiz: "Quiz 3", rate: 80 },
  { quiz: "Quiz 4", rate: 95 },
];

const topicDistribution = [
  { topic: "Math", count: 10 },
  { topic: "Science", count: 8 },
  { topic: "History", count: 5 },
  { topic: "English", count: 7 },
];

const quizPerformanceTrend = [
  { quiz: "Quiz 1", avgScore: 75 },
  { quiz: "Quiz 2", avgScore: 80 },
  { quiz: "Quiz 3", avgScore: 70 },
  { quiz: "Quiz 4", avgScore: 85 },
];

const quizEngagementOverTime = [
  { date: "Week 1", quizzesTaken: 20 },
  { date: "Week 2", quizzesTaken: 30 },
  { date: "Week 3", quizzesTaken: 25 },
  { date: "Week 4", quizzesTaken: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const QuizAnalytics = () => {
  return (
    <>
      {/* Metrics Overview */}
      <Stack direction="row" justifyContent="space-between" spacing={3}>
        {[
          {
            label: "Total Quizzes Created",
            value: totalMetrics.totalQuizzesCreated,
          },
          {
            label: "Total Quizzes Taken",
            value: totalMetrics.totalQuizzesTaken,
          },
          {
            label: "Average Score (%)",
            value: `${totalMetrics.averageScore}%`,
          },
          { label: "Pass Rate (%)", value: `${totalMetrics.passRate}%` },
        ].map((metric, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              flex: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              {metric.label}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {metric.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Score Range Distribution & Highest/Lowest Score */}
      <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Score Range Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreRangeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Highest & Lowest Score (%)
          </Typography>
          <ResponsiveContainer height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Highest Score",
                    value: highestLowestScore.highest,
                  },
                  { name: "Lowest Score", value: highestLowestScore.lowest },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                <Cell fill="#0088FE" />
                <Cell fill="#FF8042" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Highest Score:</strong> {highestLowestScore.highest}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Lowest Score:</strong> {highestLowestScore.lowest}%
            </Typography>
          </Box>
        </Paper>
      </Stack>

      {/* Students Per Quiz, Completion Rate, Topic Distribution */}
      <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Students Per Quiz
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentsPerQuiz}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Completion Rate (%)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Topic Distribution
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Topic</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Number of Quizzes</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topicDistribution.map((topic, index) => (
                  <TableRow key={index}>
                    <TableCell>{topic.topic}</TableCell>
                    <TableCell>{topic.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      {/* Performance & Engagement Charts */}
      <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Average Performance Per Quiz
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quizPerformanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgScore" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, width: "100%", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Quiz Engagement Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quizEngagementOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quizzesTaken" stroke="#00C49F" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Stack>
    </>
  );
};

export default QuizAnalytics;
