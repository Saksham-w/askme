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
    await resend.emails.send({
      // Use the RESEND LIBRARY to send an email
      from: "no-reply@askme.com",
      to: email,
      subject: "Your Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

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
