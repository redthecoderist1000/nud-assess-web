import React from "react";
import PerfQuestionType from "../components/PerfQuestionType";
import QuestionTable from "../components/QuestionTable";

const Question = ({ analyticsData }) => {
  return (
    <div className="w-full">
      <PerfQuestionType perf_que_type={analyticsData.perf_que_type} />
      <div className="pt-4">
        <QuestionTable
          detailed_que_analysis={analyticsData.detailed_que_analysis}
        />
      </div>
    </div>
  );
};

export default Question;
