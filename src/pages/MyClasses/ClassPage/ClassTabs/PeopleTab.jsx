import { useEffect, useState } from "react";
import { Button, List } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddMemberDialog from "../../components/AddMemberDialog";
import PersonListItem from "../../components/PersonListItem";
import RemMemberDialog from "../../components/RemMemberDialog";
import { supabase } from "../../../../helper/Supabase";

const PeopleTab = ({ people = [], class_id }) => {
  const [addMembDia, setAddMemDia] = useState(false);
  const [remMembDia, setRemMemDia] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchData();
  }, [class_id]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_class")
      .select("is_active")
      .eq("id", class_id)
      .single();
    if (error) {
      console.log("fail to fetch members:", error);
      return;
    }
    setIsActive(data.is_active);
  };

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
          disabled={!isActive}
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
        classId={class_id}
      />
    </div>
  );
};

export default PeopleTab;
