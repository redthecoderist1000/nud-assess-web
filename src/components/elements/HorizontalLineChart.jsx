import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { supabase } from "../../helper/Supabase";

const HorizontalLineChart = () => {
  const [tosData, setTosData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTOSPerformance = async () => {
      try {
        const { data, error } = await supabase
          .from("tbl_tos")
          .select(
            `
            remembering,
            understanding,
            applying,
            analyzing,
            evaluating,
            creating
            `
          );

        if (error) {
          console.error("Error fetching TOS data:", error);
          setError("Failed to fetch TOS data.");
          return;
        }

        if (!data || data.length === 0) {
          setError("No data found.");
          return;
        }

        // Aggregate TOS data
        const aggregatedTOS = data.reduce(
          (acc, curr) => {
            acc.Remembering += curr.remembering || 0;
            acc.Understanding += curr.understanding || 0;
            acc.Applying += curr.applying || 0;
            acc.Analyzing += curr.analyzing || 0;
            acc.Evaluating += curr.evaluating || 0;
            acc.Creating += curr.creating || 0;
            return acc;
          },
          {
            Remembering: 0,
            Understanding: 0,
            Applying: 0,
            Analyzing: 0,
            Evaluating: 0,
            Creating: 0,
          }
        );

        // Format the aggregated data for the chart
        const formatted = [
          { tos: "Remembering", percentage: aggregatedTOS.Remembering },
          { tos: "Understanding", percentage: aggregatedTOS.Understanding },
          { tos: "Applying", percentage: aggregatedTOS.Applying },
          { tos: "Analyzing", percentage: aggregatedTOS.Analyzing },
          { tos: "Evaluating", percentage: aggregatedTOS.Evaluating },
          { tos: "Creating", percentage: aggregatedTOS.Creating },
        ];

        setTosData(formatted);
        setError(null);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchTOSPerformance();
  }, []);

  return (
    <div className="p-4 w-1/2 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Total TOS Placements</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : tosData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart layout="vertical" data={tosData} margin={{ left: 0, right: 0 }} barCategoryGap={5}>
            <defs>
              <linearGradient id="fadeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#35408E" stopOpacity={1} />
                <stop offset="100%" stopColor="#35408E" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <XAxis type="number" domain={[0, 'dataMax']} tick={{ fill: "#35408E" }} />
            <YAxis type="category" dataKey="" tick={{ fill: "#35408E" }} width={100} />
            <Tooltip />
            <Bar dataKey="percentage" fill="url(#fadeGradient)" barSize={20} radius={[0, 10, 10, 0]}>
              <LabelList dataKey="tos" position="insideLeft" fill="white" fontSize={12} dy={-2} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </div>
  );
};

export default HorizontalLineChart;