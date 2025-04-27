import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; 

const ProgramPopup = ({ program, onClose }) => {
    const [sections, setSections] = useState({
        '1st Year': [],
        '2nd Year': [],
        '3rd Year': [],
        '4th Year': [],
    });

    const [newSections, setNewSections] = useState({
        '1st Year': '',
        '2nd Year': '',
        '3rd Year': '',
        '4th Year': '',
    });

    const [isAddingSection, setIsAddingSection] = useState(false);
    const [isEditingSection, setIsEditingSection] = useState(false);

    const handleAddSection = () => {
        setIsAddingSection(true); 
        setIsEditingSection(false); 
    };

    const handleEditSection = () => {
        setIsEditingSection(true); 
        setIsAddingSection(false); 
    };

    const handleInputChange = (year, value) => {
        setNewSections({ ...newSections, [year]: value });
    };

    const handleSaveNewSection = (year) => {
        if (newSections[year].trim() !== '') {
            setSections({
                ...sections,
                [year]: [...sections[year], newSections[year].trim()],
            });
            setNewSections({ ...newSections, [year]: '' }); 
        }
    };

    const handleDeleteSection = (year, sectionIndex) => {
        const updatedSections = sections[year].filter((_, index) => index !== sectionIndex);
        setSections({ ...sections, [year]: updatedSections });
    };

    const handleUpdateSection = (year, sectionIndex, newValue) => {
        const updatedSections = [...sections[year]];
        updatedSections[sectionIndex] = newValue;
        setSections({ ...sections, [year]: updatedSections });
    };

    const handleSaveChanges = () => {
        setIsAddingSection(false);
        setIsEditingSection(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-5 w-3/4 max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-[#35408E]">Section List</h1>
                    <div className="flex gap-2">
                        <button
                            className="bg-[#35408E] text-yellow-400 px-4 py-2 rounded-md hover:bg-[#2c367c]"
                            onClick={handleAddSection}
                        >
                            Add Section
                        </button>
                        <button
                            className="bg-[#35408E] text-yellow-400 px-4 py-2 rounded-md hover:bg-[#2c367c]"
                            onClick={handleEditSection}
                        >
                            Edit Sections
                        </button>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-[#35408E] mb-4">{program.school}</h2>
                <div className="grid grid-cols-4 gap-5">
                    {Object.keys(sections).map((year, index) => (
                        <div key={index}>
                            <h3 className="text-lg font-bold text-[#35408E] mb-2">{year}</h3>
                            <h4 className="text-md font-semibold text-gray-800 mt-3">Sections:</h4>
                            <ul className="list-disc ml-5">
                                {sections[year].map((section, sectionIndex) => (
                                    <li key={sectionIndex} className="text-gray-600 flex items-center gap-2">
                                        {isEditingSection ? (
                                            <input
                                                type="text"
                                                className="border border-gray-300 rounded-md px-2 py-1 w-32"
                                                defaultValue={section}
                                                onBlur={(e) =>
                                                    handleUpdateSection(year, sectionIndex, e.target.value)
                                                }
                                            />
                                        ) : (
                                            section
                                        )}
                                        {isEditingSection && (
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteSection(year, sectionIndex)}
                                            >
                                                <FaTrash /> 
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {isAddingSection && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-md px-2 py-1 w-32 mb-2"
                                        placeholder={`Add a section for ${year}`}
                                        value={newSections[year]}
                                        onChange={(e) => handleInputChange(year, e.target.value)}
                                    />
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                                        onClick={() => handleSaveNewSection(year)}
                                    >
                                        Save Section
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-5">
                    {(isAddingSection || isEditingSection) && (
                        <button
                            className="bg-[#35408E] text-white px-4 py-2 rounded-md"
                            onClick={handleSaveChanges}
                        >
                            Save
                        </button>
                    )}
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramPopup;