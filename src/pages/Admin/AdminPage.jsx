import React, { useState } from "react";
import AdminNav from "./components/AdminNav";
import { Box } from "@mui/material";
import SubjectTab from "./tabs/SubjectTab";
import FacultyTab from "./tabs/FacultyTab";
import AnnouncementTab from "./tabs/AnnouncementTab";

function AdminPage() {
  const [value, setValue] = useState(1);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  return (
    <>
      <AdminNav setValue={setValue} value={value} />
      <TabPanel value={value} index={1}>
        <SubjectTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FacultyTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AnnouncementTab />
      </TabPanel>
    </>
  );
}

export default AdminPage;
