import React from "react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { year: 2020, value: 60 },
  { year: 2021, value: 72 },
  { year: 2022, value: 85 },
  { year: 2023, value: 90 },
  { year: 2024, value: 95 },
  { year: 2025, value: 100 },
];

const LineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} />
        <YAxis domain={[60, 100]} tick={{ fontSize: 14 }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#35408E" strokeWidth={3} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
