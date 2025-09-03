import React from "react";
import { Button, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const getInitials = (person) => {
  const name = person.name || `${person.f_name || ""} ${person.l_name || ""}`.trim();
  if (!name) return "";
  const parts = name.split(" ");
  return parts.map((p) => p[0]).join("").toUpperCase();
};

const PeopleTab = ({ people = [], setAddMemDia, onDeletePerson }) => {
  const instructors = people.filter((p) => p.role === "instructor");
  const students = people.filter((p) => p.role !== "instructor");

  const PersonRow = ({ person, canDelete }) => (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-l-4 border-gray-200 border-l-blue-800 px-6 py-6 mb-4">
      <div className="flex items-center gap-4 min-w-0 ">
        <div className="w-12 h-12 rounded-full bg-yellow-100  flex items-center justify-center text-xl font-bold text-[blue-600]">
          {getInitials(person)}
        </div>
        <div className="min-w-0 ">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg truncate">
              {person.name || `${person.f_name || ""} ${person.l_name || ""}`.trim()}
            </span>
          </div>
          <div className="text-sm text-gray-500 truncate">{person.email}</div>
        </div>
      </div>
      {/* Right: Average score and Delete button */}
      <div className="flex items-center gap-6">
        <div className="text-[#5b3fd6] text-base font-semibold text-right min-w-[60px]">
          {person.average_score !== null && person.average_score !== undefined
            ? `${person.average_score}%`
            : "--"}
          <div className="text-xs text-gray-400 font-normal">Average</div>
        </div>
        {canDelete && (
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => onDeletePerson(person.member_id || person.id)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-1">
      {/* Students */}
      <div className="flex justify-end items-center mb-6">
        <Button 
                    sx={{
              background: "#23286b",
              color: "#fff",
              textTransform: "none",
              fontWeight: 400,
              fontSize: "0.875rem",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                background: "#23286b",
                boxShadow: "none",
              },
              minWidth: "140px",
              padding: "6px 16px",
            }}
        variant="contained" 
        onClick={() => setAddMemDia(true)}>
          + Add Student
        </Button>
      </div>
      {students.length === 0 ? (
        <div className="text-gray-500">No students yet.</div>
      ) : (
        students.map((person, idx) => (
          <PersonRow key={person.id + "_" + idx} person={person} canDelete={true} />
        ))
      )}
    </div>
  );
};

export default PeopleTab;