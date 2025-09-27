import dl_csv from "./dl_csv";

const MyQuiz_csv = (rows, user) => {
  let csv = [];

  csv.push("My Quizzes");
  csv.push("");
  csv.push(`Faculty Name:, ${user.f_name} ${user.l_name}`);
  csv.push(`Data as of:, ${new Date().toLocaleDateString()}`);
  csv.push("");

  const headers = [
    "Exam Name",
    "Subject",
    "Total Items",
    "Usage Count",
    "Quiz Type",
  ];
  csv.push(headers.join(","));
  rows.forEach((row) => {
    const exam_name = `"${row.exam_name.replace(/"/g, '""')}"`; // Escape double quotes
    const subject_name = `${row.subject_name.replace(/"/g, '""')}`;
    const repository = `${row.repository.replace(/"/g, '""')}`;
    csv.push(
      `${exam_name}, ${subject_name}, ${row.total_items}, ${row.usage_count}, ${repository}`
    );
  });

  //
  let filename = `My_Quizzes_${user.f_name}_${user.l_name}`.replaceAll(
    " ",
    "_"
  );

  dl_csv(csv, filename);
};

export default MyQuiz_csv;
