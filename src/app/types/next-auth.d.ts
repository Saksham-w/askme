import "next-auth";
import { int } from "zod";

declare module "next-auth" {
  interface User {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id: string;
      isVerified: boolean;
      isAcceptingMessages: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username?: string;
  }
}
