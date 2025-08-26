import React from "react";
import PerfQuestionType from "../components/PerfQuestionType";
import QuestionTable from "../components/QuestionTable";

const Question = () => {
  return (
    <div className="w-full">
      <PerfQuestionType />
      <div className="pt-4">
        <QuestionTable />
      </div>
    </div>
  );
};

export default Question;