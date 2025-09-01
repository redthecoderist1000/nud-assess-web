import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../helper/Supabase";
import {
  Button,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AssignQuizDialog from "../components/AssignQuizDialog";
import AddMemberDialog from "../components/AddMemberDialog";
import dayjs from "dayjs";
import SidebarSection from "./component/SidebarSection";

const ClassPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classData = location.state;

  const [addMembDia, setAddMemDia] = useState(false);
  const [assignQuiz, setAssignQuiz] = useState(false);
  const [copyToolTip, setCopyToolTip] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [people, setPeople] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const handleRemove = (person) => {
    if (window.confirm(`Are you sure you want to remove ${person.name}?`)) {
      setPeople((prevPeople) => prevPeople.filter((p) => p.id !== person.id));
      alert(`${person.name} has been removed.`);
    }
  };

  const handleClickOutside = () => {
    setDropdownVisible(null);
  };

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

  const fetchMember = async () => {
    const { data, error } = await supabase
      .from("vw_membersperclass")
      .select("*")
      .eq("class_id", classData.id);

    if (error) {
      console.log("fail to fetch memebrs:", error);
      return;
    }
    setPeople(data);
  };

  useEffect(() => {
    fetchQuizzes();
    fetchMember();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class_members" },
        (payload) => {
          fetchMember();
        }
      )
      .subscribe();

    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class_exam" },
        (payload) => {
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

  const dateFormat = (dateTime) => {
    const formatted = dayjs(dateTime).format("MMM DD, YYYY hh:mm A");
    return formatted;
  };

  const statusChip = (openTime, closeTime) => {
    const now = dayjs();

    if (!openTime) {
      if (closeTime && now.isAfter(dayjs(closeTime))) {
        return (
          <span
            className={
              "bg-red-200 text-red-600 py-1 rounded-full text-xs font-semibold text-center"
            }
          >
            Closed
          </span>
        );
      }
      return (
        <span
          className={
            "bg-green-200 text-green-600 py-1 rounded-full text-xs font-semibold text-center"
          }
        >
          Open
        </span>
      );
    }

    if (now.isBefore(dayjs(openTime))) {
      return (
        <span
          className={
            "bg-gray-200 text-gray-600 py-1 rounded-full text-xs font-semibold text-center"
          }
        >
          Scheduled
        </span>
      );
    }

    if (closeTime && now.isAfter(dayjs(closeTime))) {
      return (
        <span
          className={
            "bg-red-200 text-red-600 py-1 rounded-full text-xs font-semibold text-center"
          }
        >
          Closed
        </span>
      );
    }

    return (
      <span
        className={
          "bg-green-200 text-green-600 py-1 rounded-full text-xs font-semibold text-center"
        }
      >
        Open
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header Section */}
      <div
        className="w-full h-20 p-6 relative h-60 flex justify-between items-center"
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
          <h1 className="text-7xl font-bold mt-30 text-white">
            {classData.class_name}
          </h1>
        </Stack>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Section */}
        <div className="w-3/4 p-6 overflow-hidden">
          {/* Fixed Quizzes Header */}
          <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Quizzes</h2>
              <Button
                variant="contained"
                disableElevation
                disabled={classData.is_active === false}
                onClick={() => setAssignQuiz(true)}
              >
                Assign Quiz
              </Button>
            </div>
          </div>

          {/* Scrollable Quizzes List */}
          <div className="mt-4 overflow-y-auto h-[calc(100%-4rem)]">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center mb-4"
                onClick={() => {
                  navigate("/quiz", {
                    state: {
                      class_exam_id: quiz.class_exam_id,
                      class_id: classData.id,
                    },
                  });
                }}
              >
                <div>
                  <h3>
                    <b>{quiz.name}</b> | {quiz.total_items} Items
                  </h3>
                  <p className="text-sm text-gray-500">
                    Opens on:{" "}
                    {quiz.open_time
                      ? dateFormat(quiz.open_time)
                      : "No date set"}{" "}
                    | Closes on:{" "}
                    {quiz.close_time
                      ? dateFormat(quiz.close_time)
                      : "No date set"}
                  </p>
                </div>
                <Stack>
                  <p className="text-sm text-gray-500">
                    {quiz.answered}
                    {quiz.total} turned in
                  </p>
                  {statusChip(quiz.open_time, quiz.close_time)}
                </Stack>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Section */}
        <SidebarSection
          classData={classData}
          people={people}
          copyToolTip={copyToolTip}
          copy={copy}
          setAddMemDia={setAddMemDia}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
          handleRemove={handleRemove}
        />
      </div>
      <AddMemberDialog
        open={addMembDia}
        setOpen={setAddMemDia}
        classId={classData.id}
      />
      <AssignQuizDialog
        open={assignQuiz}
        setOpen={setAssignQuiz}
        classId={classData.id}
      />
    </div>
  );
};

export default ClassPage;