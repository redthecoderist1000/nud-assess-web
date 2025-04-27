import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AdminPic from '../assets/images/nu-pic-admin.png'; 

const AdminNav = () => {
    const [selected, setSelected] = useState('Program'); 
    const navigate = useNavigate(); 

    return (
        <div className="relative w-full m-0 p-0">
            <img
                src={AdminPic}
                alt="Admin"
                className="w-full h-70 object-cover m-0 p-0" 
            />

            <div className="bg-[#35408E] text-white flex  py-3 m-0">
                <span
                    onClick={() => {
                        setSelected('Program');
                        navigate('/dashboard/Administration'); 
                    }}
                    className={`cursor-pointer ml-15 hover:underline ${
                        selected === 'Program' ? 'text-amber-400 font-bold' : ''
                    }`}
                >
                    Program
                </span>
                <span
                    onClick={() => {
                        setSelected('Courses');
                        navigate('/dashboard/Administration/Courses'); 
                    }}
                    className={`cursor-pointer ml-15 hover:underline ${
                        selected === 'Courses' ? 'text-amber-400 font-bold' : ''
                    }`}
                >
                    Faculty Incharge
                </span>
                <span
                    onClick={() => {
                        setSelected('Educator');
                        navigate('/dashboard/Administration/Educator'); 
                    }}
                    className={`cursor-pointer ml-15 hover:underline ${
                        selected === 'Educator' ? 'text-amber-400 font-bold' : ''
                    }`}
                >
                    Educator
                </span>
            </div>
        </div>
    );
};

export default AdminNav;