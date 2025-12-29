import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { id, is, th } from "zod/locales";
import { email } from "zod";

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  // Define authentication providers
  providers: [
    // Credentials provider for email and password authentication
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // Authorization logic for credentials provider
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        // Find user by email
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }],
          });
          // If user not found or not verified, throw an error
          if (!user) {
            throw new Error("No user found with the given email.");
          }
          // Check if user is verified
          if (!user.isVerified) {
            throw new Error("User email is not verified.");
          }
          // Compare provided password with stored hashed password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // If password is valid, return user object
          if (isPasswordValid) {
            return user;
          } else {
            throw new Error("Invalid password.");
          }
          // If any error occurs, throw a generic authentication error
        } catch (err) {
          throw new Error(
            "Error during authentication: " + (err as Error).message
          );
        }
      },
    }),
  ],
  // Callbacks to customize JWT and session behavior
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach additional user info to the session object
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  // Specify custom pages for authentication
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
