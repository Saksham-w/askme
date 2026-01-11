import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();
  // Get the current session
  const session = await getServerSession(authOptions);
  // Extract the user from the session ie the authenticated user
  const user: User = session?.user;

  // If there's no session or user, return an unauthorized response
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  // Extract the user ID from the session
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    // Retrieve the user's messages from the database, sorted by createdAt in descending order
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match the user by ID
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, // Unwind the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt descending
      // Regroup the messages back into an array
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);
    // If user not found or aggregation failed, return an error response
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // Return a success response with the retrieved messages
    return Response.json(
      {
        success: true,
        message: "Messages retrieved successfully",
        messages: user[0].messages || [], // Return messages or empty array if none
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve messages",
      },
      { status: 500 }
    );
  }
}
