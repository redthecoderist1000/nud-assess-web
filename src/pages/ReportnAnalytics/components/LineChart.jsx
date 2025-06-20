import React, { useEffect, useState, useContext } from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { userContext } from "../../../App";
import { supabase } from "../../../helper/Supabase";

const LineChart = () => {
  const { user } = useContext(userContext); // Access user context
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAveScorePerClass();
  }, []);

  const fetchAveScorePerClass = async () => {
    let { data, error } = await supabase
      .from("vw_avescoreperclass")
      .select("*");

    if (error) {
      console.log("failed to fetch ave score per class:", error);
      return;
    }

    // setChartData(data);
    // console.log(data);
    setLoading(false);
  };

  if (loading) {
    return <p>Loading class average scores...</p>;
  }

  // if (error) {
  //   return <p className="text-red-500">Error: {error}</p>;
  // }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ReLineChart
        // data={chartData}
        data={[
          { name: "class_1", averageScore: 20 },
          { name: "class_2", averageScore: 50 },
          { name: "class_3", averageScore: 24 },
          { name: "class_4", averageScore: 34 },
        ]}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 14 }}
          label={{ value: "Class Name", position: "insideBottom", offset: -10 }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 14 }}
          label={{
            value: "Average Score (%)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="averageScore"
          stroke="#35408E"
          strokeWidth={3}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
