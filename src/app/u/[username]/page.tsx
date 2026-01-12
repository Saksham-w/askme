"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card, CardTitle } from "@/components/ui/card";
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

  // Parse the suggested messages ie completion for display
  const suggestedMessages = parseStringMessages(completion);

  return (
    <div className="min-h-screen flex flex-col">
      <main className=" container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <MessageCircle className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Send Anonymous Message
            </h1>
            <p className="text-muted-foreground">
              to <span className="text-primary font-medium">@{username}</span>
            </p>
          </div>

          {/* Message Form */}
          <Card className="glass border-glass-border mb-8">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Your message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className=" resize-none bg-secondary/50 border-border focus:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <FormMessage />
                          <span>{messageContent?.length || 0}/500</span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/30 hover:text-foreground h-12 gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send Anonymously
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="glass border-glass-border mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Need Inspiration?
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  className="border-primary/30 hover:bg-secondary hover:text-foreground gap-2 cursor-pointer"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Generating...
                    </>
                  ) : (
                    "Suggest Messages"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {suggestedMessages.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on a suggestion to use it
                  </p>
                  {suggestedMessages.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleMessageClick(message)}
                      className="w-full text-left p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-200"
                    >
                      <p className="text-sm">{message}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click "Suggest Messages" to get AI-powered suggestions
                </p>
              )}
            </CardContent>
          </Card>

          <Separator className="my-8 bg-border" />

          {/* CTA to Sign Up */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Want your own anonymous inbox?
            </p>
            <Link href="/sign-up">
              <Button
                variant="outline"
                className="border-primary/30 bg-primary text-background hover:bg-primary/20 dark:hover:bg-primary hover:text-foreground dark:text-foreground gap-2 group cursor-pointer"
              >
                Create Your Inbox
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Your identity is completely hidden. We don't track senders.</p>
        </div>
      </footer>
    </div>
  );
}
