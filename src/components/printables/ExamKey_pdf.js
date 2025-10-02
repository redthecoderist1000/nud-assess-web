import jsPDF from "jspdf";
import set_pdf_header from "./pdf_header";
import autoTable from "jspdf-autotable";

const ExamKey_pdf = (rows, exam_info) => {
  let filename = `Answer_Key_${exam_info.name}`.replaceAll(" ", "_");

  const doc = new jsPDF();
  doc.setProperties({
    title: `Answer Key for ${exam_info.name}`,
    subject: "Answer Key",
    author: "NUD Assess LLC.",
    keywords: "quiz, report, assessment, answer key",
    creator: "NUD Assess LLC.",
    creationDate: new Date(), // Custom date
  });

  set_pdf_header(doc);

  // Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Answer Key for ${exam_info.name}`, 105, 45, { align: "center" });

  const generateAnswers = (row) => {
    switch (row.type) {
      case "T/F":
        return `${row.answers[0].answer}`;

      case "Multiple Choice":
        return row.answers
          .filter((ans) => ans.is_correct)
          .map((ans) => ans.answer)
          .join(", ");

      case "Identification":
        return row.answers[0].answer;

      default:
        return row.answers
          .filter((ans) => ans.is_correct)
          .map((ans) => ans.answer)
          .join(", ");
    }
  };

  autoTable(doc, {
    theme: "grid",
    startY: 55,
    styles: { fontSize: 10 },
    head: [["No.", "Question", "Answer"]],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: rows.map((row, index) => [
      `${index + 1}`,
      row.question,
      generateAnswers(row),
    ]),
  });

  doc.save(`${filename}.pdf`);
};

export default ExamKey_pdf;
