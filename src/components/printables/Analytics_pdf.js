import jsPDF from "jspdf";
import set_pdf_header from "./pdf_header";
import autoTable from "jspdf-autotable";

const Analytics_pdf = (generalData, quizData, questionData) => {
  const doc = new jsPDF();

  doc.setProperties({
    title: "Analytics Report",
    subject: "Analytics Report",
    author: "NUD Assess LLC.",
    keywords: "analytics, class, quiz, report",
    creator: "NUD Assess LLC.",
    creationDate: new Date(), // Custom date
  });
  set_pdf_header(doc);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Analytics Report", 105, 45, { align: "center" });

  //   class details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Class Name: ${generalData.class_name}`, 14, 55);
  doc.text(`Data as of: ${new Date().toLocaleDateString()}`, 14, 60);
  doc.text(`Average Score: ${generalData.ave_score || 0}%`, 14, 70);
  doc.text(`Exam Count: ${generalData.exam_count || 0}`, 14, 75);
  doc.text(`Member Count: ${generalData.member_count || 0}`, 14, 80);
  doc.text(`Passing Rate: ${generalData.passing_rate || 0}%`, 14, 85);

  //   perf by quiz
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Performance by Quiz", 14, 95);
  autoTable(doc, {
    theme: "grid",
    startY: 100,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [
      [
        "Quiz Name",
        "Avg. Score",
        "Highest",
        "Lowest",
        "Passing Rate",
        "Attempts",
      ],
    ],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: quizData.perf_by_quiz.map((row) => [
      row.quiz_name,
      row.avgScore,
      row.highest,
      row.lowest,
      row.passRate + "%",
      row.attempts,
    ]),
    bodyStyles: { textColor: 20 },
  });

  //   score distribution
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Score Distribution", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    theme: "grid",
    startY: doc.lastAutoTable.finalY + 15,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [["Score Range", "Student Count"]],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: quizData.distribution.map((row) => [row.range, row.value]),
    bodyStyles: { textColor: 20 },
  });

  //perf by lesson
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Performance by Lesson", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    theme: "grid",
    startY: doc.lastAutoTable.finalY + 15,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [["Lesson Name", "Avg. Score"]],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: quizData.perf_per_lesson.map((row) => [row.title, row.score]),
    bodyStyles: { textColor: 20 },
  });

  //   perf by blooms
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Performance by Bloom's Taxonomy",
    14,
    doc.lastAutoTable.finalY + 10
  );
  autoTable(doc, {
    theme: "grid",
    startY: doc.lastAutoTable.finalY + 15,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [["Cognitive Level", "Question Count", "Avg. Score"]],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: quizData.perf_by_bloom.map((row) => [
      row.cognitive_level,
      row.question_count,
      row.ave_score,
    ]),
    bodyStyles: { textColor: 20 },
  });

  //   bloom tax
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bloom's Taxonomy Analysis", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    theme: "grid",
    startY: doc.lastAutoTable.finalY + 15,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [["Cognitive Level", "Question Count", "Percentage"]],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: quizData.bloom_tax.map((row) => [
      row.cognitive_level,
      row.question_count,
      row.percent,
    ]),
    bodyStyles: { textColor: 20 },
  });

  //   question
  // performance by question type
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Performance by Question Type", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    theme: "grid",
    startY: doc.lastAutoTable.finalY + 15,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [["Question Type", "Question Count", "Success Rate"]],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: questionData.perf_que_type.map((row) => [
      row.type,
      row.questions,
      row.successRate + "%",
    ]),
    bodyStyles: { textColor: 20 },
  });

  //detailed queztion analysis
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Question Analysis", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    theme: "grid",
    startY: doc.lastAutoTable.finalY + 15,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
    },
    head: [
      [
        "Question",
        "Subject",
        "Cognitive Level",
        "Type",
        "Usage",
        "Success Rate",
      ],
    ],
    headStyles: { fillColor: [48, 84, 150], textColor: 255 },
    body: questionData.detailed_que_analysis.map((row) => [
      row.question,
      row.sub,
      row.bloom,
      row.type,
      row.usage,
      row.successRate + "%",
    ]),
    bodyStyles: { textColor: 20 },
  });

  doc.save(`Analytics_Report_${generalData.class_name}`.replaceAll(" ", "_"));
};

export default Analytics_pdf;
