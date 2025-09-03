export function downloadFullCSV({
  summaryData,
  quizData,
  scoreDist,
  lessonPerf,
  questionTypes,
  questionAnalysis,
  tosPlacement,
  taxonomyAnalysis,
  filename = "class_report.csv"
}) {
  let csv = [];

  csv.push("Summary");
  csv.push("Number of Students,Number of Quizzes,Average Class Score,Pass Rate");
  csv.push(`${summaryData.students},${summaryData.quizzes},${summaryData.avgScore} (${summaryData.avgScoreChange} from last month),${summaryData.passRate} (≥70%)`);
  csv.push(""); 

  csv.push("Performance by Quiz");
  csv.push("Quiz,Avg Score,Highest,Lowest,Pass Rate,Attempts");
  quizData.forEach(q => {
    csv.push(`${q.quiz},${q.avg},${q.high},${q.low},${q.pass},${q.attempts}`);
  });
  csv.push("");

  csv.push("Score Distribution");
  csv.push("Score Range,Number of Students");
  scoreDist.forEach(s => {
    csv.push(`${s.range},${s.count}`);
  });
  csv.push("");

  csv.push("Performance Per Lesson");
  csv.push("Lesson,Score");
  lessonPerf.forEach(l => {
    csv.push(`${l.lesson},${l.score}`);
  });
  csv.push("");

  csv.push("Performance by Question Type");
  csv.push("Type,Questions,Success Rate,Avg Time,Disc");
  questionTypes.forEach(q => {
    csv.push(`${q.type},${q.questions},${q.successRate},${q.avgTime},${q.disc}`);
  });
  csv.push("");

  csv.push("Detailed Question Analysis");
  csv.push("Question,Type,Bloom's Level,Success Rate,Usage,Last Used,Status");
  questionAnalysis.forEach(q => {
    csv.push(`"${q.question}",${q.type},${q.bloom},${q.successRate},${q.usage},${q.lastUsed},${q.status}`);
  });
  csv.push("");

  csv.push("Performance Per Placement in TOS");
  csv.push("Bloom's Level,Score");
  tosPlacement.forEach(t => {
    csv.push(`${t.level},${t.score}`);
  });
  csv.push("");

  csv.push("Bloom's Taxonomy Analysis");
  csv.push("Bloom Level,Number of Questions,Percentage");
  taxonomyAnalysis.forEach(t => {
    csv.push(`${t.level},${t.count},${t.percent}`);
  });
  csv.push("Total,80,100%");
  csv.push("");

  const csvContent = csv.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}