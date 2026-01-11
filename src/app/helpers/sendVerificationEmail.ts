import { url } from "inspector";
import { resend } from "../../lib/resend";
import VerificationEmail from "../email/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

// Function to send verification email
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Define the function to send a verification email
  try {
    // Log verification code for development/testing
    // console.log("=".repeat(50));
    // console.log("📧 VERIFICATION CODE FOR:", email);
    // console.log("👤 USERNAME:", username);
    // console.log("🔑 CODE:", verifyCode);
    // console.log("=".repeat(50));

    if (!process.env.RESEND_API_KEY) {
      console.error(
        "RESEND_API_KEY is not configured in environment variables"
      );
      return {
        success: false,
        message: "Email service is not configured.",
      };
    }

    const result = await resend.emails.send({
      // Use the RESEND LIBRARY to send an email
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("Email sent successfully:", result);

    // If email is sent successfully, return success response
    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    // If there is an error sending the email, return failure response
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
