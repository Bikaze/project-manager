import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const fromEmail = process.env.FROM_EMAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey", // This is the literal string "apikey" for SendGrid
    pass: process.env.SEND_GRID_API,
  },
});

export const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: `TaskHub <${fromEmail}>`,
    subject,
    html,
  };

  try {
    await transporter.sendMail(msg);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
