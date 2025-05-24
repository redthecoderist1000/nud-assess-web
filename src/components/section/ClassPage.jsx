import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../assets/images/header.png";
import { supabase } from "../../helper/Supabase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AddMemberDialog from "../elements/AddMemberDialog";
import AssignQuizDialog from "../elements/AssignQuizDialog";

const ClassPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classData = location.state;

  // class_name: "CCTAPTAPTAP";
  // created_at: "2025-05-22T18:57:20.687898+00:00";
  // created_by: "f033b1aa-cc33-497f-bae7-ed8de67fe495";
  // desc: "";
  // id: "f195ee56-98c2-4a91-8d06-f09e6c250b41";
  // is_active: true;
  // join_code: "gsavxjr";

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
        // alert("Copied to clipboard");
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
            sx={{ color: "white", textTransform: "lowercase" }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" /> return{" "}
          </Button>
          <h1 className="text-7xl font-bold mt-30 text-white">
            {classData.class_name}
          </h1>
        </Stack>
        <img
          src={Header}
          alt="Header"
          className="h-60 object-contain ml-4 mt-5"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Section */}
        <div className="w-3/4 p-6 overflow-hidden">
          {/* Fixed Quizzes Header */}
          <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Quizzes</h2>
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800"
                onClick={() => setAssignQuiz(true)}
              >
                Assign Quiz
              </button>
            </div>
          </div>

          {/* Scrollable Quizzes List */}
          <div className="mt-4 overflow-y-auto h-[calc(100%-4rem)]">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center mb-4"
              >
                <div>
                  <h3 className="font-bold">{quiz.name}</h3>
                  <p className="text-sm text-gray-500">
                    {quiz.due_date == null
                      ? "No due date"
                      : "Due on: " + quiz.due_date}{" "}
                    | {quiz.total_items} Items
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {quiz.answered}
                  {quiz.total} turned in
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="w-1/4 bg-indigo-900 text-white p-6 rounded-md shadow-lg h-235 m-5 overflow-hidden">
          {/* Fixed Section */}
          <div className="sticky top-0 bg-indigo-900 z-10">
            <h2 className="text-lg font-bold mb-4">In this class</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-300">Description</p>
              <p className="text-base font-semibold">{classData.desc}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-300">Class join code</p>
              <Stack direction="row" alignItems="center" spacing={2}>
                <p className="text-base font-semibold">{classData.join_code}</p>
                <Tooltip
                  open={copyToolTip}
                  arrow
                  placement="top-start"
                  disableFocusListener
                  title="Copied to clipboard"
                >
                  <IconButton
                    size="small"
                    onClick={() => copy(classData.join_code)}
                  >
                    <ContentCopyRoundedIcon
                      sx={{ color: "whitesmoke" }}
                      fontSize="small"
                    />
                  </IconButton>
                </Tooltip>
              </Stack>
            </div>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <p className="text-sm text-gray-300 m-0">
                People ({people.length})
              </p>
              <Button
                size="small"
                sx={{ color: "white" }}
                variant="contained"
                onClick={() => {
                  setAddMemDia(true);
                }}
              >
                Add member
              </Button>
            </Stack>
          </div>

          {/* Scrollable People List */}
          <ul className="mt-2 space-y-2 overflow-y-auto h-[calc(100%-10rem)]">
            {people.map((person, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-indigo-800 p-2 rounded-md relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Stack>
                  {/* <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-8 h-8 rounded-full object-cover"
                  /> */}
                  <span>{person.f_name + " " + person.l_name}</span>
                  <span>{person.email}</span>
                </Stack>
                {/* <button
                  className="text-gray-300 hover:text-white"
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   setDropdownVisible(
                  //     dropdownVisible === person.id ? null : person.id
                  //   );
                  // }}
                >
                  ⋮
                </button> */}
                {dropdownVisible === person.id && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg z-10">
                    <button
                      className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                      onClick={() => alert(`Assigning quiz to ${person.name}`)}
                    >
                      Assign Quiz
                    </button>
                    <button
                      className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                      onClick={() => handleRemove(person)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
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
