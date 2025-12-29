"use client ";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// AuthProvider component to wrap the application with SessionProvider
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
