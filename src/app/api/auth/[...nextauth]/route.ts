import NextAuth from "next-auth";
import { authOptions } from "./option";

export const handler = NextAuth(authOptions); // Initialize NextAuth with the provided options

export { handler as GET, handler as POST }; // Export handler for both GET and POST requests
