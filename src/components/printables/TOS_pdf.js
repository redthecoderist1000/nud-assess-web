import jsPDF from "jspdf";
import set_pdf_header from "./pdf_header";
import autoTable from "jspdf-autotable";

const summarizeLessons = (rows) => {
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

const TOS_pdf_export = (rows, quizName) => {
  const filename = `TOS_${quizName.replace(/\s+/g, "_")}.pdf`;

  const total = summarizeLessons(rows);

  const doc = new jsPDF();
  doc.setProperties({
    title: quizName,
    subject: "Table of Specification",
    author: "NUD Assess LLC.",
    keywords: "table of specification, quiz, report, bloom's taxonomy",
    creator: "NUD Assess LLC.",
    creationDate: new Date(),
  });

  set_pdf_header(doc);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`Table of Specification for ${quizName}`, 105, 45, {
    align: "center",
  });

  autoTable(doc, {
    theme: "grid",
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    head: [
      [
        "Topics",
        "Hours",
        "%",
        "Remembering",
        "Understanding",
        "Applying",
        "Analyzing",
        "Evaluating",
        "Creating",
        "Total per Topic",
      ],
    ],
    body: rows.map((row) => [
      row.topic,
      row.hours,
      row.percentage,
      row.remembering,
      row.understanding,
      row.applying,
      row.analyzing,
      row.evaluating,
      row.creating,
      row.totalItems,
    ]),
    foot: [
      [
        "Total",
        total.hours,
        total.percentage,
        total.remembering,
        total.understanding,
        total.applying,
        total.analyzing,
        total.evaluating,
        total.creating,
        total.totalItems,
      ],
    ],
    footStyles: { fillColor: [48, 84, 150], textColor: 255 },
    startY: 55,
    bodyStyles: { textColor: 20 },
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    columnStyles: {
      0: { minCellWidth: 30 },
      1: { minCellWidth: 10 },
      2: { minCellWidth: 15 },
      3: { minCellWidth: 15 },
      4: { minCellWidth: 15 },
      5: { minCellWidth: 15 },
      6: { minCellWidth: 15 },
      7: { minCellWidth: 15 },
      8: { minCellWidth: 15 },
      9: { minCellWidth: 10 },
    },
  });

  // Save PDF
  doc.save(filename);
};

export default TOS_pdf_export;
