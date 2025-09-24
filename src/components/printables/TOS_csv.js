import { download, generateCsv, mkConfig } from "export-to-csv";

const TOS_csv_export = (rows, quizName) => {
  let filename = quizName.replaceAll(" ", "_");

  //   console.log(rows);
  //   console.log(total);

  const summarizeLessons = () => {
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

  const total = summarizeLessons();

  const csvConfig = mkConfig({
    useKeysAsHeaders: false,
    filename: `TOS_${filename}`, // Add date
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: `Table of Specification for ${quizName}`,
    useTextFile: false,
    useBom: true,
    columnHeaders: [
      "Topic",
      "Time spent per topic (hours)",
      "%",
      "Remembering",
      "Understanding",
      "Applying",
      "Analyzing",
      "Creating",
      "Evaluating",
      "Total Items",
    ],
  });

  const data = rows.map((item, _) => ({
    Topic: item.topic,
    "Time spent per topic (hours)": item.hours,
    "%": item.percentage,
    Remembering: item.remembering,
    Understanding: item.understanding,
    Applying: item.applying,
    Analyzing: item.analyzing,
    Creating: item.evaluating,
    Evaluating: item.creating,
    "Total Items": item.totalItems,
  }));

  data.push({
    Topic: "Total",
    "Time spent per topic (hours)": total.hours,
    "%": total.percentage,
    Remembering: total.remembering,
    Understanding: total.understanding,
    Applying: total.applying,
    Analyzing: total.analyzing,
    Creating: total.creating,
    Evaluating: total.evaluating,
    "Total Items": total.totalItems,
  });

  const csv = generateCsv(csvConfig)(data);
  download(csvConfig)(csv);
};

export default TOS_csv_export;
