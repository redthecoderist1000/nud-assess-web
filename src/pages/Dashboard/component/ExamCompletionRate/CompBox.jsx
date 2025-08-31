import React from "react";

const CompBox = ({ data }) => {
  const items =
    data ||
    [
      {
        month: "Apr 2024",
        completed: 612,
        total: 651,
        students: 195,
        rate: 94,
      },
      {
        month: "May 2024",
        completed: 578,
        total: 602,
        students: 186,
        rate: 96,
      },
      {
        month: "Jun 2024",
        completed: 697,
        total: 723,
        students: 203,
        rate: 96.4,
      },
    ];

  return (
    <div className="space-y-3 w-full">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-base">{item.month}</div>
            <div className="text-xs text-gray-500 mt-1 truncate">
              {item.completed}/{item.total} completed &bull; {item.students} students
            </div>
          </div>
          <div className="flex flex-col sm:items-end sm:w-1/3 mt-2 sm:mt-0">
            <div className="font-bold text-indigo-900 text-lg text-right">{item.rate}%</div>
            <div className="w-full h-2 bg-gray-200 rounded mt-1">
              <div
                className="h-2 rounded bg-indigo-900"
                style={{ width: `${item.rate}%`, transition: "width 0.3s" }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompBox;