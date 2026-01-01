import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z, { success } from "zod";
import { usernamevalidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);
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
