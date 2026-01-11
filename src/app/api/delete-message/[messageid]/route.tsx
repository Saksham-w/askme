import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

// DELETE /api/delete-message/[messageid]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  // Extract message ID from params (params is now a Promise in Next.js 15)
  const { messageid } = await params;
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
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
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
