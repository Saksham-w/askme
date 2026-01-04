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
      { $match: { id: userId } }, // Match the user by ID
      { $unwind: "$messages" }, // Unwind the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt descending
      // Regroup the messages back into an array
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);
    // If user not found, return an error response
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Failed to retrieve messages",
        },
        { status: 401 }
      );
    }
    // Return a success response with the retrieved messages
    return Response.json(
      {
        success: true,
        message: "Messages retrieved successfully",
        data: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {}
}
