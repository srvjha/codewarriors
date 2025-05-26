 import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.RESEND_API_KEY);

const sendEmail = async (
  email: string,
  subject: string,
  htmlContent: string
) => {
  try {
    await resend.emails.send({
      from: "CodeWarrior <noreply@uignite.in>", 
      to: email,
      subject: subject,
      html: htmlContent,
    });
  } catch (error: any) {
    console.log("Email service failed. Check your RESEND credentials and setup.");
    console.log("Error: ", error);
  }
};

const emailVerificationContent = (username: string, verificationUrl: string) => {
  return `
    <h2>Welcome, ${username}!</h2>
    <p>We're very excited to have you on board.</p>
    <p>To verify your email please click the button below:</p>
    <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #22BC66; color: white; text-decoration: none; border-radius: 5px;">Verify your email</a>
    <p>If you have any questions, just reply to this email—we'd love to help.</p>
  `;
};

const forgotPasswordContent = (username: string, passwordResetUrl: string) => {
  return `
    <h2>Hello, ${username}</h2>
    <p>We received a request to reset your password.</p>
    <p>Click the button below to reset it:</p>
    <a href="${passwordResetUrl}" style="padding: 10px 15px; background-color: #22BC66; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you didn't request this, feel free to ignore it.</p>
    <p>Need help? Just reply to this email.</p>
  `;
};

export {
  emailVerificationContent,
  forgotPasswordContent,
  sendEmail,
};