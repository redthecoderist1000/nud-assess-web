import React from "react";
import {
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

const SidebarSection = ({
  classData,
  people,
  copyToolTip,
  copy,
  setAddMemDia,
  dropdownVisible,
  setDropdownVisible,
  handleRemove,
}) => (
  <div className="w-1/4 bg-indigo-900 text-white p-6 rounded-md shadow-lg h-235 m-5 overflow-hidden">
    {/* Fixed Section */}
    <div className="sticky top-0 bg-indigo-900 z-10">
      <h2 className="text-lg font-bold mb-4">In this class</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-300">Description</p>
        <p className="text-base font-semibold">{classData.desc}</p>
      </div>
      {/* Join Code Section */}
      {classData.is_active ? (
        <div className="mb-4">
          <p className="text-sm text-gray-300">Class join code</p>
          <Stack direction="row" alignItems="center" spacing={2}>
            <p className="text-base font-semibold">
              {classData.join_code}
            </p>
            <Tooltip
              open={copyToolTip}
              arrow
              placement="top-start"
              disableFocusListener
              title="Copied to clipboard"
            >
              <IconButton
                size="small"
                onClick={() => copy(classData.join_code)}
              >
                <ContentCopyRoundedIcon
                  sx={{ color: "whitesmoke" }}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      ) : null}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <p className="text-sm text-gray-300 m-0">
          People ({people.length})
        </p>
        <IconButton
          size="small"
          sx={{ color: "white" }}
          disabled={classData.is_active === false}
          onClick={() => {
            setAddMemDia(true);
          }}
        >
          <PersonAddAltRoundedIcon />
        </IconButton>
      </Stack>
    </div>

    {/* Scrollable People List */}
    <ul className="mt-2 space-y-2 overflow-y-auto h-[calc(100%-10rem)]">
      {people.map((person, index) => (
        <li
          key={index}
          className="flex items-center justify-between bg-indigo-800 p-2 rounded-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Stack>
            <span>{person.f_name + " " + person.l_name}</span>
            <span>{person.email}</span>
          </Stack>
          {dropdownVisible === person.id && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg z-10">
              <button
                className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                onClick={() => alert(`Assigning quiz to ${person.name}`)}
              >
                Assign Quiz
              </button>
              <button
                className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                onClick={() => handleRemove(person)}
              >
                Remove
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default SidebarSection;