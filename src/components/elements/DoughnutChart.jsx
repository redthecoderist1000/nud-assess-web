import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DoughnutChart = ({ classId }) => {
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateCompletionRate = async (classId) => {

    const mockCompleted = 42;
    const mockTotal = 60;

    setCompleted(mockCompleted);
    setTotal(mockTotal);
  };

  useEffect(() => {
    if (classId) {
      calculateCompletionRate(classId);
    }
  }, [classId]);

  const completedRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const incompleteRate = 100 - completedRate;

  const data = [
    { name: "Completed", value: completedRate },
    { name: "Incomplete", value: incompleteRate },
  ];

  const COLORS = ["#35408E", "#A9A9A9"];

  return (
    <div className="p-4 w-1/2 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Quiz Completion Rate</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
            paddingAngle={5}
            label={({ name, value }) => `${name} ${value}%`}
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
