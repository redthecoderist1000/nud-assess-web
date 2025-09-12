import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";

const Header = ({ avatarUrl }) => {
  const { user } = useContext(userContext);

  const full_name = [user?.suffix, user?.f_name, user?.m_name, user?.l_name]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className="flex items-center px-6 py-4 rounded-lg"
        style={{
          background: "linear-gradient(90deg, #434e9e 0%, #fdf6e3 100%)",
        }}
      >
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
          />
          <span className="absolute bottom-0 right-0 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white text-xs font-bold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" fill="#facc15" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fill="#fff"
                fontFamily="Arial"
                fontWeight="bold"
              >
                on
              </text>
            </svg>
          </span>
        </div>
        <div className="ml-4">
          <div className="text-white font-bold text-lg">{full_name}</div>
          <div className="text-white text-sm opacity-80">{user?.email}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
