import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
export const resend = new Resend(process.env.REST_API_KEY);
