import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../helpers/sendVerificationEmail";

// SIGNUP API ALGORITHM:

// 1. Initialize
//    - Connect to database
//    - Parse request body (username, email, password)

// 2. Username Validation
//    - Query database for verified user with same username
//    - If found: Return error (400) - "Username already taken"

// 3. Email Check
//    - Query database for any user with same email
//    - Generate 6-digit random verification code

// 4. Existing User Handling
//    a. If user exists AND is verified:
//       - Return error (400) - "User already exists"

//    b. If user exists BUT not verified:
//       - Hash the new password
//       - Update existing user record:
//         * password → new hashed password
//         * verifyCode → new verification code
//         * verifyCodeExpiry → current time + 1 hour
//       - Save updated record

// 5. New User Creation
//    - If no user with email exists:
//      - Hash password with bcrypt (10 salt rounds)
//      - Create expiry date (current time + 1 hour)
//      - Create new user document with:
//        * username, email, hashed password
//        * verifyCode, verifyCodeExpiry
//        * isVerified: false
//        * isAcceptingMessages: true
//        * messages: []
//      - Save to database

// 6. Send Verification Email
//    - Call sendVerificationEmail(email, username, verifyCode)
//    - If email fails: Return error (500) - "Failed to send verification code"

// 7. Success Response
//    - Return success (201) - "Verification code sent to email"

// 8. Error Handling
//    - Catch any unexpected errors
//    - Log error to console
//    - Return generic error (500) - "Internal server error"

// API route to handle user sign-up
export async function POST(request: Request) {
  await dbConnect();

  // Extract user details from the request body and handle sign-up logic
  try {
    const { username, email, password } = await request.json();
    // Check if username is already taken by a verified user
    const existingUserVerificationByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // If username is taken, return an error response
    if (existingUserVerificationByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const existingUserVerificationByEmail = await UserModel.findOne({
      email,
    });
    // Generate a verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If email is registered and verified, return an error response
    if (existingUserVerificationByEmail) {
      if (existingUserVerificationByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User with this email already exists.",
          },
          { status: 400 }
        );
      }
      // If email is registered but not verified, update the existing record instead of creating a duplicate.
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserVerificationByEmail.password = hashedPassword;
        existingUserVerificationByEmail.verifyCode = verifyCode;
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry time to 1 hour from now
        existingUserVerificationByEmail.verifyCodeExpiry = expiryDate;
        await existingUserVerificationByEmail.save();
      }
    }
    // If email is not registered, create a new user record
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry time to 1 hour from now

      // Create a new user document
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // If email sending fails, return an error response
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Failed to send verification code to email.",
        },
        { status: 500 }
      );
    }

    // Return success response if everything is successful
    return Response.json(
      {
        success: true,
        message: "Verification code sent to email.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in sign-up route:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
