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
    const [selectedSubject, setSelectedSubject] = useState(null); 
    const [selectedEducator, setSelectedEducator] = useState(''); 
    const [showModal, setShowModal] = useState(false); 

    const handleAssignFaculty = (program, yearLevel, subjectIndex) => {
        setSelectedSubject({ program, yearLevel, subjectIndex });
        setShowModal(true);
    };

    const handleSaveFaculty = () => {
        const updatedSubjects = { ...subjects };
        const { program, yearLevel, subjectIndex } = selectedSubject;
        updatedSubjects[program][yearLevel][subjectIndex].faculty = selectedEducator;
        setSubjects(updatedSubjects);
        setShowModal(false);
        setSelectedSubject(null);
        setSelectedEducator('');
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
                                    <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{subject.code}</td>
                                    <td className="border border-gray-300 px-4 py-2">{subject.faculty}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            className="text-blue-500 hover:underline mr-2"
                                            onClick={() =>
                                                handleAssignFaculty(selectedProgram, selectedYearLevel, index)
                                            }
                                        >
                                            Assign
                                        </button>
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() =>
                                                handleAssignFaculty(selectedProgram, selectedYearLevel, index)
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-5 w-1/3">
                            <h2 className="text-xl font-bold mb-4">Assign Faculty</h2>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Choose Educator:</label>
                                <select
                                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    value={selectedEducator}
                                    onChange={(e) => setSelectedEducator(e.target.value)}
                                >
                                    <option value="">Select Educator</option>
                                    {educators.map((educator, index) => (
                                        <option key={index} value={educator}>
                                            {educator}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-700 text-white px-4 py-2 rounded-md"
                                    onClick={handleSaveFaculty}
                                    disabled={!selectedEducator}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Program;