import dl_csv from "./dl_csv";

const MyQuestionCsv = (rows, user) => {
  let csv = [];

  csv.push("My Questions");
  csv.push("");
  csv.push(`Faculty Name:, ${user.f_name} ${user.l_name}`);
  csv.push(`Data as of:, ${new Date().toLocaleDateString()}`);
  csv.push("");

  const headers = [
    "Question",
    "Type",
    "Cognitive Level",
    "Lesson",
    "Subject",
    "Usage Count",
  ];

  csv.push(headers.join(","));
  rows.forEach((row) => {
    const question = `"${row.question.replace(/"/g, '""')}"`; // Escape double quotes
    const lesson = `"${row.lesson.replace(/"/g, '""')}"`; // Escape double quotes

    csv.push(
      [
        question,
        row.type,
        row.blooms_category,
        lesson,
        row.subject,
        row.usage_count,
      ].join(",")
    );
  });

  let filename = `My_Questions_${user.f_name}_${user.l_name}`.replaceAll(
    " ",
    "_"
  );

  dl_csv(csv, filename);
};

export default MyQuestionCsv;
