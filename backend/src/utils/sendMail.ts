import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { env } from "./env";


const sendEmail = async (
  email: string,
  subject: string,
  content: Mailgen.Content,
) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "CodeWarrior",
      link: "https://codewarrior.app",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(content);
  const emailHtml = mailGenerator.generate(content);

  const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_SMTP_HOST,
    port: env.MAILTRAP_SMTP_PORT,
    auth: {
      user: env.MAILTRAP_SMTP_USER,
      pass: env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: email,
    subject: subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error: any) {
    console.log(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file",
    );
    console.log("Error: ", error);
  }
};

const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string,
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string,
) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
