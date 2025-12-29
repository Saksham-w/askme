"use client";
import { useSession, signIn, signOut } from "next-auth/react";

// Component to handle sign-in and sign-out functionality
export default function Component() {
  const { data: session } = useSession();
  // Check if the user is signed in
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  // If not signed in, show sign-in button
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
