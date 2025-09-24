import html2pdf from "html2pdf.js";

const env = import.meta.env;

const image_url = env.VITE_PRINTABLE_IMAGE_URL;

const generateHTML = (rows, total, quizDetail) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TOS</title>
  </head>

  <style>    
    * {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      max-width: none;
      padding: 0.5in;
      margin: 0;
    }

    .header-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 50px;
      gap: 40px;
    }
    
    .header-text {
      font-size: 14px;
      font-weight: 700;
      text-align: center;
    }

    .title-container {
      text-align: center;
      margin-bottom: 50px;
    }

    .title{
      margin: 0;
      font-size: 12px;
      font-weight: 600;
    }

    .table-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    table, th, td {
      border: 1px solid black;
      border-collapse: collapse;
      text-align: center;
      font-size: 10px;
      }
      
    table {
      padding: 5px;
      width: 100%;
      table-layout: auto;
      page-break-inside: avoid;
    }
    
    thead,
    tfoot {
      background-color: #305496;
      color: #ffffff;
    }

    th {
      font-weight: 600;
    }

    th, td{
      vertical-align: middle;
      padding: 10px;
    }

  </style>

  <body>
    <div class="container">
      <div class="header-container">
        <img src="${image_url}/nu_logo.png" alt="nu_logo" />
        <h1 class="header-text">NATIONAL UNIVERSITY - DASMARINAS</h1>
      </div>

      <div class="title-container">
        <h2 class="title">Table of Specification for ${quizDetail.name}</h2>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th rowspan="2">Topics</th>
              <th rowspan="2">Time spent on Topic (hours)</th>
              <th rowspan="2">%</th>
              <th colspan="6">Remembering</th>
              <th rowspan="2">No. of items per Topic</th>
            </tr>
            <tr>
              <th>Remembering</th>
              <th>Understanding</th>
              <th>Applying</th>
              <th>Analyzing</th>
              <th>Evaluating</th>
              <th>Creating</th>
            </tr>
            <tr></tr>
          </thead>
          <tbody>
          ${rows.map((row, _) => {
            return `<tr>
              <td>${row.topic}</td>
              <td>${row.hours}</td>
              <td>${row.percentage}</td>
              <td>${row.remembering}</td>
              <td>${row.understanding}</td>
              <td>${row.applying}</td>
              <td>${row.analyzing}</td>
              <td>${row.evaluating}</td>
              <td>${row.creating}</td>
              <td>${row.totalItems}</td>
            </tr>`;
          })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>${total.hours}</td>
              <td>${total.percentage}</td>
              <td>${total.remembering}</td>
              <td>${total.understanding}</td>
              <td>${total.applying}</td>
              <td>${total.analyzing}</td>
              <td>${total.evaluating}</td>
              <td>${total.creating}</td>
              <td>${total.totalItems}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </body>
</html>
`;

  return html;
};

const TOS_pdf_export = (rows, total, quizDetail) => {
  const html = generateHTML(rows, total, quizDetail);
  const filename = `TOS_${quizDetail.name.replace(/\s+/g, "_")}.pdf`;

  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  // Generate and download PDF
  html2pdf()
    .set({
      margin: 0.5,
      filename: filename,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    })
    .from(container)
    .save()
    .then(() => {
      document.body.removeChild(container); // Clean up
    });
};

export default TOS_pdf_export;
