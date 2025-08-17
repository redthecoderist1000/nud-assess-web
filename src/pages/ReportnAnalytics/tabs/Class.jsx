import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const classes = ["BSIT 3A", "BSIT 3B", "BSCS 4A"];

// Sample Data
const classSummary = {
  "BSIT 3A": {
    students: 40,
    quizzes: 10,
    avgScore: 85,
    passRate: 90,
  },
  "BSIT 3B": {
    students: 35,
    quizzes: 8,
    avgScore: 78,
    passRate: 85,
  },
  "BSCS 4A": {
    students: 30,
    quizzes: 12,
    avgScore: 88,
    passRate: 92,
  },
};

const quizzes = [
  { name: "Quiz 1", avgScore: 85, highest: 95, lowest: 70, passRate: 90 },
  { name: "Quiz 2", avgScore: 80, highest: 90, lowest: 65, passRate: 85 },
  { name: "Quiz 3", avgScore: 78, highest: 88, lowest: 60, passRate: 80 },
];

const lessonPerformance = [
  { lesson: "Lesson 1", performance: 85 },
  { lesson: "Lesson 2", performance: 78 },
  { lesson: "Lesson 3", performance: 92 },
  { lesson: "Lesson 4", performance: 88 },
  { lesson: "Lesson 5", performance: 75 },
];

const bloomTaxonomy = [
  { level: "Remembering", questions: 25 },
  { level: "Understanding", questions: 20 },
  { level: "Applying", questions: 15 },
  { level: "Analyzing", questions: 10 },
  { level: "Evaluating", questions: 7 },
  { level: "Creating", questions: 3 },
];

const topicPerformance = [
  { topic: "Math", avgScore: 85 },
  { topic: "Science", avgScore: 90 },
  { topic: "History", avgScore: 75 },
  { topic: "English", avgScore: 80 },
];

const students = [
  {
    name: "John Doe",
    quizzesTaken: 10,
    avgScore: 85,
    tosMastery: "High",
    completionRate: "100%",
  },
  {
    name: "Jane Smith",
    quizzesTaken: 9,
    avgScore: 80,
    tosMastery: "Medium",
    completionRate: "90%",
  },
  {
    name: "Alice Johnson",
    quizzesTaken: 8,
    avgScore: 78,
    tosMastery: "Low",
    completionRate: "80%",
  },
];

const tosPlacementPerformance = [
  { placement: "Remember", performance: 85 },
  { placement: "Understand", performance: 78 },
  { placement: "Apply", performance: 92 },
  { placement: "Analyze", performance: 88 },
  { placement: "Evaluate", performance: 75 },
];

const ClassReports = () => {
  const [selectedClass, setSelectedClass] = useState("BSIT 3A");

  const handleExport = () => {
    alert("Exporting Class Report as PDF/Excel...");
  };

  return (
    <Stack rowGap={4}>
      {/* Class Selector */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Class-Level Reports
        </Typography>
        <Select
          size="small"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {classes.map((cls, index) => (
            <MenuItem key={index} value={cls}>
              {cls}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Class Summary */}
      <Stack direction="row" spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {
                [
                  "Number of Students",
                  "Number of Quizzes",
                  "Average Class Score",
                  "Pass Rate",
                ][index]
              }
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {index === 0
                ? classSummary[selectedClass].students
                : index === 1
                  ? classSummary[selectedClass].quizzes
                  : index === 2
                    ? classSummary[selectedClass].avgScore
                    : index === 3
                      ? classSummary[selectedClass].passRate + "%"
                      : ""}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Performance by Quiz */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance by Quiz
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quiz</TableCell>
                <TableCell>Average Score</TableCell>
                <TableCell>Highest Score</TableCell>
                <TableCell>Lowest Score</TableCell>
                <TableCell>Pass Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.name}>
                  <TableCell>{quiz.name}</TableCell>
                  <TableCell>{quiz.avgScore}</TableCell>
                  <TableCell>{quiz.highest}</TableCell>
                  <TableCell>{quiz.lowest}</TableCell>
                  <TableCell>{quiz.passRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Performance Per Lesson */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Per Lesson
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lessonPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="lesson"
              label={{
                value: "Lesson Number",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Performance (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#8884d8"
              name="Performance"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Performance Per Placement in TOS */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Per Placement in TOS
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tosPlacementPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="placement"
              label={{
                value: "Placement",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Performance (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="performance" fill="#82ca9d" name="Performance" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Bloom's Taxonomy Analysis */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bloom's Taxonomy Analysis
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Bloom Level</strong>
                </TableCell>
                <TableCell>
                  <strong>Number of Questions</strong>
                </TableCell>
                <TableCell>
                  <strong>Percentage</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bloomTaxonomy.map((entry) => {
                const totalQuestions = bloomTaxonomy.reduce(
                  (sum, item) => sum + item.questions,
                  0
                );
                const percentage = (
                  (entry.questions / totalQuestions) *
                  100
                ).toFixed(2);
                return (
                  <TableRow key={entry.level}>
                    <TableCell>{entry.level}</TableCell>
                    <TableCell>{entry.questions}</TableCell>
                    <TableCell>{percentage}%</TableCell>
                  </TableRow>
                );
              })}
              {/* Total Row */}
              <TableRow>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {bloomTaxonomy.reduce(
                      (sum, item) => sum + item.questions,
                      0
                    )}
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>100%</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Topic/Subject Performance */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Topic/Subject Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={topicPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgScore" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Student Summary */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Student Summary
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Total Quizzes Taken</TableCell>
                <TableCell>Average Score</TableCell>
                <TableCell>TOS Mastery</TableCell>
                <TableCell>Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.name}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.quizzesTaken}</TableCell>
                  <TableCell>{student.avgScore}</TableCell>
                  <TableCell>{student.tosMastery}</TableCell>
                  <TableCell>{student.completionRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Export Button */}
      {/* <Button variant="contained" color="primary" onClick={handleExport}>
        Export Class Report
      </Button> */}
    </Stack>
  );
};

export default ClassReports;
