import nu_logo from "./images/nu_logo.png";
import nud_assess_logo from "../../assets/images/logo_icon.png";
import jsPDF from "jspdf";

const set_pdf_header = (doc) => {
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("NU DASMARINAS", 105, 20, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Sampaloc 1 Bridge, SM Dasmarinas, Governor's Dr, Dasmariñas, Philippines",
    105,
    28,
    { align: "center" }
  );
  doc.addImage(nu_logo, "PNG", 15, 10, 20, 20);
  doc.addImage(nud_assess_logo, "PNG", 175, 10, 20, 20);
};

export default set_pdf_header;
