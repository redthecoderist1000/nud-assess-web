import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const data = [
  { topic: "Algebra", percentage: 85 },
  { topic: "Trigonometry", percentage: 78 },
  { topic: "Calculus", percentage: 92 },
  { topic: "Statistics", percentage: 80 },
  { topic: "Geometry", percentage: 75 }
];

const HorizontalLineChart = () => {
  return (
    <div className="p-4 w-1/2 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Challenging Subjects</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data} margin={{ left: 0, right: 0 }} barCategoryGap={5}>
          {/* Gradient Fill */}
          <defs>
            <linearGradient id="fadeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#35408E" stopOpacity={1} />
              <stop offset="100%" stopColor="#35408E" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <XAxis type="number" domain={[60, 100]} tick={{ fill: "#35408E" }} />
          <YAxis type="category" dataKey="topic" tick={false} width={0} />
          <Tooltip />
          
          {/* Bars with Fade Effect & Labels Inside */}
          <Bar dataKey="percentage" fill="url(#fadeGradient)" barSize={20} radius={[0, 10, 10, 0]}>
            <LabelList dataKey="topic" position="insideLeft" fill="white" fontSize={12} dy={-2} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalLineChart;
