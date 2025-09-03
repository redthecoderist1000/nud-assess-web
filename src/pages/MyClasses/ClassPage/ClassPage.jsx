import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../helper/Supabase";
import { Button, Stack } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AddMemberDialog from "../components/AddMemberDialog";
import SidebarSection from "./component/SidebarSection";
import QuizTab from "./ClassTabs/QuizTab";
import PeopleTab from "./ClassTabs/PeopleTab";
import GradeTab from "./ClassTabs/GradeTab";
import AnnouncementTab from "./ClassTabs/AnnouncementTab";
import QuizIcon from "@mui/icons-material/Quiz";
import GroupIcon from "@mui/icons-material/Group";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import BarChartIcon from "@mui/icons-material/BarChart";

const tabList = [
  { key: "quiz", label: "Quizzes", icon: <QuizIcon fontSize="small" /> },
  { key: "people", label: "People", icon: <GroupIcon fontSize="small" /> },
  {
    key: "announcement",
    label: "Announcements",
    icon: <AnnouncementIcon fontSize="small" />,
  },
  { key: "grade", label: "Grades", icon: <BarChartIcon fontSize="small" /> },
];

const ClassPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classData = location.state;

  const [addMembDia, setAddMemDia] = useState(false);
  const [copyToolTip, setCopyToolTip] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [people, setPeople] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Tab state: "quiz", "people", "announcement", "grade"
  const [activeTab, setActiveTab] = useState("quiz");

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from("vw_quizzesperclass")
      .select("*")
      .eq("class_id", classData.id);

    if (error) {
      console.log("fail to fetch quizzes:", error);
      return;
    }
    setQuizzes(data);
  };

  // Fetch basic member info
  const fetchMember = async () => {
    const { data, error } = await supabase
      .from("vw_membersperclass")
      .select("*")
      .eq("class_id", classData.id);

    if (error) {
      console.log("fail to fetch members:", error);
      return [];
    }
    return data;
  };

  // Fetch and calculate average score per student
  const fetchStudentAverages = async () => {
    const { data, error } = await supabase
      .from("vw_studentlistperquiz")
      .select("name, score, total_items, class_id")
      .eq("class_id", classData.id);

    if (error) {
      console.log("fail to fetch student averages:", error);
      return [];
    }

    // Group by name and calculate average score
    const grouped = {};
    data.forEach((row) => {
      if (!grouped[row.name]) {
        grouped[row.name] = {
          name: row.name,
          totalScore: 0,
          totalItems: 0,
        };
      }
      grouped[row.name].totalScore += row.score || 0;
      grouped[row.name].totalItems += row.total_items || 0;
    });

    return Object.values(grouped).map((student) => ({
      ...student,
      average_score:
        student.totalItems > 0
          ? Math.round((student.totalScore / student.totalItems) * 100)
          : null,
    }));
  };

  // Combine member info and average scores
  const fetchAllPeople = async () => {
    const members = await fetchMember();
    const averages = await fetchStudentAverages();

    // Merge average_score into members by name
    const merged = members.map((member) => {
      const avg = averages.find((a) => a.name === member.name);
      return {
        ...member,
        average_score: avg ? avg.average_score : null,
      };
    });

    setPeople(merged);
  };

  useEffect(() => {
    fetchQuizzes();
    fetchAllPeople();

    supabase
      .channel("class_member_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class_members" },
        () => {
          fetchAllPeople();
        }
      )
      .subscribe();

    supabase
      .channel("class_exam_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class_exam" },
        () => {
          fetchQuizzes();
        }
      )
      .subscribe();
  }, []);

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyToolTip(true);
        setTimeout(() => {
          setCopyToolTip(false);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-y-auto">
      {/* Header Section */}
      <div
        className="w-full p-6 relative h-40 flex justify-between items-center"
        style={{
          background: "linear-gradient(to right, #1E3A8A, #000000)",
        }}
      >
        <Stack justifyContent="start" alignItems="self-start">
          <Button
            sx={{ color: "white", textTransform: "none" }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewRoundedIcon fontSize="big" /> Back to Classes{" "}
          </Button>
          <h1 className="text-6xl font-bold text-white mt-10">
            {classData.class_name}
          </h1>
        </Stack>
      </div>

      {/* Tabs and Main Layout */}
      <div className="flex flex-row flex-1 overflow-hidden mt-6">
        {/* Main Section */}
        <div className="flex flex-col flex-1">
          {/* Tabs */}
          <div className="flex flex-row px-6 pt-2 border-b border-gray-200 ">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm
                  ${
                    activeTab === tab.key
                      ? "text-[#23286b] border-b-2 border-[#23286b] bg-white"
                      : "text-gray-400 bg-white"
                  }
                  transition-colors`}
                style={{
                  outline: "none",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          {/* Content Section */}
          <div className="flex-1 p-6">
            {activeTab === "quiz" && (
              <QuizTab
                quizzes={quizzes}
                classData={classData}
                navigate={navigate}
              />
            )}
            {activeTab === "people" && (
              <div className=" overflow-y-auto">
                <PeopleTab
                  people={people}
                  setAddMemDia={setAddMemDia}
                  canAdd={classData.is_active}
                />
              </div>
            )}
            {activeTab === "announcement" && <AnnouncementTab />}
            {activeTab === "grade" && <GradeTab classData={classData} />}
          </div>
        </div>
        {/* Sidebar Section */}
        <SidebarSection
          classData={classData}
          people={people}
          quizzes={quizzes}
          copyToolTip={copyToolTip}
          copy={copy}
          setAddMemDia={setAddMemDia}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
        />
      </div>
      <AddMemberDialog
        open={addMembDia}
        setOpen={setAddMemDia}
        classId={classData.id}
      />
    </div>
  );
};

export default ClassPage;
