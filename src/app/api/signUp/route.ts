import { dbConnect } from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../helpers/sendVerificationEmail";

// API route to handle user sign-up
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
  } catch (error) {
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
