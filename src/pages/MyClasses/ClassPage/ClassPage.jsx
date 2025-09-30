import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../../helper/Supabase";
import { Button, Grid, Stack } from "@mui/material";
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
  { key: 0, label: "Quizzes", icon: <QuizIcon fontSize="small" /> },
  { key: 1, label: "People", icon: <GroupIcon fontSize="small" /> },
  {
    key: 2,
    label: "Announcements",
    icon: <AnnouncementIcon fontSize="small" />,
  },
  { key: 3, label: "Grades", icon: <BarChartIcon fontSize="small" /> },
];

const ClassPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParams = searchParams.get("tab") ?? 0;

  const class_id = searchParams.get("class_id");

  const navigate = useNavigate();
  // const classData = location.state;
  const [classData, setClassData] = useState({});

  const [people, setPeople] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Tab state: "quiz", "people", "announcement", "grade"
  const [activeTab, setActiveTab] = useState(parseInt(tabParams, 10));

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from("vw_quizzesperclass")
      .select("*")
      .eq("class_id", class_id);

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
      .eq("class_id", class_id);

    if (error) {
      console.log("fail to fetch members:", error);
      return [];
    }
    return data;
  };

  const fetchDetails = async () => {
    const { data, error } = await supabase
      .from("tbl_class")
      .select("*")
      .eq("id", class_id)
      .single();
    if (error) {
      console.log("fail to fetch class details:", error);
      return;
    }

    setClassData(data);
  };

  // Fetch and calculate average score per student
  const fetchStudentAverages = async () => {
    const { data, error } = await supabase
      .from("vw_studentlistperquiz")
      .select("name, score, total_items, class_id")
      .eq("class_id", class_id);

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

    // console.log(merged);

    setPeople(merged);
  };

  const changeTab = (tabKey) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabKey);
    setActiveTab(tabKey);
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    fetchQuizzes();
    fetchAllPeople();
    fetchDetails();
    const classChannel = supabase
      .channel("class_member_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_class_members",
        },
        (payload) => {
          const row = payload.new || payload.old;
          const event = payload.eventType;
          console.log(row);
          console.log(classData.id);
          if (row.class_id === class_id || event === "DELETE") {
            fetchAllPeople();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbl_class_exam",
        },
        (payload) => {
          const event = payload.eventType;
          const row = payload.new || payload.old;
          if (row.class_id === class_id || event === "DELETE") {
            fetchQuizzes();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(classChannel);
    };
  }, [class_id]);

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
            startIcon={<ArrowBackIosNewRoundedIcon />}
          >
            Back
          </Button>
          <h1 className="text-6xl font-bold text-white mt-10">
            {classData.class_name}
          </h1>
        </Stack>
      </div>

      {/* Tabs and Main Layout */}
      <Grid container direction="row" p={4} spacing={4}>
        {/* Main Section (right) */}
        <Grid flex={3}>
          <Stack spacing={4}>
            {/* Tabs */}
            <div className="flex flex-row border-b border-gray-200 ">
              {/* tabs */}
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
                  onClick={() => changeTab(tab.key)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Content Section */}
            {activeTab === 0 && (
              <QuizTab quizzes={quizzes} class_id={class_id} />
            )}
            {activeTab === 1 && (
              <PeopleTab people={people} class_id={class_id} />
            )}
            {activeTab === 2 && <AnnouncementTab class_id={class_id} />}
            {activeTab === 3 && (
              <GradeTab class_id={class_id} class_name={classData.class_name} />
            )}
          </Stack>
        </Grid>

        {/* Sidebar Section */}
        <Grid flex={1}>
          <SidebarSection
            classData={classData}
            people={people}
            quizzes={quizzes}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ClassPage;
