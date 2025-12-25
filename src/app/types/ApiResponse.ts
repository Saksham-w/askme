import { Message } from "@/src/model/User";

// Standardized API response structure
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
