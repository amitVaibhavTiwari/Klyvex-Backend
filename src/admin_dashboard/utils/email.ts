import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_EMAIL_API_KEY) {
  throw new Error("SENDGRID_EMAIL_API_KEY is not defined");
}
sgMail.setApiKey(process.env.SENDGRID_EMAIL_API_KEY);

if (!process.env.SENDGRID_EMAIL) {
  throw new Error("SENDGRID_EMAIL is not defined");
}
const sendgridEmail = process.env.SENDGRID_EMAIL;

export const sendStaffInvitatonEmail = async (
  link: string,
  email: string
): Promise<{ sent: boolean; error?: Error }> => {
  if (!email || !sendgridEmail) {
    return { sent: false, error: new Error("Email addresses are required") };
  }

  const msg = {
    to: email,
    from: sendgridEmail,
    subject: "Klyvex Staff Invitation Email Verification",
    html: `
    <p>Hello,</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${link}">${link}</a>
    <p>This link will expire in 15 minutes.</p>
  `,
  };

  try {
    await sgMail.send(msg);
    return { sent: true };
  } catch (error: any) {
    console.log("Error sending email:", error);
    return { sent: false, error };
  }
};
