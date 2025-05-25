import React from "react";
import { useLocation } from "react-router-dom";

function QuizInfoPage() {
  const location = useLocation();
  const { exam_id } = location.state;

  return (
    <>
      <div>QuizInfoPage</div>
      <p>{exam_id}</p>
    </>
  );
}

export default QuizInfoPage;
