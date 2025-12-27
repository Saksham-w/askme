import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { id, is, th } from "zod/locales";
import { email } from "zod";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }],
          });
          if (!user) {
            throw new Error("No user found with the given email.");
          }
          if (!user.isVerified) {
            throw new Error("User email is not verified.");
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordValid) {
            return user;
          } else {
            throw new Error("Invalid password.");
          }
        } catch (err) {
          throw new Error(
            "Error during authentication: " + (err as Error).message
          );
        }
      },
    }),
  ],
};
