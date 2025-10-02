import jsPDF from "jspdf";
import set_pdf_header from "./pdf_header";
import autoTable from "jspdf-autotable";

const Exam_pdf = (rows, exam_info) => {
  let filename = `${exam_info.name}`.replaceAll(" ", "_");

  const doc = new jsPDF();
  doc.setProperties({
    title: `Exam ${exam_info.name}`,
    subject: "Exam",
    author: "NUD Assess LLC.",
    keywords: "quiz, report, assessment",
    creator: "NUD Assess LLC.",
    creationDate: new Date(), // Custom date
  });

  set_pdf_header(doc);

  // Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`${exam_info.subject_name}`, 105, 45, { align: "center" });

  //   exam details
  doc.setFont("helvetica", "normal");
  doc.text(`${exam_info.name}`, 105, 50, { align: "center" });
  doc.setFontSize(8);
  doc.text(`${exam_info.repository}`, 105, 55, { align: "center" });

  // Left column
  const startX = 14;
  const startY = 65;
  const lineLength = 60; // You can set this dynamically

  doc.setFontSize(10);
  doc.text("Name:", startX, startY);
  doc.line(startX + 11, startY, startX + 11 + lineLength, startY); // underline
  doc.text("Course and Section:", startX, startY + 5);
  doc.line(startX + 34, startY + 5, startX + 30 + lineLength, startY + 5);
  doc.text("Professor:", startX, startY + 10);
  doc.line(startX + 16, startY + 10, startX + 16 + lineLength, startY + 10);

  // Right column
  doc.text(`Date:`, doc.internal.pageSize.getWidth() / 2, startY, {
    align: "left",
  });
  doc.line(
    doc.internal.pageSize.getWidth() / 2 + 10,
    startY,
    doc.internal.pageSize.getWidth() / 2 + 10 + lineLength,
    startY
  );
  doc.text(`Score:`, doc.internal.pageSize.getWidth() / 2, startY + 5, {
    align: "left",
  });
  doc.line(
    doc.internal.pageSize.getWidth() / 2 + 10,
    startY + 5,
    doc.internal.pageSize.getWidth() / 2 + 10 + lineLength,
    startY + 5
  );

  //   instructions
  doc.text(
    `Instructions: Read each questions/statements carefully, and choose the answer that best fit the question.`,
    14,
    85
  );

  let currentY = 95;

  rows.forEach((q, index) => {
    let imageDrawn = false;
    autoTable(doc, {
      startY: index === 0 ? currentY : doc.lastAutoTable.finalY + 5,
      theme: "plain",
      showHead: "firstPage",
      styles: { fontSize: 10 },
      head: [["___________", `${index + 1}. ${q.question}`]],
      columnStyles: { 0: { cellWidth: 30 } },
      body: q.answers.map((a, i) => [
        ``,
        `${String.fromCharCode(97 + i)}. ${a.answer}`,
      ]),

      didDrawCell: function (data) {
        if (imageDrawn || !q.image) return;

        const desiredHeight = 40;
        const img = new Image();
        img.src = q.image;
        console.log("img:", img);

        if (data.row.index === 0 && data.column.index === 1) {
          const x = data.cell.x;
          const y = data.cell.y + data.cell.height;
          const imageWidth = 60;

          const test = {
            image: q.image,
            x: data.cell.x,
            y: data.cell.y,
            cellHeight: data.cell.height,
            width: imageWidth,
            rowIndex: data.row.index,
            columnIndex: data.column.index,
          };

          doc.addImage(q.image, "JPEG", x, y, imageWidth, desiredHeight);
          imageDrawn = true;
          // console.log(test);
        }
      },
    });
  });

  doc.save(`${filename}.pdf`);
};

export default Exam_pdf;
