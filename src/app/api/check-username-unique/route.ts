import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z, { success } from "zod";
import { usernamevalidation } from "@/schemas/signUpSchema";

// Schema to validate the username query parameter
const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

// Handler for GET requests to check username uniqueness
export async function GET(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    // Parse the username from the request URL
    const { searchParams } = new URL(request.url);
    // Validate the username using the defined schema
    const queryParam = {
      username: searchParams.get("username"),
    };
    // Perform schema validation and log the result ie the data from query param
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);
    // If validation fails, return error response
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid username",
          errors: usernameErrors,
        },
        {
          status: 400,
        }
      );
    }

    // If validation succeeds, check if username is already taken by a verified user
    const { username } = result.data;

    // Query the database for existing verified user with the given username
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // If a verified user with the username exists, return error response
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    // If username is unique, return success response
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking username",
      },
      {
        status: 500,
      }
    );
  }
}
