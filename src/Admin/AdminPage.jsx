import React, { useState } from "react";
import AdminNav from "./AdminNav";
import { Box } from "@mui/material";
import Program from "./Program";
import SubjectTab from "./SubjectTab";

function AdminPage() {
  const [value, setValue] = useState(0);

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
      <TabPanel value={value} index={0}>
        <Program />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SubjectTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        3
      </TabPanel>
      <TabPanel value={value} index={3}>
        4
      </TabPanel>
    </>
  );
}

export default AdminPage;
