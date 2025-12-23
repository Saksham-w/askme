import mongoose from "mongoose";

// Define a connection object to track the connection status
type ConnectionObject = {
  isConnected?: number;
};

// Initialize the connection object to an empty object
const connection: ConnectionObject = {};

// Function to connect to the MongoDB database
export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    // Check if already connected by checking isConnected property from connection object ie it will be 0 if disconnected and 1 if connected
    console.log("Already Connected To DB");
    return;
  }

  // If not connected, establish a new connection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {}); // Connect to MongoDB using the connection string from environment variables
    connection.isConnected = db.connections[0].readyState; // Update the connection status to reflect the current state ie it becomes 1 when connected
    console.log("DB Connected Succesfully");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
}
