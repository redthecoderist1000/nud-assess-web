import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "INF221", value: 35, color: "#FDE047" },
  { name: "INF222", value: 28, color: "#A3A3A3" },
  { name: "INF223", value: 33, color: "#A78BFA" }
];

const ClassAnalyticsChart = () => {
  return (
    <div className=" bg-gray-100 border rounded-lg p-5">
      <h3 className="font-bold text-lg text-yellow-500">Class Analytics</h3>
      <p className="text-sm text-gray-500">See here your class data.</p>

      {/* Total Classes */}
      <div className="bg-white mt-3 py-2 px-4 rounded-md shadow">
        <p className="text-gray-500 text-sm">Total class:</p>
        <p className="text-xl font-bold text-gray-800">000</p>
      </div>

      {/* Chart */}
      <div className="mt-3">
        <ResponsiveContainer width="100%" height={150}>
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
