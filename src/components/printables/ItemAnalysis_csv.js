const ItemAnalysis_csv = (rows, exam_info) => {
  let csv = [];

  csv.push("ITEM ANALYSIS");
  csv.push("");
  csv.push(`Class Name, ${exam_info.class_name}`);
  csv.push(`Exam Name, ${exam_info.name}`);
  csv.push(`Date, ${new Date().toLocaleDateString()}`);
  csv.push("");

  const headers = ["Question", "Correct", "Incorrect"];
  csv.push(headers.join(","));

  rows.forEach((row) => {
    const question = `"${row.question.replace(/"/g, '""')}"`; // Escape double quotes
    csv.push(`${question}, ${row.correct}, ${row.in_correct}`);
  });

  const total = rows.reduce(
    (acc, row) => {
      acc.correct += row.correct;
      acc.in_correct += row.in_correct;
      return acc;
    },
    { correct: 0, in_correct: 0 }
  );

  csv.push(`Total, ${total.correct}, ${total.in_correct}`);

  const csvContent = csv.join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  let filename =
    `Item_Analysis_${exam_info.class_name}_${exam_info.name}`.replaceAll(
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

export default ItemAnalysis_csv;
