import mongoose from "mongoose";

// Define a connection object to track the connection status
type ConnectionObject = {
  isConnected?: number;
};

// Initialize the connection object
const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected To DB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Succesfully");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
}
