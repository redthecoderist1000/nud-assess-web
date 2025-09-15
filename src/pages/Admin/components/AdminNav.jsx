import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPic from "../../../assets/images/nu-pic-admin.png";
import { Container } from "@mui/material";

const AdminNav = (props) => {
  return (
    <div className="relative w-full m-0 p-0">
      {/* <img
        src={AdminPic}
        alt="Admin"
        className="w-full h-70 object-cover m-0 p-0"
        /> */}

      <div className="bg-[#35408E] text-white flex  py-3 m-0">
        <Container maxWidth="xl">
          <span
            onClick={() => {
              props.setValue(0);
            }}
            className={`cursor-pointer ml-15 hover:underline ${
              props.value === 0 ? "text-amber-400 font-bold" : ""
            }`}
          >
            Subjects
          </span>
          <span
            onClick={() => {
              props.setValue(1);
            }}
            className={`cursor-pointer ml-15 hover:underline ${
              props.value === 1 ? "text-amber-400 font-bold" : ""
            }`}
          >
            Faculty
          </span>
          {/* <span
          onClick={() => {
            props.setValue(2);
          }}
          className={`cursor-pointer ml-15 hover:underline ${
            props.value === 2 ? "text-amber-400 font-bold" : ""
          }`}
        >
          Announcements
        </span> */}
        </Container>
      </div>
    </div>
  );
};

export default AdminNav;
