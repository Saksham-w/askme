"use client";

import { toast } from "sonner";
import { Message } from "@/model/User";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { set } from "mongoose";
import { User } from "next-auth";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Copy, LinkIcon, Loader2, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dashboard page component
const page = () => {
  const [messages, setMessages] = useState<Message[]>([]); // State to hold messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false); // State for switch loading indicator

  // Handler to delete a message from the state
  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  // Get user session from next-auth
  const { data: session } = useSession();
  // Initialize form with zod resolver
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  // Destructure form methods
  const { register, watch, setValue } = form;

  // Watch acceptMessages value from the form to sync with switch ie checked state
  const acceptMessages = watch("acceptMessages");

  // Fetch accept message status from the server
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      // Make API call to get accept message status
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Failed to fetch accept message status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch messages from the server
  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        // Make API call to get messages
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        // Show toast if it's a manual refresh
        if (refresh) {
          toast.success("Messages refreshed");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? "Failed to fetch messages"
        );
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setIsSwitchLoading]
  );

  // Fetch accept message status and messages on component mount or session change ie auto reload messages
  useEffect(() => {
    if (!session || !session.user) return; // If no session, do nothing
    fetchAcceptMessage();
    fetchMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessage]);

  // Handler for switch change to update accept message status on btn toggle
  const handleSwitchChange = async () => {
    try {
      // Make API call to update accept message status
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Failed to update accept message status"
      );
    }
  };

  // If no session or user, prompt to log in
  if (!session || !session.user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  // Construct profile URL for the user
  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  // Function to copy profile URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className=" container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your anonymous messages and settings
            </p>
          </div>

          {/* Share Link Section */}
          <section
            className="glass rounded-2xl border-glass-border p-6 mb-8"
            aria-labelledby="share-link-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LinkIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="share-link-heading" className="font-semibold">
                  Your Unique Link
                </h2>
                <p className="text-sm text-muted-foreground">
                  Share this link to receive anonymous messages
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 bg-secondary/50 border-border"
                aria-label="Your profile URL"
              />
              <Button
                onClick={copyToClipboard}
                className="bg-primary text-primary-foreground hover:bg-primary/30 hover:text-foreground gap-2 cursor-pointer"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy Link
              </Button>
            </div>
          </section>

          {/* Settings Section */}
          <section
            className="glass rounded-2xl border-glass-border p-6 mb-8"
            aria-labelledby="settings-heading"
          >
            <h2 id="settings-heading" className="sr-only">
              Message Settings
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="accept-messages"
                  className="text-base font-medium cursor-pointer"
                >
                  Accept Messages
                </Label>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    acceptMessages
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {acceptMessages ? "Active" : "Paused"}
                </span>
              </div>
              <Switch
                className="cursor-pointer"
                id="accept-messages"
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                aria-describedby="accept-messages-description"
              />
            </div>
            <p
              id="accept-messages-description"
              className="text-sm text-muted-foreground mt-2"
            >
              {acceptMessages
                ? "You're currently receiving anonymous messages"
                : "You won't receive new messages until you turn this back on"}
            </p>
          </section>

          {/* Messages Section */}
          <section aria-labelledby="messages-heading">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="messages-heading" className="text-xl font-semibold">
                  Your Messages
                </h2>
                <p className="text-sm text-muted-foreground">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}{" "}
                  received
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMessage(true)}
                disabled={isLoading}
                className="border-border hover:text-foreground hover:bg-secondary gap-2 cursor-pointer"
                aria-label="Refresh messages"
              >
                {isLoading ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                )}
                Refresh
              </Button>
            </div>

            {messages.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {messages.map((message) => (
                  <MessageCard
                    key={message._id.toString()}
                    message={message} // Pass message data
                    onMessageDelete={handleDeleteMessage} // Pass delete handler to MessageCard for removing message after deletion from server
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl border-glass-border">
                <p className="text-muted-foreground mb-2">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  Share your link to start receiving anonymous feedback
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
export default page;
