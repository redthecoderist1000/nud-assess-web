import React from "react";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const getInitials = (person) => {
  const name = `${person.f_name || ""} ${person.l_name || ""}`.trim();
  if (!name) return "";
  const parts = name.split(" ");
  return parts
    .map((p) => p[0])
    .join("")
    .toUpperCase();
};

const PeopleTab = ({ people = [], setAddMemDia, canAdd }) => {
  const instructors = people.filter((p) => p.role === "instructor");
  const students = people.filter((p) => p.role !== "instructor");

  const PersonRow = ({ person }) => (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-l-4 border-gray-200 border-l-blue-800 p-4">
      <div className="flex items-center gap-4 min-w-0 ">
        <div className="w-10 h-10 rounded-full bg-yellow-100  flex items-center justify-center text-md font-semibold text-[blue-600]">
          {getInitials(person)}
        </div>
        <div className="min-w-0 ">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-md truncate">
              {`${person.f_name || ""} ${person.l_name || ""}`.trim()}
            </span>
          </div>
          <div className="text-sm text-gray-500 truncate">{person.email}</div>
        </div>
      </div>
      {/* Right: Average score and Delete button */}
      <div className="flex items-center gap-6">
        {/* {canDelete && ( */}
        <IconButton
          size="small"
          aria-label="delete"
          color="error"
          onClick={() => onDeletePerson(person.member_id || person.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        {/* )} */}
      </div>
    </div>
  );

  return (
    <div>
      {/* Students */}
      <div className="flex justify-end items-center mb-6">
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
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
              boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.5)",
            },
            minWidth: "140px",
            padding: "6px 16px",
          }}
          disabled={!canAdd}
          onClick={() => setAddMemDia(true)}
        >
          Add Member
        </Button>
      </div>
      <Stack spacing={2}>
        {students.length === 0 ? (
          <div className="text-gray-500">No students yet.</div>
        ) : (
          students.map((person, idx) => <PersonRow key={idx} person={person} />)
        )}
      </Stack>
    </div>
  );
};

export default PeopleTab;
