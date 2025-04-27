import React, { useState } from 'react';
import AdminNav from './AdminNav';

const Program = () => {
    const programs = ['BSIT', 'BSCS', 'BSECE'];
    const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    const initialSubjects = {
        BSIT: {
            '1st Year': [
                { name: 'Introduction to IT', code: 'IT101', faculty: 'No faculty assigned' },
                { name: 'Programming 1', code: 'IT102', faculty: 'No faculty assigned' },
            ],
            '2nd Year': [
                { name: 'Data Structures', code: 'IT201', faculty: 'No faculty assigned' },
                { name: 'Database Systems', code: 'IT202', faculty: 'No faculty assigned' },
            ],
        },
        BSCS: {
            '1st Year': [
                { name: 'Discrete Mathematics', code: 'CS101', faculty: 'No faculty assigned' },
                { name: 'Programming 1', code: 'CS102', faculty: 'No faculty assigned' },
            ],
        },
    };

    const educators = ['Educator 1', 'Educator 2', 'Educator 3', 'Educator 4'];

    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedYearLevel, setSelectedYearLevel] = useState('');
    const [subjects, setSubjects] = useState(initialSubjects);
    const [editingIndex, setEditingIndex] = useState(null); // Track the index of the subject being edited
    const [editedSubject, setEditedSubject] = useState({ name: '', code: '', faculty: '' }); // Track the edited subject

    const handleEditClick = (program, yearLevel, index) => {
        setEditingIndex(index);
        setEditedSubject({ ...subjects[program][yearLevel][index] });
    };

    const handleSaveEdit = (program, yearLevel) => {
        const updatedSubjects = { ...subjects };
        updatedSubjects[program][yearLevel][editingIndex] = editedSubject;
        setSubjects(updatedSubjects);
        setEditingIndex(null);
        setEditedSubject({ name: '', code: '', faculty: '' });
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditedSubject({ name: '', code: '', faculty: '' });
    };

    const handleAddRow = (program, yearLevel) => {
        const updatedSubjects = { ...subjects };
        const newSubject = { name: 'New Subject', code: 'New Code', faculty: 'No faculty assigned' };
        updatedSubjects[program][yearLevel].push(newSubject);
        setSubjects(updatedSubjects);
    };

    return (
        <div>
            <AdminNav />
            <div className="p-5">
                <h1 className="text-2xl font-bold mb-5">Program Management</h1>
                <div className="mb-5">
                    <label className="font-semibold mr-2">Choose Program:</label>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                    >
                        <option value="">Select Program</option>
                        {programs.map((program, index) => (
                            <option key={index} value={program}>
                                {program}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-5">
                    <label className="font-semibold mr-2">Choose Year Level:</label>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={selectedYearLevel}
                        onChange={(e) => setSelectedYearLevel(e.target.value)}
                        disabled={!selectedProgram}
                    >
                        <option value="">Select Year Level</option>
                        {yearLevels.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedProgram && selectedYearLevel && subjects[selectedProgram]?.[selectedYearLevel] && (
                    <>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600"
                            onClick={() => handleAddRow(selectedProgram, selectedYearLevel)}
                        >
                            Add Row
                        </button>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-blue-700 text-white">
                                    <th className="border border-gray-300 px-4 py-2">Subject Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Subject Code</th>
                                    <th className="border border-gray-300 px-4 py-2">Faculty Incharge</th>
                                    <th className="border border-gray-300 px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects[selectedProgram][selectedYearLevel].map((subject, index) => (
                                    <tr key={index} className="text-center">
                                        {editingIndex === index ? (
                                            <>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={editedSubject.name}
                                                        onChange={(e) =>
                                                            setEditedSubject({ ...editedSubject, name: e.target.value })
                                                        }
                                                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={editedSubject.code}
                                                        onChange={(e) =>
                                                            setEditedSubject({ ...editedSubject, code: e.target.value })
                                                        }
                                                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <select
                                                        value={editedSubject.faculty}
                                                        onChange={(e) =>
                                                            setEditedSubject({ ...editedSubject, faculty: e.target.value })
                                                        }
                                                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                                    >
                                                        <option value="">Select Faculty</option>
                                                        {educators.map((educator, index) => (
                                                            <option key={index} value={educator}>
                                                                {educator}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button
                                                        className="text-green-500 hover:underline mr-2"
                                                        onClick={() => handleSaveEdit(selectedProgram, selectedYearLevel)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:underline"
                                                        onClick={handleCancelEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
                                                <td className="border border-gray-300 px-4 py-2">{subject.code}</td>
                                                <td className="border border-gray-300 px-4 py-2">{subject.faculty}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button
                                                        className="text-blue-500 hover:underline mr-2"
                                                        onClick={() =>
                                                            handleEditClick(selectedProgram, selectedYearLevel, index)
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default Program;