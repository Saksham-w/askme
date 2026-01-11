"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
// import dayjs from "dayjs";
import { X, Clock } from "lucide-react";
import { Message } from "@/model/User";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
// import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/app/types/ApiResponse";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

// Props type for MessageCard component
type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

// MessageCard component to display individual messages
export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    // Handle message deletion on confirmation
    try {
      // Make API call to delete the message
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      // Notify parent component about the deletion
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to delete message"
      );
    }
  };

  return (
    <Card className="glass glow border-glass-border group transition-all duration-300 hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <p className="text-foreground leading-relaxed flex-1">
            {message.content}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                aria-label="Delete message"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass border-glass-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The message will be permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border hover:bg-secondary">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {message.createdAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <time dateTime={new Date(message.createdAt).toISOString()}>
              {new Date(message.createdAt).toLocaleString()}
            </time>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
