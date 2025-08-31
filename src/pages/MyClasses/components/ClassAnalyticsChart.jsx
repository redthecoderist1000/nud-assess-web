import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BarChartIcon from "@mui/icons-material/BarChart";

const performanceData = [
  { week: "Week 1", value: 75 },
  { week: "Week 2", value: 78 },
  { week: "Week 3", value: 80 },
  { week: "Week 4", value: 82 },
  { week: "Week 5", value: 79 },
  { week: "Week 6", value: 88 },
];

const ClassAnalyticsChart = ({ classes, selectedClass }) => {
  const classInfo = selectedClass || classes[0] || {
    class_name: "INFO202_TEST",
    students: 28,
    avg_score: 87,
    progress: 75,
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-5" style={{ minWidth: 340 }}>
      <div className="flex items-center gap-2 mb-1">
        <BarChartIcon style={{ color: "#6366f1" }} />
        <h3 className="font-bold text-base text-gray-900">Class Analytics</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">See how your class does</p>

      <div className="mb-2">
        <span className="font-bold text-lg text-gray-800">{classInfo.class_name}</span>
      </div>
      <div className="flex gap-6 mb-2">
        <div>
          <p className="text-gray-500 text-sm">Students</p>
          <p className="text-xl font-bold text-gray-800">{classInfo.students}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Avg Score</p>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-base">
            {classInfo.avg_score}%
          </span>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Progress</p>
          <span className="font-bold text-base text-gray-800">{classInfo.progress}%</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-bold text-sm text-gray-800 mb-2">Performance Trend</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#4B5563", fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FDE047"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#FDE047", fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;