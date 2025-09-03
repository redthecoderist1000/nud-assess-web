export function downloadWordReport({
  summaryData,
  quizData,
  scoreDist,
  lessonPerf,
  questionTypes,
  questionAnalysis,
  tosPlacement,
  taxonomyAnalysis,
  filename = "class_report.doc"
}) {
  const html = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="UTF-8">
      <title>Class Performance Report</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #222; margin: 0; padding: 24px; }
        .header { text-align: center; margin-bottom: 24px; }
        .header h1 { font-size: 2em; margin: 0; color: #26348b; }
        .header p { font-size: 1em; color: #555; margin: 8px 0 0 0; }
        .section { margin-bottom: 32px; border-radius: 12px; border: 1px solid #eee; padding: 16px; background: #fafbff; }
        .section-title { font-size: 1.2em; font-weight: bold; color: #35408E; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #eee; padding: 8px 12px; text-align: left; font-size: 1em; }
        th { background: #f3f3f7; color: #26348b; }
        td { background: #fff; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Class Performance Report</h1>
        <p>Analytics and performance insights for BSIT 3A</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="section-title">Summary</div>
        <table>
          <tr><th>Number of Students</th><td>${summaryData.students}</td></tr>
          <tr><th>Number of Quizzes</th><td>${summaryData.quizzes}</td></tr>
          <tr><th>Average Class Score</th><td>${summaryData.avgScore} <span style="color:green;">(${summaryData.avgScoreChange} from last month)</span></td></tr>
          <tr><th>Pass Rate</th><td>${summaryData.passRate} (≥70%)</td></tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Performance by Quiz</div>
        <table>
          <tr><th>Quiz</th><th>Avg Score</th><th>Highest</th><th>Lowest</th><th>Pass Rate</th><th>Attempts</th></tr>
          ${quizData.map(q => `<tr>
            <td>${q.quiz}</td><td>${q.avg}</td><td>${q.high}</td><td>${q.low}</td><td>${q.pass}</td><td>${q.attempts}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Score Distribution</div>
        <table>
          <tr><th>Score Range</th><th>Number of Students</th></tr>
          ${scoreDist.map(s => `<tr><td>${s.range}</td><td>${s.count}</td></tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Performance Per Lesson</div>
        <table>
          <tr><th>Lesson</th><th>Score</th></tr>
          ${lessonPerf.map(l => `<tr><td>${l.lesson}</td><td>${l.score}</td></tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Performance by Question Type</div>
        <table>
          <tr><th>Type</th><th>Questions</th><th>Success Rate</th><th>Avg Time</th><th>Disc</th></tr>
          ${questionTypes.map(q => `<tr>
            <td>${q.type}</td><td>${q.questions}</td><td>${q.successRate}</td><td>${q.avgTime}</td><td>${q.disc}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Detailed Question Analysis</div>
        <table>
          <tr><th>Question</th><th>Type</th><th>Bloom's Level</th><th>Success Rate</th><th>Usage</th><th>Last Used</th><th>Status</th></tr>
          ${questionAnalysis.map(q => `<tr>
            <td>${q.question}</td><td>${q.type}</td><td>${q.bloom}</td><td>${q.successRate}</td><td>${q.usage}</td><td>${q.lastUsed}</td><td>${q.status}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Performance Per Placement in TOS</div>
        <table>
          <tr><th>Bloom's Level</th><th>Score</th></tr>
          ${tosPlacement.map(t => `<tr><td>${t.level}</td><td>${t.score}</td></tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Bloom's Taxonomy Analysis</div>
        <table>
          <tr><th>Bloom Level</th><th>Number of Questions</th><th>Percentage</th></tr>
          ${taxonomyAnalysis.map(t => `<tr><td>${t.level}</td><td>${t.count}</td><td>${t.percent}</td></tr>`).join("")}
          <tr><th>Total</th><th>80</th><th>100%</th></tr>
        </table>
      </div>
    </body>
  </html>
  `;

  const blob = new Blob([html], { type: "application/msword" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}