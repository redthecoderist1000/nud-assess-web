const TOS_csv_export = (rows, quizName) => {
  let csv = [];

  csv.push(`TABLE OF SPECIFICATION`);
  csv.push("");
  csv.push(`Quiz Name, ${quizName}`);
  csv.push("");
  csv.push(
    "Topic, Time spent per topic (hours), %, Remembering, Understanding, Applying, Analyzing, Creating, Evaluating, Total Items"
  );
  rows.forEach((row) => {
    const topic = `"${row.topic.replace(/"/g, '""')}"`;
    csv.push(
      `${topic}, ${row.hours}, ${row.percentage}, ${row.remembering}, ${row.understanding}, ${row.applying}, ${row.analyzing}, ${row.creating}, ${row.evaluating}, ${row.totalItems}`
    );
  });

  const summarizeLessons = () => {
    const summary = {
      hours: 0,
      percentage: 0,
      remembering: 0,
      understanding: 0,
      applying: 0,
      analyzing: 0,
      creating: 0,
      evaluating: 0,
      totalItems: 0,
    };

    rows.forEach((rows) => {
      summary.hours += parseFloat(rows.hours);
      summary.percentage += parseFloat(rows.percentage);
      summary.remembering += rows.remembering;
      summary.understanding += rows.understanding;
      summary.applying += rows.applying;
      summary.analyzing += rows.analyzing;
      summary.creating += rows.creating;
      summary.evaluating += rows.evaluating;
      summary.totalItems += rows.totalItems;
    });

    return summary;
  };

  const total = summarizeLessons();
  csv.push(
    `Total, ${total.hours}, ${total.percentage}, ${total.remembering}, ${total.understanding}, ${total.applying}, ${total.analyzing}, ${total.creating}, ${total.evaluating}, ${total.totalItems}`
  );

  let filename = quizName.replaceAll(" ", "_");

  const csvContent = csv.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default TOS_csv_export;
