const Analytics_csv = (generalData, quizData, questionData) => {
  let csv = [];
  csv.push("ANALYTICS REPORT");
  csv.push("");
  csv.push(`Class Name, ${generalData.class_name.replace(/,/g, " ")}`);
  csv.push(`Date, ${new Date().toLocaleDateString()}`);
  csv.push("");
  csv.push("Average Score, " + (generalData.ave_score || 0) + "%");
  csv.push("Exam Count, " + (generalData.exam_count || 0));
  csv.push("Member Count, " + (generalData.member_count || 0));
  csv.push("Passing Rate, " + (generalData.passing_rate || 0) + "%");
  csv.push("");

  //   per_by quiz
  csv.push("Performance by Quiz");
  csv.push("Quiz Name, Avg. Score, Highest, Lowest, Passing Rate, Attempts");
  quizData.perf_by_quiz.forEach((quiz) => {
    const quizName = `"${quiz.quiz_name.replace(/"/g, '""')}"`;
    const avgScore = quiz.avgScore || 0;
    const highest = quiz.highest || 0;
    const lowest = quiz.lowest || 0;
    const passingRate = quiz.passRate || 0;
    const attempts = quiz.attempts || 0;
    csv.push(
      [
        quizName,
        avgScore + "%",
        highest,
        lowest,
        passingRate + "%",
        attempts,
      ].join(",")
    );
  });
  csv.push("");

  //   score distribution
  csv.push("Score Distribution");
  csv.push("Score Range, Student Count");
  quizData.distribution.forEach((dist) => {
    csv.push(`${dist.range}, ${dist.value}`);
  });
  csv.push("");

  //perf by lesson
  csv.push("Performance by Lesson");
  csv.push("Lesson Name, Avg. Score");
  quizData.perf_per_lesson.forEach((lesson) => {
    const lessonName = `"${lesson.title.replace(/"/g, '""')}"`;
    const avgScore = lesson.score || 0;
    csv.push([lessonName, avgScore].join(","));
  });
  csv.push("");

  //   perf by blooms
  csv.push("Performance by Bloom's Taxonomy");
  csv.push("Cognitive Level, Question Count, Avg. Score");
  quizData.perf_by_bloom.forEach((bloom) => {
    const level = `"${bloom.cognitive_level.replace(/"/g, '""')}"`;
    const questionCount = bloom.question_count || 0;
    const avgScore = bloom.ave_score || 0;
    csv.push([level, questionCount, avgScore].join(","));
  });
  csv.push("");

  //   bloom tax
  csv.push("Bloom's Taxonomy Analysis");
  csv.push("Cognitive Level, Question Count, Percentage");
  quizData.bloom_tax.forEach((bloom) => {
    const level = `"${bloom.cognitive_level.replace(/"/g, '""')}"`;
    const questionCount = bloom.question_count || 0;
    const percentage = bloom.percent || 0;
    csv.push([level, questionCount, percentage + "%"].join(","));
  });
  csv.push("");

  //question
  //   perf by que type
  csv.push("Performance by Question Analysis");
  csv.push("Question Type, Question Count, Success Rate");
  questionData.perf_que_type.forEach((type) => {
    const qtype = `"${type.type.replace(/"/g, '""')}"`;
    const questionCount = type.questions || 0;
    const successRate = type.successRate || 0;
    csv.push([qtype, questionCount, successRate + "%"].join(","));
  });
  csv.push("");

  //detailed queztion analysis
  csv.push("Detailed Question Analysis");
  csv.push("Question, Subject, Cognitive Level, Type, Usage, Success Rate");
  questionData.detailed_que_analysis.forEach((que) => {
    const question = `"${que.question.replace(/"/g, '""')}"`;
    const subject = `"${que.sub.replace(/"/g, '""')}"`;
    const cognitiveLevel = `"${que.bloom.replace(/"/g, '""')}"`;
    const type = `"${que.type.replace(/"/g, '""')}"`;
    const usage = que.usage || 0;
    const successRate = que.successRate || 0;
    csv.push(
      [question, subject, cognitiveLevel, type, usage, successRate + "%"].join(
        ","
      )
    );
  });
  csv.push("");

  const csvContent = csv.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  let filename = `Analytics_Report_${generalData.class_name}`.replaceAll(
    " ",
    "_"
  );
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default Analytics_csv;
