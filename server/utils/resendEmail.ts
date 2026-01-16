import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPrescriptionEmail(to: string, doctorName: string, patientName: string, pdfBuffer: Buffer) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  return resend.emails.send({
    from: "MedScript <onboarding@resend.dev>",
    to,
    subject: `Prescription from Dr. ${doctorName}`,
    html: `
      <h2>Prescription</h2>
      <p>Hello ${patientName},</p>
      <p>Your prescription from <strong>Dr. ${doctorName}</strong> is attached to this email.</p>
      <br />
      <p> Get Well Soon - MedScript</p>
    `,
    attachments: [
        {
            filename: "prescription-${patientName}.pdf",
            content: pdfBuffer,
        },
    ],
  });
}
