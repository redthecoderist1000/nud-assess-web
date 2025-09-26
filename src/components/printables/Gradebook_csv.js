const GradeBook_csv = (headers, body, class_name) => {
  let csv = [];

  csv.push("GRADEBOOK");
  csv.push("");
  csv.push(`Class Name, ${class_name}`);
  csv.push(`Date, ${new Date().toLocaleDateString()}`);
  csv.push("");

  const stringHeaders = headers.map((h) => `"${h.replace(/"/g, '""')}"`);
  csv.push(["Student Name", ...stringHeaders, "Average"].join(","));

  body.forEach((student) => {
    const stringValues = [
      `"${student.student_name.replace(/"/g, '""')}"`,
      ...student.scores.map((s) => `"${s}"`),
      `"${student.average_score}"`,
    ];
    csv.push(stringValues.join(","));
  });

  // console.log(csv);

  const csvContent = csv.join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  let filename = `Gradebook_${class_name}`.replaceAll(" ", "_");

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default GradeBook_csv;
