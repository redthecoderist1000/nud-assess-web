import { Container } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SchoolTab from "./tabs/SchoolTab";
import DeptTab from "./tabs/DeptTab";
import ProgramTab from "./tabs/ProgramTab";

const SAdminPage = () => {
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
      <div className="bg-[#35408E] text-white flex  py-3 m-0">
        <Container maxWidth="xl">
          <span
            onClick={() => changeTab(0)}
            className={`cursor-pointer ml-15 hover:underline ${
              value === 0 ? "text-amber-400 font-bold" : ""
            }`}
          >
            Schools
          </span>
          <span
            onClick={() => changeTab(1)}
            className={`cursor-pointer ml-15 hover:underline ${
              value === 1 ? "text-amber-400 font-bold" : ""
            }`}
          >
            Departments
          </span>
          <span
            onClick={() => changeTab(2)}
            className={`cursor-pointer ml-15 hover:underline ${
              value === 2 ? "text-amber-400 font-bold" : ""
            }`}
          >
            Programs
          </span>
        </Container>
      </div>
      <Container maxWidth="xl" sx={{ my: 5 }}>
        <div role="tabpanel" hidden={value !== 0} className="p-5">
          <SchoolTab />
        </div>
        <div role="tabpanel" hidden={value !== 1} className="p-5">
          <DeptTab />
        </div>
        <div role="tabpanel" hidden={value !== 2} className="p-5">
          <ProgramTab />
        </div>
      </Container>
    </>
  );
};

export default SAdminPage;
