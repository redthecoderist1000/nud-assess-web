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
    const fetchClassAverageScores = async () => {
      try {
        if (!user?.user_id) {
          throw new Error("User is not logged in.");
        }

        setLoading(true);

        // Fetch all classes created by the logged-in user
        const { data: classes, error: classesError } = await supabase
          .from("tbl_class")
          .select("id, class_name")
          .eq("created_by", user.user_id);

        if (classesError) throw new Error(classesError.message);

        const averageScoresData = await Promise.all(
          classes.map(async (cls) => {
            const { data: quizzes, error: quizzesError } = await supabase
              .from("tbl_exam")
              .select("id")
              .eq("created_by", user.user_id);

            if (quizzesError) throw new Error(quizzesError.message);
            const examIds = quizzes.map((quiz) => quiz.id);

            const { data: results, error: resultsError } = await supabase
              .from("tbl_result")
              .select("correct_items, total_items")
              .in("exam_id", examIds);

            if (resultsError) throw new Error(resultsError.message);

            const totalCorrectItems = results.reduce(
              (sum, result) => sum + result.correct_items,
              0
            );
            const totalItems = results.reduce(
              (sum, result) => sum + result.total_items,
              0
            );

            const averageScore =
              totalItems > 0
                ? Math.round((totalCorrectItems / totalItems) * 100)
                : 0; //computation

            return {
              name: cls.class_name,
              averageScore,
            };
          })
        );

        setChartData(averageScoresData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      fetchClassAverageScores();
    }
  }, [user]);

  if (loading) {
    return <p>Loading class average scores...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ReLineChart
        data={chartData}
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
