import React from "react";
import { motion } from "framer-motion";

const QuestionRepoModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        className="rounded-lg shadow-2xl p-5 w-100 bg-blue-900 text-white flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz/Question Repositories</h2>
        <ul className="space-y-4 w-full">
          <li>
            <button
              className="w-full bg-white text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-200"
              onClick={() => onSelect("Final Exam")}
            >
              Final Exam
            </button>
          </li>
          <li>
            <button
              className="w-full bg-white text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-200"
              onClick={() => onSelect("Quiz")}
            >
              Quiz
            </button>
          </li>
          <li>
            <button
              className="w-full bg-white text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-200"
              onClick={() => onSelect("Personal")}
            >
              Personal
            </button>
          </li>
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

export default QuestionRepoModal;