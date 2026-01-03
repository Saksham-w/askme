import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { success } from "zod";

// API route to handle accepting messages preference
export async function Post(request: Request) {
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
  // Extract the user ID
  const userId = user._id;
  // Parse the request body to get the acceptMessages value
  const acceptMessages = await request.json();

  try {
    // Update the user's isAcceptingMessages status in the database with the new value
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    // If the user update fails, return an error response
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }
    // Return a success response with the updated user data
    return Response.json(
      {
        success: true,
        message: "User status updated to accept messages",
        data: updatedUser,
      },
      { status: 200 }
    );
    // Catch any errors that occur during the update process
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

// API route to get the current accepting messages preference
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
  // Extract the user ID
  const userId = user._id;

  try {
    // Find the user in the database by ID
    const foundUser = await UserModel.findById(userId);
    // If the user is not found, return an error response
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // Return a success response with the user's isAcceptingMessages status
    return Response.json(
      {
        success: true,
        message: "User retrieved successfully",
        data: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
    // Catch any errors that occur during the retrieval process
  } catch (error) {
    console.log("failed to retrieve user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve user status to accept messages",
      },
      { status: 500 }
    );
  }
}
