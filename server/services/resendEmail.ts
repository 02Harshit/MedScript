import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail(to: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  return await resend.emails.send({
    from: "MedScript <onboarding@resend.dev>",
    to,
    subject: "MedScript Test Email",
    html: `
      <h2>Resend is working 🎉</h2>
      <p>This email was sent from MedScript using Resend.</p>
    `,
  });
}
