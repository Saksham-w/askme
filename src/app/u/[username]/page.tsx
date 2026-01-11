"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/app/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSchema } from "@/schemas/messageSchema";

// Function to parse the message string into an array of messages
const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];
  return messageString.split("||").filter((msg) => msg.trim() !== "");
};

// Main component for sending messages
export default function SendMessage() {
  // Get the username from the URL parameters
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [completion, setCompletion] = useState("");
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form with zod validation
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  // Watch the content field for changes
  const messageContent = form.watch("content");

  // Handle clicking on a suggested message to populate the textarea
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission to send the message
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success(response.data.message || "Message sent successfully");
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch suggested messages from the API
  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
      });
      const text = await response.text();
      setCompletion(text);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch suggested messages");
      toast.error("Failed to fetch suggested messages");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Parse the suggested messages for display
  const suggestedMessages = parseStringMessages(completion);

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field} // Spread the field props to Textarea
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? "Generating..." : "Suggest Messages"}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : isSuggestLoading ? (
              <p className="text-gray-500">Loading suggestions...</p>
            ) : suggestedMessages.length === 0 ? (
              <p className="text-gray-500">
                Click &quot;Suggest Messages&quot; to get suggestions
              </p>
            ) : (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 text-left justify-start h-auto py-3"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
