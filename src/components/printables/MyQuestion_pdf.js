import jsPDF from "jspdf";
import set_pdf_header from "./pdf_header";
import autoTable from "jspdf-autotable";

const MyQuestionPdf = (rows, user) => {
  // Implement PDF generation logic here

  const doc = new jsPDF();

  doc.setProperties({
    title: "My Questions",
    subject: "My Questions",
    author: "NUD Assess LLC.",
    keywords: "analytics, class, quiz, report",
    creator: "NUD Assess LLC.",
    creationDate: new Date(), // Custom date
  });
  set_pdf_header(doc);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("My Questions", 105, 45, { align: "center" });

  //   faculty details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Faculty Name: ${user.f_name} ${user.l_name}`, 14, 55);
  doc.text(`Data as of: ${new Date().toLocaleDateString()}`, 14, 60);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("My Quizzes", 14, 70);
  autoTable(doc, {
    theme: "grid",
    startY: 75,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [
      [
        "Question",
        "Type",
        "Cognitive Level",
        "Lesson",
        "Subject",
        "Usage Count",
      ],
    ],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: rows.map((row) => [
      row.question,
      row.type,
      row.blooms_category,
      row.lesson,
      row.subject,
      row.usage_count,
    ]),
    bodyStyles: { textColor: 20 },
  });

  doc.save(`My_Questions_${user.f_name}_${user.l_name}`.replaceAll(" ", "_"));
};

export default MyQuestionPdf;
