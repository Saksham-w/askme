import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

// API route to handle sending messages
export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  // Parse the request body to get the username and content of the message
  const { username, content } = await request.json();

  try {
    // Find the recipient user by username
    const user = await UserModel.findOne({ username });
    // If user not found, return an error response
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }
    // Create a new message and add it to the user's messages array
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    // push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
    // Catch any errors that occur during the process
  } catch (error) {
    console.log("failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
