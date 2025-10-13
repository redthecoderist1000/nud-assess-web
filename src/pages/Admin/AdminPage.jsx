import React, { useState } from "react";
import AdminNav from "./components/AdminNav";
import { Box, Container } from "@mui/material";
import SubjectTab from "./tabs/SubjectTab";
import FacultyTab from "./tabs/FacultyTab";
import AnnouncementTab from "./tabs/AnnouncementTab";
import { useSearchParams } from "react-router-dom";
import QuestionTab from "./tabs/QuestionTab";
import ExamTab from "./tabs/ExamTab";

function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") ?? 0;
  const [value, setValue] = useState(parseInt(tabParam, 10));

  const changeTab = (tabKey) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabKey);
    setValue(tabKey);
    setSearchParams(params, { replace: true });
  };

  return (
    <>
      <AdminNav value={value} setTab={changeTab} />
      <Container maxWidth="xl" sx={{ my: 5 }}>
        <div role="tabpanel" hidden={value !== 0} className="p-5">
          <SubjectTab />
        </div>
        <div role="tabpanel" hidden={value !== 1} className="p-5">
          <FacultyTab />
        </div>
        <div role="tabpanel" hidden={value !== 2} className="p-5">
          <QuestionTab />
        </div>
        <div role="tabpanel" hidden={value !== 3} className="p-5">
          <ExamTab />
        </div>
      </Container>
      {/* <TabPanel value={value} index={2}>
        <AnnouncementTab />
      </TabPanel> */}
    </>
  );
}

export default AdminPage;
