import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

// DELETE /api/delete-message/[messageid]
export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  // Extract message ID from params
  const messageid = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions); // Get user session
  const user: User = session?.user as User; // Type assertion for user

  // Check if user is authenticated
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  try {
    // Delete the message from the user's messages array using $pull
    const updatedResult = await UserModel.updateOne(
      { email: user.email },
      { $pull: { messages: { _id: messageid } } }
    );
    // Check if any document was modified if not found return 404
    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or could not be deleted",
        },
        { status: 404 }
      );
    }
    // Return success response
    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors during the process
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
