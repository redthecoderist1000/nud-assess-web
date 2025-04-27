import React from 'react';

const AssignModal = ({ course, program, section, educators, onClose, onAssign }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-5 w-1/3">
                <h2 className="text-xl font-bold mb-4">Assign Educator</h2>
                <div className="mb-4">
                    <p className="font-semibold">Program: {program}</p>
                    <p className="font-semibold">Section: {section}</p>
                </div>
                <hr className="my-4" />
                <h3 className="text-lg font-bold text-center mb-4">{course.subject}</h3>
                <p className="text-sm font-semibold mb-2">Choose educator</p>
                <ul className="mb-4">
                    {educators.map((educator, index) => (
                        <li
                            key={index}
                            className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                            onClick={() => onAssign(educator)}
                        >
                            {educator}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between">
                    <button
                        className="text-red-500 hover:underline"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignModal;