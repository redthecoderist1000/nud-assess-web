import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import set_pdf_header from "./pdf_header";

const ItemAnalysis_pdf = (rows, exam_info) => {
  let filename =
    `Item_Analysis_${exam_info.class_name}_${exam_info.name}`.replaceAll(
      " ",
      "_"
    );

  const total = rows.reduce(
    (acc, row) => {
      acc.correct += row.correct;
      acc.in_correct += row.in_correct;
      return acc;
    },
    { correct: 0, in_correct: 0 }
  );

  const doc = new jsPDF();
  doc.setProperties({
    title: "Item Analysis",
    subject: "Item Analysis Report",
    author: "NUD Assess LLC.",
    keywords: "item analysis, quiz, report",
    creator: "NUD Assess LLC.",
    creationDate: new Date(), // Custom date
  });

  set_pdf_header(doc);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Item Analysis", 105, 45, { align: "center" });

  //   exam details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Class Name: ${exam_info.class_name}`, 14, 55);
  doc.text(`Exam Name: ${exam_info.name}`, 14, 60);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 65);

  autoTable(doc, {
    theme: "grid",
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    head: [["Questions", "No. of Correct", "No. of Incorrect"]],
    body: rows.map((row) => [row.question, row.correct, row.in_correct]),
    didDrawCell: function (data) {
      const isLastRow = data.row.index === data.table.body.length - 1;
      const isLastColumn = data.column.index === data.table.columns.length - 1;

      if (isLastRow && isLastColumn) {
        // Draw footer below the table
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Total Correct: ${total.correct}`,
          data.cell.x - data.cell.width,
          data.cell.y + data.cell.height + 5
        );
        doc.text(
          `Total Incorrect: ${total.in_correct}`,
          data.cell.x,
          data.cell.y + data.cell.height + 5
        );
      }
    },
    startY: 75,
    bodyStyles: { textColor: 20 },
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    columnStyles: {
      0: { minCellWidth: 60, halign: "left", overflow: "linebreak" },
      1: { minCellWidth: 30 },
      2: { minCellWidth: 30 },
    },
  });

  // Save PDF
  doc.save(filename);
};

export default ItemAnalysis_pdf;
