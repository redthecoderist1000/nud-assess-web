import React, { useState } from "react";
import AdminNav from "./components/AdminNav";
import { Box, Container } from "@mui/material";
import SubjectTab from "./tabs/SubjectTab";
import FacultyTab from "./tabs/FacultyTab";
import AnnouncementTab from "./tabs/AnnouncementTab";

function AdminPage() {
  const [value, setValue] = useState(0);

  return (
    <>
      <AdminNav setValue={setValue} value={value} />
      <Container maxWidth="xl" sx={{ my: 5 }}>
        <div role="tabpanel" hidden={value !== 0} className="p-5">
          <SubjectTab />
        </div>
        <div role="tabpanel" hidden={value !== 1} className="p-5">
          <FacultyTab />
        </div>
      </Container>
      {/* <TabPanel value={value} index={2}>
        <AnnouncementTab />
      </TabPanel> */}
    </>
  );
}

export default AdminPage;
