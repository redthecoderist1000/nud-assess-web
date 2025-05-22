import React from "react";
import { motion } from "framer-motion";

const QuizModal = ({ isOpen, onClose, onSelectOption }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <motion.div
        className="rounded-lg shadow-2xl p-5 w-100 bg-blue-900 text-white flex flex-col items-center bg-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold  text-center text-stone-900">
          Create Quiz
        </h2>
        <p className="mb-4 text-gray-600">
          Choose how your quiz will be created.
        </p>
        <ul className="space-y-4 w-full">
          {/* <li>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => onSelectOption("Random Bank")}
            >
              Random Bank
              <p className="text-sm text-gray-200">
                Use random questions from the bank
              </p>
            </button>
          </li> */}
          <li>
            <button
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800"
              onClick={() => onSelectOption("AI-Generated")}
            >
              <b>AI-Generated</b>
              <p className="text-sm text-gray-200">
                Use AI to create a set of questions
              </p>
            </button>
          </li>
          {/* <li>
            <button
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
              onClick={() => onSelectOption("Premade Exam")}
            >
              Premade Exam
              <p className="text-sm text-gray-200">Use a premade exam</p>
            </button>
          </li> */}
        </ul>
        <button
          className="mt-6 w-full bg-red-500 text-white-800 py-2 px-4 rounded-lg hover:bg-red-400"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default QuizModal;
