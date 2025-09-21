import { useState } from "react";
import DashboardLead from "./component/DashboardLead";
import PerfOverview from "./component/PerfOverview/PerfOverview";
import TopPerf from "./component/TopPerf";
import LowPerf from "./component/LowPerf";
import { Container } from "@mui/material";

const DashboardPage = () => {
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

      <div className="mt-6">
        <PerfOverview />
      </div>

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
    </Container>
  );
};

export default DashboardPage;
