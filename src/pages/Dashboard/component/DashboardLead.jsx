import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../App";
import { supabase } from "../../../helper/Supabase";
import { icons } from "lucide-react";
import { CircularProgress, Stack } from "@mui/material";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CreateDialog from "../../../components/elements/CreateDialog";
import CreateClass from "../../MyClasses/components/CreateClass";

const DashboardLead = ({}) => {
  const { user, setSnackbar } = useContext(userContext);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [createDialog, setCreateDialog] = useState({
    open: false,
    type: null,
  });
  const [createClass, setCreateClass] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_dashboardlead").single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching dashboard data",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    setStats(data);
    // console.log(data);
    setLoading(false);
  };

  const createQuiz = () => {
    setCreateDialog({ open: true, type: "quiz" });
  };
  const createQuestion = () => {
    setCreateDialog({ open: true, type: "question" });
  };

  return (
    <div className="rounded-2xl bg-[#4957a3] p-6 md:p-8 pb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back, {user.f_name}!
          </h2>
        </div>
        <Stack
          direction="row"
          flexWrap={"wrap"}
          justifyContent={"center"}
          gap={2}
        >
          <button
            className="flex items-center gap-2 bg-[#3d478c] text-white px-3 py-2 md:px-4 rounded-lg font-medium text-sm hover:bg-[#2e3566] transition"
            onClick={createQuiz}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="2"
                stroke="currentColor"
              />
              <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
              <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" />
            </svg>
            Create Quiz
          </button>
          <button
            className="flex items-center gap-2 bg-[#3d478c] text-white px-3 py-2 md:px-4 rounded-lg font-medium text-sm hover:bg-[#2e3566] transition"
            onClick={createQuestion}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" />
              <path d="M12 16v-4" stroke="currentColor" />
              <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
            Create Questions
          </button>
          <button
            className="flex items-center gap-2 bg-[#3d478c] text-white px-3 py-2 md:px-4 rounded-lg font-medium text-sm hover:bg-[#2e3566] transition"
            onClick={() => setCreateClass(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 21v-2a4 4 0 0 0-8 0v2" stroke="currentColor" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" />
              <path d="M5.5 17a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" />
              <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" />
            </svg>
            Create Class
          </button>
        </Stack>
      </div>
      {loading ? (
        <div className="text-center">
          <CircularProgress sx={{ color: "#7f88c4ff" }} />
        </div>
      ) : (
        <Stack
          direction="row"
          rowGap={1}
          columnGap={1}
          mt={2}
          flex={1}
          flexWrap="wrap"
        >
          <div className="flex items-center gap-3 bg-[#6b7bd6] bg-opacity-40 rounded-xl px-6 py-4   flex-1 min-w-[160px] ">
            <FactCheckRoundedIcon sx={{ color: "#ffb74cff" }} />
            <div>
              <div className="text-2xl font-bold text-white leading-tight">
                {stats.total_quizzes}
              </div>
              <div className="text-white text-sm opacity-80">Total Quizzes</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#6b7bd6] bg-opacity-40 rounded-xl px-6 py-4 flex-1 min-w-[160px] ">
            <InfoOutlineRoundedIcon sx={{ color: "#ffb74cff" }} />
            <div>
              <div className="text-2xl font-bold text-white leading-tight">
                {stats.total_questions}
              </div>
              <div className="text-white text-sm opacity-80">
                Total Questions
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#6b7bd6] bg-opacity-40 rounded-xl px-6 py-4 flex-1 min-w-[160px] ">
            <PersonRoundedIcon sx={{ color: "#ffb74cff" }} />
            <div>
              <div className="text-2xl font-bold text-white leading-tight">
                {stats.total_students}
              </div>
              <div className="text-white text-sm opacity-80">
                Total Students on Active Classes
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#6b7bd6] bg-opacity-40 rounded-xl px-6 py-4 flex-1 min-w-[160px] ">
            <SchoolRoundedIcon sx={{ color: "#ffb74cff" }} />
            <div>
              <div className="text-2xl font-bold text-white leading-tight">
                {stats.total_classes}
              </div>
              <div className="text-white text-sm opacity-80">
                Total Active Classes
              </div>
            </div>
          </div>
        </Stack>
      )}

      <CreateDialog
        open={createDialog.open}
        onClose={() => setCreateDialog({ open: false, type: null })}
        type={createDialog.type}
      />

      <CreateClass open={createClass} setOpen={setCreateClass} />
    </div>
  );
};

export default DashboardLead;
