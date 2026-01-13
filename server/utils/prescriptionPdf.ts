import PDFDocument from "pdfkit";

export function generatePrescriptionPDF(
  doctor: any,
  patient: any,
  prescription: any
): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    // Header
    doc.fontSize(20).text(`Dr. ${doctor.firstName} ${doctor.lastName}`, {
      align: "center",
    });
    doc.fontSize(12).text(doctor.specialization || "MD", { align: "center" });
    doc.moveDown();

    // Patient info
    doc.fontSize(14).text("Patient Information", { underline: true });
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`);
    doc.text(`Phone: ${patient.phone || "N/A"}`);
    doc.moveDown();

    // Prescription
    doc.fontSize(14).text("Prescription", { underline: true });
    prescription.medicines.forEach((med: any, index: number) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(
        `${index + 1}. ${med.name} - ${med.dosage}`
      );
      doc.text(`   ${med.frequency} for ${med.duration}`);
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`);
      }
    });

    doc.moveDown();
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`);

    doc.end();
  });
}
