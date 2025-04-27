import React, { useState } from 'react';
import AdminNav from './AdminNav';

const Educator = () => {
    const programs = ['BSIT', 'BSCS', 'BSECE']; 
    const [selectedProgram, setSelectedProgram] = useState('BSIT');

    const initialEducators = [
        {
            name: 'Educator 1',
            subjects: [
                { subject: 'Capstone I', section: 'INF221' },
                { subject: 'HCI', section: 'INF222' },
            ],
        },
        {
            name: 'Educator 2',
            subjects: [
                { subject: 'Security', section: 'INF223' },
                { subject: 'Website', section: 'INF224' },
            ],
        },
        {
            name: 'Educator 3',
            subjects: [],
        },
    ];

    const [educators, setEducators] = useState(initialEducators);
    const [selectedEducator, setSelectedEducator] = useState(null);
    const [newSubject, setNewSubject] = useState('');
    const [newSection, setNewSection] = useState('');
    const [showAddEducatorModal, setShowAddEducatorModal] = useState(false); 
    const [newEducatorName, setNewEducatorName] = useState(''); 

    const handleProgramChange = (event) => {
        setSelectedProgram(event.target.value);
    };

    const handleAssignSubject = () => {
        if (selectedEducator && newSubject && newSection) {
            const updatedEducators = educators.map((educator) =>
                educator.name === selectedEducator.name
                    ? {
                          ...educator,
                          subjects: [
                              ...educator.subjects,
                              { subject: newSubject, section: newSection },
                          ],
                      }
                    : educator
            );
            setEducators(updatedEducators);
            setNewSubject('');
            setNewSection('');
            setSelectedEducator(null);
        }
    };

    const handleAddEducator = () => {
        if (newEducatorName.trim() !== '') {
            const newEducator = {
                name: newEducatorName,
                subjects: [],
            };
            setEducators([...educators, newEducator]);
            setNewEducatorName('');
            setShowAddEducatorModal(false);
        }
    };

    return (
        <div>
            <AdminNav />
            <div className="p-5">
                <h1 className="text-2xl font-bold mb-5">Educator Management</h1>
                <div className="mb-5">
                    <label className="font-semibold mr-2">Choose Program:</label>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={selectedProgram}
                        onChange={handleProgramChange}
                    >
                        {programs.map((program, index) => (
                            <option key={index} value={program}>
                                {program}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end mb-5">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={() => setShowAddEducatorModal(true)}
                    >
                        Add Educator
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    {educators.map((educator, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-md p-4 shadow-md"
                        >
                            <h2 className="text-lg font-bold mb-2">{educator.name}</h2>
                            <h3 className="font-semibold mb-2">Subjects:</h3>
                            {educator.subjects.length > 0 ? (
                                <ul className="list-disc ml-5 mb-2">
                                    {educator.subjects.map((subject, subIndex) => (
                                        <li key={subIndex}>
                                            {subject.subject} - {subject.section}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 mb-2">No subjects assigned</p>
                            )}
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={() => setSelectedEducator(educator)}
                            >
                                Assign Subject
                            </button>
                        </div>
                    ))}
                </div>
                {selectedEducator && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-5 w-1/3">
                            <h2 className="text-xl font-bold mb-4">
                                Assign Subject to {selectedEducator.name}
                            </h2>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Subject:</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Section:</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    value={newSection}
                                    onChange={(e) => setNewSection(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => setSelectedEducator(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-700 text-white px-4 py-2 rounded-md"
                                    onClick={handleAssignSubject}
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showAddEducatorModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-5 w-1/3">
                            <h2 className="text-xl font-bold mb-4">Add New Educator</h2>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Educator Name:</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    value={newEducatorName}
                                    onChange={(e) => setNewEducatorName(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => setShowAddEducatorModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                    onClick={handleAddEducator}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Educator;