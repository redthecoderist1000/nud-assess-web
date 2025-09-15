import { useState } from "react";
import { Button, List } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddMemberDialog from "../../components/AddMemberDialog";
import PersonListItem from "../../components/PersonListItem";
import RemMemberDialog from "../../components/RemMemberDialog";

const PeopleTab = ({ people = [], classData }) => {
  const [addMembDia, setAddMemDia] = useState(false);
  const [remMembDia, setRemMemDia] = useState(null);

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
          disabled={!classData.is_active}
          onClick={() => setAddMemDia(true)}
        >
          Add Member
        </Button>
      </div>
      {/* <Stack spacing={2}> */}
      {people.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No students yet.</div>
      ) : (
        <List
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {people.map((person, idx) => (
            <PersonListItem
              key={idx}
              person={person}
              setRemDialog={setRemMemDia}
            />
          ))}
        </List>
      )}
      {/* </Stack> */}

      <RemMemberDialog
        open={remMembDia !== null}
        setId={setRemMemDia}
        memberId={remMembDia}
      />

      <AddMemberDialog
        open={addMembDia}
        setOpen={setAddMemDia}
        classId={classData.id}
      />
    </div>
  );
};

export default PeopleTab;
