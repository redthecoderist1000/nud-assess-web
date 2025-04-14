import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { subject: "INF221", score: 85 },
  { subject: "INF222", score: 75 },
  { subject: "INF223", score: 90 }
];

const VerticalBarChart = () => {
  return (
    <div className="p-4  bg-white shadow-lg rounded-lg mt-4 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Performance Scores</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" label={{ value: "Subjects", position: "insideBottom", dy: 10 }} />
          <YAxis label={{ value: "Performance Score", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="score" fill="#35408E" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerticalBarChart;
