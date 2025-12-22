import { Content } from "next/font/google";
import z from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, "Message content cannot be empty")
    .max(400, "Message content cannot exceed 400 characters"),
});
