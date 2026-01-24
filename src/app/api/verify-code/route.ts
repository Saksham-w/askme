import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z, { success } from "zod";
import { usernamevalidation } from "@/schemas/signUpSchema";
import { decode } from "punycode";
import { is } from "zod/locales";

//
export async function POST(request: Request) {
  await dbConnect();

  try {
    // Extract username and code from the request body
    const { username, code } = await request.json();

    // Decode username in case it contains URL-encoded characters
    const decodedUsername = decodeURIComponent(username);
    // Find user by username
    const user = await UserModel.findOne({ username: decodedUsername });
    // If user not found, return error response
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }
    // Check if the provided code matches with the verification code created during signup and is not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    // If code is valid and not expired, verify the user
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;

      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        },
      );
    }
    // Handle different error scenarios ie if code is invalid or expired
    else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Verification code is expired or incorrect",
        },
        {
          status: 400,
        },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code or code has expired",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    // Catch any unexpected errors during the verification process
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      },
    );
  }
}
