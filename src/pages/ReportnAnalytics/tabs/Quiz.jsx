import React from "react";

import PerformanceByQuiz from "../components/PerformanceByQuiz";
import ScoreDistribution from "../components/ScoreDistribution";
import PerformancePerLesson from "../components/PerformancePerLesson";
import TOSPlacement from "../components/TOSPlacement";
import BTaxonomyAnalysis from "../components/BTaxonomyAnalysis";

const Quiz = ({ analyticsData }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top row: PerformanceByQuiz and ScoreDistribution */}
      <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-[2] min-w-0 flex">
          <PerformanceByQuiz perf_by_quiz={analyticsData.perf_by_quiz} />
        </div>
        <div className="flex-1 min-w-0 flex">
          <ScoreDistribution distribution={analyticsData.distribution} />
        </div>
      </div>
      {/* PerformancePerLesson full width */}
      <div className="w-full">
        <PerformancePerLesson perf_per_lesson={analyticsData.perf_per_lesson} />
      </div>
      {/* TOSPlacement and BTaxonomyAnalysis side by side */}
      <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-1 min-w-0 flex">
          <TOSPlacement perf_by_bloom={analyticsData.perf_by_bloom} />
        </div>
        <div className="flex-1 min-w-0 flex">
          <BTaxonomyAnalysis bloom_tax={analyticsData.bloom_tax} />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
