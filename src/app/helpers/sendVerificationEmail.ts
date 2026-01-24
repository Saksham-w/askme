import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../email/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
) {
  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sakshamshrestha.dev@gmail.com", // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD!, // App Password from .env
      },
    });

    // Render the React email component to HTML string
    const htmlContent = await render(
      VerificationEmail({ username, otp: verifyCode }),
    );

    // Send the email
    await transporter.sendMail({
      from: '"OTP Sender" <sakshamshrestha.dev@gmail.com>', // Sender name and email
      to: email, // Recipient email
      subject: "Your Verification Code", // Email subject
      html: htmlContent, // HTML content
    });

    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
