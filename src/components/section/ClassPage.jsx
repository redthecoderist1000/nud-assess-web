import React from "react";
import { useLocation } from "react-router-dom";

const ClassPage = () => {
  const location = useLocation();
  const classData = location.state;

  const people = [
    { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/150" },
    { id: 2, name: "Maria Maria", avatar: "https://via.placeholder.com/150" },
    { id: 3, name: "Juan De la Cris", avatar: "https://via.placeholder.com/150" },
    { id: 4, name: "John Doe", avatar: "https://via.placeholder.com/150" },
    { id: 5, name: "Maria Maria", avatar: "https://via.placeholder.com/150" },
  ];

  const quizzes = [
    { id: 1, title: "Self-paced Activity 4", due: "11:59 am", turnedIn: 2, total: 40, items: 100 },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Header Section */}
      <div className="w-full lg:w-3/4 bg-indigo-700 text-white p-6 relative">
        <div className="absolute top-4 left-4 text-sm text-yellow-400 cursor-pointer hover:underline">
          ✏️ Edit display picture
        </div>
        <h1 className="text-4xl font-bold">{classData.title}</h1>
      </div>

      {/* Sidebar Section */}
      <div className="w-full lg:w-1/4 bg-indigo-900 text-white p-6">
        <h2 className="text-lg font-bold mb-4">In this class</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-300">Description</p>
          <p className="text-base font-semibold">{classData.desc}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-300">Class created by</p>
          <p className="text-base font-semibold">Learning Management</p>
        </div>
        <div>
          <p className="text-sm text-gray-300">People ({people.length})</p>
          <ul className="mt-2 space-y-2">
            {people.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between bg-indigo-800 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{person.name}</span>
                </div>
                <button className="text-gray-300 hover:text-white">⋮</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full lg:w-3/4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Quizzes</h2>
          <button className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800">
            Assign Quiz
          </button>
        </div>
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{quiz.title}</h3>
                <p className="text-sm text-gray-500">
                  Due at {quiz.due} | {quiz.items} Items
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {quiz.turnedIn}/{quiz.total} turned in
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;