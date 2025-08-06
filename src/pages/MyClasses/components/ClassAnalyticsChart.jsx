import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ClassAnalyticsChart = ({ classes }) => {
  // Prepare data for the chart
  const data = classes.map((cls) => ({
    name: cls.class_name, // Extract the class code (e.g., INF221)
    value: classes.length, // Generate random performance data
    color: "#FDE047",
  }));

  return (
    <div className="border border-gray-200 rounded-lg bg-indigo-100">
      <div className="items-center justify-between rounded-t-lg mb-4 bg-blue-900 p-5">
        <h3 className="font-bold text-lg text-yellow-500">Class Analytics</h3>
        <p className="text-sm text-white">See here your class data.</p>
      </div>

      {/* Total Classes */}
      <div className="bg-white m-5 py-2 px-4 rounded-md shadow">
        <p className="text-gray-500 text-sm">Total class:</p>
        <p className="text-xl font-bold text-gray-800">{classes.length}</p>
      </div>

      {/* Chart */}
      <div className="m-5">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#4B5563", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#FDE047" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;
