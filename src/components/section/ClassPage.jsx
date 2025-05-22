import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../assets/images/header.png";

const ClassPage = () => {
  const location = useLocation();
  const classData = location.state || {
    class_name: "Default Class Title",
    desc: "Default class description.",
  };

  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [people, setPeople] = useState([
    { id: 1, name: "Alice Johnson", avatar: "https://via.placeholder.com/150" },
    { id: 2, name: "Bob Smith", avatar: "https://via.placeholder.com/150" },
    { id: 3, name: "Charlie Brown", avatar: "https://via.placeholder.com/150" },
    { id: 4, name: "Diana Prince", avatar: "https://via.placeholder.com/150" },
    { id: 5, name: "Ethan Hunt", avatar: "https://via.placeholder.com/150" },
    {
      id: 6,
      name: "Fiona Gallagher",
      avatar: "https://via.placeholder.com/150",
    },
    { id: 7, name: "George Miller", avatar: "https://via.placeholder.com/150" },
    { id: 8, name: "Hannah Baker", avatar: "https://via.placeholder.com/150" },
    { id: 9, name: "Ian Wright", avatar: "https://via.placeholder.com/150" },
    {
      id: 10,
      name: "Jessica Davis",
      avatar: "https://via.placeholder.com/150",
    },
    { id: 11, name: "Kevin Hart", avatar: "https://via.placeholder.com/150" },
    { id: 12, name: "Laura Palmer", avatar: "https://via.placeholder.com/150" },
    {
      id: 13,
      name: "Michael Scott",
      avatar: "https://via.placeholder.com/150",
    },
    { id: 14, name: "Nancy Drew", avatar: "https://via.placeholder.com/150" },
    { id: 15, name: "Oscar Wilde", avatar: "https://via.placeholder.com/150" },
    { id: 16, name: "Pam Beesly", avatar: "https://via.placeholder.com/150" },
    { id: 17, name: "Quincy Adams", avatar: "https://via.placeholder.com/150" },
    { id: 18, name: "Rachel Green", avatar: "https://via.placeholder.com/150" },
  ]);

  const quizzes = [
    {
      id: 1,
      title: "Math Quiz 1",
      due: "10:00 am",
      turnedIn: 10,
      total: 30,
      items: 20,
    },
    {
      id: 2,
      title: "Science Quiz 1",
      due: "12:00 pm",
      turnedIn: 15,
      total: 40,
      items: 25,
    },
    {
      id: 3,
      title: "History Quiz 1",
      due: "2:00 pm",
      turnedIn: 20,
      total: 50,
      items: 30,
    },
    {
      id: 4,
      title: "English Quiz 1",
      due: "3:30 pm",
      turnedIn: 25,
      total: 60,
      items: 35,
    },
    {
      id: 5,
      title: "Geography Quiz 1",
      due: "4:00 pm",
      turnedIn: 18,
      total: 45,
      items: 40,
    },
    {
      id: 6,
      title: "Math Quiz 2",
      due: "9:00 am",
      turnedIn: 12,
      total: 35,
      items: 15,
    },
    {
      id: 7,
      title: "Science Quiz 2",
      due: "11:00 am",
      turnedIn: 22,
      total: 50,
      items: 20,
    },
    {
      id: 8,
      title: "History Quiz 2",
      due: "1:00 pm",
      turnedIn: 30,
      total: 60,
      items: 25,
    },
    {
      id: 9,
      title: "English Quiz 2",
      due: "3:00 pm",
      turnedIn: 28,
      total: 55,
      items: 30,
    },
    {
      id: 10,
      title: "Geography Quiz 2",
      due: "5:00 pm",
      turnedIn: 35,
      total: 70,
      items: 40,
    },
    {
      id: 11,
      title: "Math Quiz 3",
      due: "8:30 am",
      turnedIn: 8,
      total: 25,
      items: 10,
    },
    {
      id: 12,
      title: "Science Quiz 3",
      due: "10:30 am",
      turnedIn: 16,
      total: 40,
      items: 15,
    },
    {
      id: 13,
      title: "History Quiz 3",
      due: "12:30 pm",
      turnedIn: 24,
      total: 50,
      items: 20,
    },
    {
      id: 14,
      title: "English Quiz 3",
      due: "2:30 pm",
      turnedIn: 32,
      total: 60,
      items: 25,
    },
  ];

  const handleRemove = (person) => {
    if (window.confirm(`Are you sure you want to remove ${person.name}?`)) {
      setPeople((prevPeople) => prevPeople.filter((p) => p.id !== person.id));
      alert(`${person.name} has been removed.`);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownVisible(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header Section */}
      <div
        className="w-full h-20 p-6 relative h-60 flex justify-between items-center"
        style={{
          background: "linear-gradient(to right, #1E3A8A, #000000)",
        }}
      >
        <h1 className="text-7xl font-bold mt-30 text-white">
          {classData.class_name}
        </h1>
        <img
          src={Header}
          alt="Header"
          className="h-60 object-contain ml-4 mt-5"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Section */}
        <div className="w-3/4 p-6 overflow-hidden">
          {/* Fixed Quizzes Header */}
          <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Quizzes</h2>
              <button className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800">
                Assign Quiz
              </button>
            </div>
          </div>

          {/* Scrollable Quizzes List */}
          <div className="mt-4 overflow-y-auto h-[calc(100%-4rem)]">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center mb-4"
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

        {/* Sidebar Section */}
        <div className="w-1/4 bg-indigo-900 text-white p-6 rounded-md shadow-lg h-235 m-5 overflow-hidden">
          {/* Fixed Section */}
          <div className="sticky top-0 bg-indigo-900 z-10">
            <h2 className="text-lg font-bold mb-4">In this class</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-300">Description</p>
              <p className="text-base font-semibold">{classData.desc}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-300">Class created by</p>
              <p className="text-base font-semibold">Learning Management</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-300">People ({people.length})</p>
            </div>
          </div>

          {/* Scrollable People List */}
          <ul className="mt-2 space-y-2 overflow-y-auto h-[calc(100%-10rem)]">
            {people.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between bg-indigo-800 p-2 rounded-md relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{person.name}</span>
                </div>
                <button
                  className="text-gray-300 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownVisible(
                      dropdownVisible === person.id ? null : person.id
                    );
                  }}
                >
                  ⋮
                </button>
                {dropdownVisible === person.id && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg z-10">
                    <button
                      className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                      onClick={() => alert(`Assigning quiz to ${person.name}`)}
                    >
                      Assign Quiz
                    </button>
                    <button
                      className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                      onClick={() => handleRemove(person)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
