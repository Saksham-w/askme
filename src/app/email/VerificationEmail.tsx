import { Html, Head, Heading, Text } from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

// Verification email component that is sent to users
export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
      </Head>
      <body style={{ fontFamily: "Roboto, Verdana, sans-serif" }}>
        <Heading as="h2">Hello {username},</Heading>
        <Text>
          Thank you for registering. Please use the following verification code
          to complete your registration:
        </Text>
        <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          {otp}
        </Text>
        <Text>If you did not request this code, please ignore this email.</Text>
      </body>
    </Html>
  );
}
