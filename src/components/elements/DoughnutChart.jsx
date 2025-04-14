import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

const data = [
  { name: "Pass", value: 80 },
  { name: "Fail", value: 20 }
];

const COLORS = ["#35408E", "#880808"]; // Theme color for Pass, Red for Fail

const DoughnutChart = () => {
  return (
    <div className="p-4 w-1/2 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Pass vs Fail Rate</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
            paddingAngle={5}
            label={({ name, value }) => `${name} ${value}%`}
            labelStyle={{ fill: "#fff", fontSize: 14, fontWeight: "bold" }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
