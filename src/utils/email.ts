import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_EMAIL_API_KEY) {
  throw new Error("SENDGRID_EMAIL_API_KEY is not defined");
}
sgMail.setApiKey(process.env.SENDGRID_EMAIL_API_KEY);

if (!process.env.SENDGRID_EMAIL) {
  throw new Error("SENDGRID_EMAIL is not defined");
}
const sendgridEmail = process.env.SENDGRID_EMAIL;

export const sendRegistrationOtpEmail = async (
  otp: string,
  email: string
): Promise<{ sent: boolean; error?: Error }> => {
  if (!email || !sendgridEmail) {
    return { sent: false, error: new Error("Email addresses are invalid") };
  }

  const msg = {
    to: email,
    from: sendgridEmail,
    subject: "Klyvex Signup Email Verification",
    text: `Your OTP is ${otp}`,
    html: `<strong>Please enter this to verify your email: ${otp}</strong>`,
  };

  try {
    await sgMail.send(msg);
    return { sent: true };
  } catch (error: any) {
    console.log("Error sending email:", error);
    console.error("SendGrid Error:", error?.response?.body || error);
    return { sent: false, error };
  }
};
