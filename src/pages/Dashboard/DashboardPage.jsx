import { useState } from "react";
import DashboardLead from "./component/DashboardLead";
import PerfOverview from "./component/PerfOverview/PerfOverview";
import TopPerf from "./component/TopPerf";
import LowPerf from "./component/LowPerf";
import CreateClass from "../MyClasses/components/CreateClass";
import { Container } from "@mui/material";

const DashboardPage = () => {
  const [createClassOpen, setCreateClassOpen] = useState(false);

  const handleCreateClassSave = () => {
    setCreateClassOpen(false);
  };

  return (
    <Container maxWidth="xl" className="my-5">
      <div className="bg-white border-b border-gray-200 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Manage your test bank and track student performance
        </p>
      </div>

      <div className="mt-6">
        <DashboardLead />
      </div>

      <PerfOverview />

      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Top Performers */}
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-[400px] overflow-y-auto">
              <TopPerf />
            </div>
          </div>
          {/* Low Performers */}
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-[400px] overflow-y-auto">
              <LowPerf />
            </div>
          </div>
        </div>
      </div>

      {createClassOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
            <CreateClass
              onSave={handleCreateClassSave}
              onCancel={() => setCreateClassOpen(false)}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default DashboardPage;
