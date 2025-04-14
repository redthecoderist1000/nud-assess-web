import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'INF221', value: 2 },
  { name: 'INF221', value: 20 },
  { name: 'INF221', value: 10 },
  { name: 'INF221', value: 3 },
  { name: 'INF221', value: 4 },
  { name: 'INF221', value: 20 },
  { name: 'INF221', value: 7 },
];

const PerformanceChart = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#1f3c88" strokeWidth={2} dot={{ r: 6, fill: '#1f3c88' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
