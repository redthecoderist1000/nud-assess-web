import React from "react";

const FlaggedQuestion = () => {
    return (
      <main className="flex-1 p-6 mt-12 md:mt-0">
        <div className="w-full p-6 bg-white shadow-lg rounded-lg mt-6">
          <h2 className="text-2xl font-semibold mb-4">Flagged Questions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="p-4 border border-gray-300 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Course: Introduction to Computing</h3>
                <p className="text-gray-700 mb-2">What is Data Flow Diagram?</p>
                <span className="text-red-600 font-semibold">90 incorrect responses</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
};

export default FlaggedQuestion;


