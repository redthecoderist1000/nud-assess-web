import React, { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; 
import AdminNav from './AdminNav';
import ProgramPopup from './ProgramPopup';

const Program = () => {
    const [programs, setPrograms] = useState([
        {
            school: 'School of Engineering, Computing and Architecture',
            courses: [
                'Bachelor of Science in Civil Engineering',
                'Bachelor of Science in Computer Science',
                'Bachelor of Science in Information Technology (Major in Mobile and Web Application)',
            ],
        },
        {
            school: 'School of Arts, Science and Something',
            courses: [
                'Bachelor of Science in Civil Engineering',
                'Bachelor of Science in Computer Science',
                'Bachelor of Science in Information Technology (Major in Mobile and Web Application)',
            ],
        },
    ]);

    const [isDeleting, setIsDeleting] = useState(false); 
    const [selectedProgram, setSelectedProgram] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const [editedProgram, setEditedProgram] = useState(null);

    const handleDeleteSchool = (schoolName) => {
        const updatedPrograms = programs.filter((program) => program.school !== schoolName);
        setPrograms(updatedPrograms);
    };

    const handleEditSchool = (program) => {
        setIsEditing(true);
        setEditedProgram({ ...program });
    };

    const handleSaveEdit = () => {
        setPrograms(
            programs.map((program) =>
                program.school === editedProgram.school ? editedProgram : program
            )
        );
        setIsEditing(false);
        setEditedProgram(null);
    };

    const handleAddCourse = () => {
        setEditedProgram({
            ...editedProgram,
            courses: [...editedProgram.courses, 'New Bachelor Program'],
        });
    };

    const handleCourseChange = (index, value) => {
        const updatedCourses = [...editedProgram.courses];
        updatedCourses[index] = value;
        setEditedProgram({ ...editedProgram, courses: updatedCourses });
    };

    return (
        <div>
            <AdminNav />
            <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold">Program Management</h1>
                    <div>
                        <button
                            className="bg-[#35408E] text-white px-4 py-2 rounded-md mr-2"
                            onClick={() => setIsDeleting(!isDeleting)} 
                        >
                            Edit
                        </button>
                        <button
                            className="bg-[#35408E] text-white px-4 py-2 rounded-md"
                            onClick={() => {
                                const newProgram = {
                                    school: 'New School of Example',
                                    courses: ['New Course 1', 'New Course 2'],
                                };
                                setPrograms([...programs, newProgram]);
                            }}
                        >
                            Add School
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                    {programs.map((program, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-[#35408E]">
                                        {program.school} 
                                    </h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => handleEditSchool(program)}
                                    >
                                        <FaEdit />
                                    </button>
                                    {isDeleting && (
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteSchool(program.school)}
                                        >
                                            <FaTrash /> 
                                        </button>
                                    )}
                                </div>
                            </div>
                            <ul className="list-disc ml-5 mt-2">
                                {program.courses.map((course, courseIndex) => (
                                    <li
                                        key={courseIndex}
                                        className="text-gray-700 cursor-pointer hover:underline"
                                        onClick={() => setSelectedProgram(program)} 
                                    >
                                        {course}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            {isEditing && editedProgram && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-5 w-3/4 max-w-4xl">
                        <h2 className="text-2xl font-bold mb-4">Edit School</h2>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md px-2 py-1 w-full mb-4"
                            value={editedProgram.school}
                            onChange={(e) =>
                                setEditedProgram({ ...editedProgram, school: e.target.value })
                            }
                        />
                        <h3 className="text-lg font-bold mb-2">Bachelor Programs</h3>
                        <ul className="list-disc ml-5">
                            {editedProgram.courses.map((course, index) => (
                                <li key={index} className="mb-2 flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                        value={course}
                                        onChange={(e) => handleCourseChange(index, e.target.value)}
                                    />
                                </li>
                            ))}
                        </ul>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 flex items-center gap-2"
                            onClick={handleAddCourse}
                        >
                            <FaPlus /> Add Course
                        </button>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                className="bg-[#35408E] text-white px-4 py-2 rounded-md"
                                onClick={handleSaveEdit}
                            >
                                Save
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedProgram(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedProgram && (
                <ProgramPopup
                    program={selectedProgram}
                    onClose={() => setSelectedProgram(null)} 
                />
            )}
        </div>
    );
};

export default Program;